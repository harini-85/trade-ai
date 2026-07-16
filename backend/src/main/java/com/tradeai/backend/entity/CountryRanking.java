package com.tradeai.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "country_rankings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CountryRanking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    @Column(name = "xgb_predicted_score", nullable = false)
    private Double xgbPredictedScore;

    @Column(name = "`rank`", nullable = false)
    private Integer rank;

    @Column(name = "shap_breakdown", columnDefinition = "json")
    private String shapBreakdown; // JSON breakdown

    @Column(name = "model_version")
    private String modelVersion = "1.0.0";

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
