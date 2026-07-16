package com.tradeai.backend.repository;

import com.tradeai.backend.entity.LogisticsPartner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LogisticsPartnerRepository extends JpaRepository<LogisticsPartner, Long> {
    Optional<LogisticsPartner> findByUserId(Long userId);
}
