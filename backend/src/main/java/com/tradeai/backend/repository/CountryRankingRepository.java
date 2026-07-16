package com.tradeai.backend.repository;

import com.tradeai.backend.entity.CountryRanking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CountryRankingRepository extends JpaRepository<CountryRanking, Long> {
    List<CountryRanking> findByProductIdOrderByRankAsc(Long productId);
    Optional<CountryRanking> findByProductIdAndCountryId(Long productId, Long countryId);
    void deleteByProductId(Long productId);
}
