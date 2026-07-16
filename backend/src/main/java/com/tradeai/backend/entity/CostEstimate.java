package com.tradeai.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cost_estimates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CostEstimate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    @Column(name = "manufacturing_cost", nullable = false)
    private BigDecimal manufacturingCost;

    @Column(name = "shipping_cost")
    private BigDecimal shippingCost;

    @Column(name = "insurance_cost")
    private BigDecimal insuranceCost;

    private BigDecimal tariff;

    private BigDecimal tax;

    @Column(name = "total_cost", nullable = false)
    private BigDecimal totalCost;

    @Column(name = "selling_price", nullable = false)
    private BigDecimal sellingPrice;

    @Column(name = "estimated_profit", nullable = false)
    private BigDecimal estimatedProfit;
}
