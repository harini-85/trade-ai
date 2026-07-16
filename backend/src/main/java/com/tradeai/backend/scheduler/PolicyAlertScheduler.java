package com.tradeai.backend.scheduler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tradeai.backend.entity.ComplianceRule;
import com.tradeai.backend.entity.Country;
import com.tradeai.backend.entity.PolicyAlert;
import com.tradeai.backend.repository.ComplianceRuleRepository;
import com.tradeai.backend.repository.CountryRepository;
import com.tradeai.backend.repository.PolicyAlertRepository;
import com.tradeai.backend.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class PolicyAlertScheduler {

    private final CountryRepository countryRepository;
    private final ComplianceRuleRepository complianceRuleRepository;
    private final PolicyAlertRepository policyAlertRepository;
    private final AIService aiService;
    private final ObjectMapper objectMapper;

    // Run every 24 hours (86400000 ms)
    @Scheduled(fixedRate = 86400000)
    public void checkForPolicyDrift() {
        List<Country> countries = countryRepository.findAll();
        for (Country country : countries) {
            List<ComplianceRule> rules = complianceRuleRepository.findByCountryId(country.getId());
            for (ComplianceRule rule : rules) {
                try {
                    // Call RAG check to see if regulations have drifted
                    Map<String, Object> latestRules = aiService.getComplianceSearch(rule.getProductCategory(), country.getName());
                    List<String> latestDocs = (List<String>) latestRules.get("required_documents");

                    List<String> cachedDocs = objectMapper.readValue(rule.getRequiredDocuments(), List.class);

                    // Check for structural differences
                    if (latestDocs != null && latestDocs.size() != cachedDocs.size()) {
                        String summary = "Regulatory alert: Required import document count changed for " +
                                rule.getProductCategory() + " in " + country.getName() + 
                                ". Previous count: " + cachedDocs.size() + ", Current count: " + latestDocs.size();

                        PolicyAlert alert = PolicyAlert.builder()
                                .country(country)
                                .ruleId(rule.getId())
                                .changeSummary(summary)
                                .notified(false)
                                .build();

                        policyAlertRepository.save(alert);
                        
                        // Update cache to prevent repeated alerts
                        rule.setRequiredDocuments(objectMapper.writeValueAsString(latestDocs));
                        complianceRuleRepository.save(rule);
                    }
                } catch (Exception e) {
                    // Log error and continue
                }
            }
        }
    }
}
