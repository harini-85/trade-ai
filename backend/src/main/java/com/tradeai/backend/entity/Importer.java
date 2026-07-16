package com.tradeai.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "importers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Importer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "license_number")
    private String licenseNumber;

    @Column(name = "industry_type")
    private String industryType;

    @Column(name = "preferred_categories", columnDefinition = "json")
    private String preferredCategories; // JSON array of categories

    @Column(name = "preferred_countries", columnDefinition = "json")
    private String preferredCountries; // JSON array of countries
}
