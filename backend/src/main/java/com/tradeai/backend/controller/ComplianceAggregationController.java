package com.tradeai.backend.controller;

import com.tradeai.backend.service.ComplianceAggregationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/compliance")
@RequiredArgsConstructor
public class ComplianceAggregationController {

    private final ComplianceAggregationService complianceAggregationService;

    @PostMapping("/lookup")
    public ResponseEntity<?> lookupCompliance(@RequestBody Map<String, Object> payload) {
        try {
            Long productId = ((Number) payload.get("product_id")).longValue();
            Long countryId = ((Number) payload.get("country_id")).longValue();
            boolean forceRefresh = payload.get("force_refresh") != null && (boolean) payload.get("force_refresh");

            Map<String, Object> result = complianceAggregationService.lookupAndSync(productId, countryId, forceRefresh);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Sync compilation failed: " + e.getMessage());
        }
    }
}
