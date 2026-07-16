package com.tradeai.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tradeai.backend.entity.*;
import com.tradeai.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ComplianceAggregationService {

    private final ProductRepository productRepository;
    private final CountryRepository countryRepository;
    private final ComplianceRuleRepository complianceRuleRepository;
    private final CostEstimateRepository costEstimateRepository;
    private final ComplianceScoreRepository complianceScoreRepository;
    private final AIService aiService;
    private final ObjectMapper objectMapper;

    @Transactional
    public Map<String, Object> lookupAndSync(Long productId, Long countryId, boolean forceRefresh) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        Country country = countryRepository.findById(countryId)
                .orElseThrow(() -> new IllegalArgumentException("Country not found"));

        Optional<ComplianceRule> existingRule = complianceRuleRepository.findByCountryIdAndProductCategory(countryId, product.getCategory());
        Optional<CostEstimate> existingCost = costEstimateRepository.findByProductIdAndCountryId(productId, countryId);

        boolean isStale = false;
        if (existingRule.isPresent()) {
            LocalDateTime lastUpdated = existingRule.get().getLastUpdated();
            if (lastUpdated != null && ChronoUnit.DAYS.between(lastUpdated, LocalDateTime.now()) >= 30) {
                isStale = true;
            }
        } else {
            isStale = true;
        }

        if (!isStale && !forceRefresh && existingRule.isPresent() && existingCost.isPresent()) {
            // Return cached result immediately
            Map<String, Object> cachedResult = new HashMap<>();
            cachedResult.put("status", "CACHED");
            cachedResult.put("country", country);
            cachedResult.put("compliance_rule", existingRule.get());
            cachedResult.put("cost_estimate", existingCost.get());
            return cachedResult;
        }

        // Fetch from external sources via FastAPI aggregator
        Map<String, Object> response = aiService.getAggregatedData(product.getHsCode(), country.getName(), product.getManufacturingCost().doubleValue());
        if (response == null || response.isEmpty() || response.containsKey("status") && "error".equals(response.get("status"))) {
            throw new RuntimeException("Failed to fetch fresh aggregation data from microservice");
        }

        // 1. Update Country indicators
        Map<String, Object> countryMap = (Map<String, Object>) response.get("country");
        if (countryMap != null) {
            country.setDemandIndex(((Number) countryMap.get("demand_index")).doubleValue());
            country.setLogisticsScore(((Number) countryMap.get("logistics_score")).doubleValue());
            country.setRiskScore(((Number) countryMap.get("risk_score")).doubleValue());
            countryRepository.save(country);
        }

        // 2. Upsert Compliance Rule
        Map<String, Object> ruleMap = (Map<String, Object>) response.get("compliance_rule");
        ComplianceRule rule = existingRule.orElseGet(() -> ComplianceRule.builder().country(country).build());
        if (ruleMap != null) {
            rule.setProductCategory((String) ruleMap.get("product_category"));
            rule.setRequiredDocuments(serializeJson(ruleMap.get("required_documents")));
            rule.setRequiredCertifications(serializeJson(ruleMap.get("required_certifications")));
            rule.setPackagingRules(serializeJson(ruleMap.get("packaging_rules")));
            rule.setLabelingRules(serializeJson(ruleMap.get("labeling_rules")));
            rule.setSourceUrl((String) ruleMap.get("source_url"));
            rule = complianceRuleRepository.save(rule);
        }

        // 3. Upsert Cost Estimate
        Map<String, Object> costMap = (Map<String, Object>) response.get("cost_estimate");
        CostEstimate cost = existingCost.orElseGet(() -> CostEstimate.builder().product(product).country(country).build());
        if (costMap != null) {
            cost.setManufacturingCost(BigDecimal.valueOf(((Number) costMap.get("manufacturing_cost")).doubleValue()));
            cost.setShippingCost(BigDecimal.valueOf(((Number) costMap.get("shipping_cost")).doubleValue()));
            cost.setInsuranceCost(BigDecimal.valueOf(((Number) costMap.get("insurance_cost")).doubleValue()));
            cost.setTariff(BigDecimal.valueOf(((Number) costMap.get("tariff")).doubleValue()));
            cost.setTax(BigDecimal.valueOf(((Number) costMap.get("tax")).doubleValue()));
            cost.setTotalCost(BigDecimal.valueOf(((Number) costMap.get("total_cost")).doubleValue()));
            cost.setSellingPrice(BigDecimal.valueOf(((Number) costMap.get("selling_price")).doubleValue()));
            cost.setEstimatedProfit(BigDecimal.valueOf(((Number) costMap.get("estimated_profit")).doubleValue()));
            cost = costEstimateRepository.save(cost);
        }

        // 4. Update Compliance Score Complexity rating
        if (ruleMap != null) {
            try {
                List<String> requiredDocs = objectMapper.readValue(rule.getRequiredDocuments(), new TypeReference<List<String>>() {});
                List<String> requiredCerts = objectMapper.readValue(rule.getRequiredCertifications(), new TypeReference<List<String>>() {});
                
                double complexity = requiredDocs.size() * 5.0 + requiredCerts.size() * 15.0 + 5.0;
                complexity = Math.min(complexity, 100.0);
                String label = complexity <= 30 ? "LOW" : complexity <= 60 ? "MODERATE" : "HIGH";

                Optional<ComplianceScore> scoreOpt = complianceScoreRepository.findByProductIdAndCountryId(productId, countryId);
                ComplianceScore score = scoreOpt.orElseGet(() -> ComplianceScore.builder().product(product).country(country).build());
                score.setComplexityScore(complexity);
                score.setDifficultyLabel(label);
                
                Map<String, Object> breakdown = new HashMap<>();
                breakdown.put("required_documents", requiredDocs);
                breakdown.put("required_certifications", requiredCerts);
                breakdown.put("packaging_rules", rule.getPackagingRules());
                breakdown.put("labeling_rules", rule.getLabelingRules());
                breakdown.put("snippets", List.of("Ingested from " + rule.getSourceUrl()));
                
                score.setBreakdown(serializeJson(breakdown));
                complianceScoreRepository.save(score);
            } catch (Exception e) {
                // Ignore score update error
            }
        }

        Map<String, Object> mergedResult = new HashMap<>();
        mergedResult.put("status", "SYNCHRONIZED");
        mergedResult.put("country", country);
        mergedResult.put("compliance_rule", rule);
        mergedResult.put("cost_estimate", cost);
        return mergedResult;
    }

    private String serializeJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            return "[]";
        }
    }
}
