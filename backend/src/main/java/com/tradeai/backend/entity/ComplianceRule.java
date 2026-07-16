package com.tradeai.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "compliance_rules")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplianceRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    @Column(name = "product_category", nullable = false)
    private String productCategory;

    @Column(name = "required_documents", columnDefinition = "json")
    private String requiredDocuments; // JSON string array

    @Column(name = "required_certifications", columnDefinition = "json")
    private String requiredCertifications; // JSON string array

    @Column(name = "packaging_rules", columnDefinition = "json")
    private String packagingRules; // JSON object

    @Column(name = "labeling_rules", columnDefinition = "json")
    private String labelingRules; // JSON object

    @Column(name = "source_url", length = 512)
    private String sourceUrl;

    @Column(name = "last_updated", insertable = false, updatable = false)
    private LocalDateTime lastUpdated;
}
