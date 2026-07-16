package com.tradeai.backend.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tradeai.backend.dto.ProductDto;
import com.tradeai.backend.entity.*;
import com.tradeai.backend.repository.*;
import com.tradeai.backend.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CountryRepository countryRepository;
    private final ComplianceRuleRepository complianceRuleRepository;
    private final ComplianceScoreRepository complianceScoreRepository;
    private final CostEstimateRepository costEstimateRepository;
    private final CountryRankingRepository countryRankingRepository;
    private final WhatIfSimulationRepository whatIfSimulationRepository;
    private final AIService aiService;
    private final ObjectMapper objectMapper;

    private User getAuthenticatedUser() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @GetMapping
    public ResponseEntity<List<Product>> getProducts() {
        User user = getAuthenticatedUser();
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.ok(productRepository.findAll());
        }
        return ResponseEntity.ok(productRepository.findByExporterId(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody ProductDto dto) {
        User user = getAuthenticatedUser();
        
        Product product = Product.builder()
                .exporter(user)
                .name(dto.getName())
                .category(dto.getCategory())
                .description(dto.getDescription())
                .hsCode(dto.getHsCode())
                .manufacturingCost(dto.getManufacturingCost())
                .build();
        
        Product savedProduct = productRepository.save(product);

        // TRIGGER END-TO-END PIPELINE FOR ALL CANDIDATE COUNTRIES
        List<Country> countries = countryRepository.findAll();
        List<Map<String, Object>> rankingCandidates = new ArrayList<>();

        for (Country country : countries) {
            // 1. Fetch RAG Search to get rules
            Map<String, Object> complianceSearch = aiService.getComplianceSearch(product.getCategory(), country.getName());
            
            // 2. Fetch Compliance Complexity Score
            Map<String, Object> scorePayload = new HashMap<>();
            scorePayload.put("required_documents", complianceSearch.get("required_documents"));
            scorePayload.put("required_certifications", complianceSearch.get("required_certifications"));
            Map<String, Object> scoreRes = aiService.getComplianceScore(scorePayload);
            
            Double compScore = ((Number) scoreRes.getOrDefault("complexity_score", 0.0)).doubleValue();
            String diffLabel = (String) scoreRes.getOrDefault("difficulty_label", "LOW");

            ComplianceScore scoreEntity = ComplianceScore.builder()
                    .product(savedProduct)
                    .country(country)
                    .complexityScore(compScore)
                    .difficultyLabel(diffLabel)
                    .breakdown(serializeJson(complianceSearch))
                    .build();
            complianceScoreRepository.save(scoreEntity);

            // 3. Compute Landed Cost
            Map<String, Object> costPayload = new HashMap<>();
            costPayload.put("manufacturing_cost", product.getManufacturingCost());
            costPayload.put("shipping_cost", country.getName().equalsIgnoreCase("Germany") ? 45.00 : country.getName().equalsIgnoreCase("UAE") ? 30.00 : 35.00);
            costPayload.put("insurance_cost", country.getName().equalsIgnoreCase("Germany") ? 12.00 : country.getName().equalsIgnoreCase("UAE") ? 10.00 : 8.00);
            
            Map<String, Object> costRes = aiService.getCostEstimate(costPayload);

            CostEstimate costEntity = CostEstimate.builder()
                    .product(savedProduct)
                    .country(country)
                    .manufacturingCost(product.getManufacturingCost())
                    .shippingCost(BigDecimal.valueOf(((Number) costRes.get("shipping_cost")).doubleValue()))
                    .insuranceCost(BigDecimal.valueOf(((Number) costRes.get("insurance_cost")).doubleValue()))
                    .tariff(BigDecimal.valueOf(((Number) costRes.get("tariff")).doubleValue()))
                    .tax(BigDecimal.valueOf(((Number) costRes.get("tax")).doubleValue()))
                    .totalCost(BigDecimal.valueOf(((Number) costRes.get("total_cost")).doubleValue()))
                    .sellingPrice(BigDecimal.valueOf(((Number) costRes.get("selling_price")).doubleValue()))
                    .estimatedProfit(BigDecimal.valueOf(((Number) costRes.get("estimated_profit")).doubleValue()))
                    .build();
            costEstimateRepository.save(costEntity);

            // Assemble input details for XGBoost country ranker
            Map<String, Object> candidateMap = new HashMap<>();
            candidateMap.put("country_id", country.getId());
            candidateMap.put("country_name", country.getName());
            candidateMap.put("demand_index", country.getDemandIndex());
            candidateMap.put("logistics_score", country.getLogisticsScore());
            candidateMap.put("risk_score", country.getRiskScore());
            candidateMap.put("compliance_score", 100.0 - compScore);
            candidateMap.put("total_cost", costEntity.getTotalCost().doubleValue());
            candidateMap.put("estimated_profit", costEntity.getEstimatedProfit().doubleValue());
            rankingCandidates.add(candidateMap);
        }

        // 4. Compute XGBoost Rankings + SHAP breakdowns
        Map<String, Object> rankPayload = new HashMap<>();
        rankPayload.put("product_name", product.getName());
        rankPayload.put("candidates", rankingCandidates);

        Map<String, Object> rankRes = aiService.computeCountryRankings(rankPayload);
        List<Map<String, Object>> rankList = (List<Map<String, Object>>) rankRes.get("rankings");

        if (rankList != null) {
            for (Map<String, Object> ranked : rankList) {
                Long cId = ((Number) ranked.get("country_id")).longValue();
                Country country = countryRepository.findById(cId).orElse(null);
                if (country != null) {
                    CountryRanking rankingEntity = CountryRanking.builder()
                            .product(savedProduct)
                            .country(country)
                            .xgbPredictedScore(((Number) ranked.get("xgb_score")).doubleValue())
                            .rank(((Number) ranked.get("rank")).intValue())
                            .shapBreakdown(serializeJson(ranked.get("shap_breakdown")))
                            .modelVersion("1.0.0")
                            .build();
                    countryRankingRepository.save(rankingEntity);
                }
            }
        }

        return ResponseEntity.ok(savedProduct);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id).orElse(null);
        if (product == null) return ResponseEntity.notFound().build();
        
        productRepository.delete(product);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/rankings")
    public ResponseEntity<List<CountryRanking>> getRankings(@PathVariable Long id) {
        return ResponseEntity.ok(countryRankingRepository.findByProductIdOrderByRankAsc(id));
    }

    @GetMapping("/{id}/compliance/{countryId}")
    public ResponseEntity<ComplianceScore> getComplianceScore(@PathVariable Long id, @PathVariable Long countryId) {
        return complianceScoreRepository.findByProductIdAndCountryId(id, countryId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/cost/{countryId}")
    public ResponseEntity<CostEstimate> getCostEstimate(@PathVariable Long id, @PathVariable Long countryId) {
        return costEstimateRepository.findByProductIdAndCountryId(id, countryId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/what-if")
    public ResponseEntity<?> runWhatIf(@PathVariable Long id, @RequestBody Map<String, Object> inputs) {
        User user = getAuthenticatedUser();
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        Long countryId = ((Number) inputs.get("country_id")).longValue();
        Country country = countryRepository.findById(countryId)
                .orElseThrow(() -> new IllegalArgumentException("Country not found"));

        // Assemble request payload
        Map<String, Object> whatIfPayload = new HashMap<>();
        whatIfPayload.put("manufacturing_cost", inputs.getOrDefault("manufacturing_cost", product.getManufacturingCost()));
        whatIfPayload.put("shipping_cost", inputs.get("shipping_cost"));
        whatIfPayload.put("insurance_cost", inputs.get("insurance_cost"));
        
        // Add updated rules if any certificates toggled
        List<String> certifications = (List<String>) inputs.get("certifications");
        whatIfPayload.put("certifications", certifications);
        whatIfPayload.put("demand_index", country.getDemandIndex());
        whatIfPayload.put("logistics_score", country.getLogisticsScore());
        whatIfPayload.put("risk_score", country.getRiskScore());

        // Dynamic compliance_score calculation based on missing certifications
        ComplianceRule rule = complianceRuleRepository.findByCountryIdAndProductCategory(country.getId(), product.getCategory())
                .orElse(null);
        double complianceScore = 80.0;
        if (rule != null) {
            try {
                List<String> required = objectMapper.readValue(rule.getRequiredCertifications(), new TypeReference<List<String>>() {});
                long missingCount = required.stream().filter(c -> certifications == null || !certifications.contains(c)).count();
                double complexity = 3 * 5.0 + missingCount * 15.0 + 5.0;
                complianceScore = 100.0 - Math.min(complexity, 100.0);
            } catch (Exception e) {
                // fallback
            }
        }
        whatIfPayload.put("compliance_score", complianceScore);

        Map<String, Object> result = aiService.getWhatIfSimulation(whatIfPayload);

        // Save simulation audit log
        WhatIfSimulation simulation = WhatIfSimulation.builder()
                .user(user)
                .product(product)
                .baseRankingId(countryId)
                .changedInputs(serializeJson(inputs))
                .newRanking(serializeJson(result))
                .build();
        whatIfSimulationRepository.save(simulation);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/explain/{countryId}")
    public ResponseEntity<?> explainRanking(@PathVariable Long id, @PathVariable Long countryId, @RequestBody Map<String, String> body) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        Country country = countryRepository.findById(countryId)
                .orElseThrow(() -> new IllegalArgumentException("Country not found"));
        
        CountryRanking ranking = countryRankingRepository.findByProductIdAndCountryId(id, countryId)
                .orElseThrow(() -> new IllegalArgumentException("Ranking not found"));

        ComplianceScore compliance = complianceScoreRepository.findByProductIdAndCountryId(id, countryId)
                .orElseThrow(() -> new IllegalArgumentException("Compliance score not found"));

        Map<String, Object> explainPayload = new HashMap<>();
        explainPayload.put("product_name", product.getName());
        explainPayload.put("country_name", country.getName());
        explainPayload.put("xgb_score", ranking.getXgbPredictedScore());
        
        try {
            explainPayload.put("shap_breakdown", objectMapper.readValue(ranking.getShapBreakdown(), Map.class));
            explainPayload.put("compliance_rules", objectMapper.readValue(compliance.getBreakdown(), Map.class));
        } catch (Exception e) {
            explainPayload.put("shap_breakdown", new HashMap<>());
            explainPayload.put("compliance_rules", new HashMap<>());
        }

        explainPayload.put("language", body.getOrDefault("language", "EN"));

        Map<String, Object> explanation = aiService.getAssistantExplanation(explainPayload);
        return ResponseEntity.ok(explanation);
    }

    @PostMapping("/{id}/chat/{countryId}")
    public ResponseEntity<?> assistantChat(
            @PathVariable Long id,
            @PathVariable Long countryId,
            @RequestBody Map<String, String> body) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        Country country = countryRepository.findById(countryId)
                .orElseThrow(() -> new IllegalArgumentException("Country not found"));

        // Load compliance data for RAG grounding
        Map<String, Object> complianceRules = new HashMap<>();
        Double complexityScore = null;
        ComplianceScore compScore = complianceScoreRepository
                .findByProductIdAndCountryId(id, countryId).orElse(null);
        if (compScore != null) {
            complexityScore = compScore.getComplexityScore();
            try {
                complianceRules = objectMapper.readValue(compScore.getBreakdown(), Map.class);
            } catch (Exception ignored) {}
        }

        Map<String, Object> chatPayload = new HashMap<>();
        chatPayload.put("message", body.getOrDefault("message", ""));
        chatPayload.put("language", body.getOrDefault("language", "EN"));
        chatPayload.put("context_product", product.getName());
        chatPayload.put("context_country", country.getName());
        chatPayload.put("compliance_rules", complianceRules);
        if (complexityScore != null) {
            chatPayload.put("complexity_score", complexityScore);
        }

        Map<String, Object> result = aiService.getAssistantChat(chatPayload);
        return ResponseEntity.ok(result);
    }

    private String serializeJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            return "{}";
        }
    }
}

