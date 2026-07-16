package com.tradeai.backend.repository;

import com.tradeai.backend.entity.PolicyAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PolicyAlertRepository extends JpaRepository<PolicyAlert, Long> {
    List<PolicyAlert> findByNotifiedFalse();
}
