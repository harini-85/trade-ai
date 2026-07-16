package com.tradeai.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "what_if_simulations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WhatIfSimulation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "base_ranking_id")
    private Long baseRankingId;

    @Column(name = "changed_inputs", columnDefinition = "json")
    private String changedInputs; // JSON inputs modified

    @Column(name = "new_ranking", columnDefinition = "json")
    private String newRanking; // JSON comparison results

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
