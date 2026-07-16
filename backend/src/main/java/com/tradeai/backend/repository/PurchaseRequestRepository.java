package com.tradeai.backend.repository;

import com.tradeai.backend.entity.PurchaseRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseRequestRepository extends JpaRepository<PurchaseRequest, Long> {
    List<PurchaseRequest> findByImporterId(Long importerId);
    List<PurchaseRequest> findByProductExporterId(Long exporterId);
}
