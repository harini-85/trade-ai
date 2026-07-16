package com.tradeai.backend.repository;

import com.tradeai.backend.entity.ComplianceScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplianceScoreRepository extends JpaRepository<ComplianceScore, Long> {
    Optional<ComplianceScore> findByProductIdAndCountryId(Long productId, Long countryId);
    List<ComplianceScore> findByProductId(Long productId);
}
