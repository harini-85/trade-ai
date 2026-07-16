package com.tradeai.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "compliance_scores")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplianceScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    @Column(name = "complexity_score")
    private Double complexityScore = 0.0;

    @Column(name = "difficulty_label")
    private String difficultyLabel; // LOW, MODERATE, HIGH

    @Column(columnDefinition = "json")
    private String breakdown; // JSON details
}
