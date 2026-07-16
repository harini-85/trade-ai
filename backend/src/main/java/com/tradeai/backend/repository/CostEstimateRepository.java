package com.tradeai.backend.repository;

import com.tradeai.backend.entity.CostEstimate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CostEstimateRepository extends JpaRepository<CostEstimate, Long> {
    Optional<CostEstimate> findByProductIdAndCountryId(Long productId, Long countryId);
    List<CostEstimate> findByProductId(Long productId);
}
