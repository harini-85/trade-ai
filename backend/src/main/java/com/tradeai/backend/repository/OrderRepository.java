package com.tradeai.backend.repository;

import com.tradeai.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByPurchaseRequestImporterId(Long importerId);
    List<Order> findByPurchaseRequestProductExporterId(Long exporterId);
    List<Order> findByQuoteLogisticsPartnerId(Long logisticsPartnerId);
}
