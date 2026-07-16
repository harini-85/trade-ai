package com.tradeai.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "countries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Country {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String region;

    @Column(name = "demand_index")
    private Double demandIndex = 0.0;

    @Column(name = "logistics_score")
    private Double logisticsScore = 0.0;

    @Column(name = "risk_score")
    private Double riskScore = 0.0;
}
