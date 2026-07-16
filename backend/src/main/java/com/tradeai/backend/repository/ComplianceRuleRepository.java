package com.tradeai.backend.repository;

import com.tradeai.backend.entity.ComplianceRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplianceRuleRepository extends JpaRepository<ComplianceRule, Long> {
    Optional<ComplianceRule> findByCountryIdAndProductCategory(Long countryId, String productCategory);
    List<ComplianceRule> findByCountryId(Long countryId);
}
