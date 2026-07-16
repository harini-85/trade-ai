package com.tradeai.backend.repository;

import com.tradeai.backend.entity.LogisticsQuote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogisticsQuoteRepository extends JpaRepository<LogisticsQuote, Long> {
    List<LogisticsQuote> findByLogisticsPartnerId(Long partnerId);
    List<LogisticsQuote> findByPurchaseRequestId(Long requestId);
}
