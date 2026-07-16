package com.tradeai.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String role; // EXPORTER, IMPORTER, LOGISTICS_PARTNER, ADMIN

    @Column(name = "language_preference", length = 10)
    private String languagePreference = "EN";

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
