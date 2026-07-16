package com.tradeai.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "logistics_partners")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LogisticsPartner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "services_offered", columnDefinition = "json")
    private String servicesOffered; // JSON array of services

    @Column(name = "regions_served", columnDefinition = "json")
    private String regionsServed; // JSON array of regions
}
