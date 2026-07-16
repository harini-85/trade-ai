package com.tradeai.backend.controller;

import com.tradeai.backend.entity.ComplianceRule;
import com.tradeai.backend.repository.ComplianceRuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/compliance-rules")
@RequiredArgsConstructor
public class RuleController {

    private final ComplianceRuleRepository complianceRuleRepository;

    @GetMapping
    public ResponseEntity<List<ComplianceRule>> getAllRules() {
        return ResponseEntity.ok(complianceRuleRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ComplianceRule> createRule(@RequestBody ComplianceRule rule) {
        return ResponseEntity.ok(complianceRuleRepository.save(rule));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ComplianceRule> updateRule(@PathVariable Long id, @RequestBody ComplianceRule details) {
        return complianceRuleRepository.findById(id)
                .map(r -> {
                    r.setProductCategory(details.getProductCategory());
                    r.setRequiredDocuments(details.getRequiredDocuments());
                    r.setRequiredCertifications(details.getRequiredCertifications());
                    r.setPackagingRules(details.getPackagingRules());
                    r.setLabelingRules(details.getLabelingRules());
                    r.setSourceUrl(details.getSourceUrl());
                    return ResponseEntity.ok(complianceRuleRepository.save(r));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteRule(@PathVariable Long id) {
        return complianceRuleRepository.findById(id)
                .map(r -> {
                    complianceRuleRepository.delete(r);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
