package com.tradeai.backend.controller;

import com.tradeai.backend.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/cost-estimates")
@RequiredArgsConstructor
public class CostController {

    private final AIService aiService;

    @PostMapping("/estimate")
    public ResponseEntity<?> getEstimate(@RequestBody Map<String, Object> costPayload) {
        try {
            Map<String, Object> estimate = aiService.getCostEstimate(costPayload);
            return ResponseEntity.ok(estimate);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
