package com.tradeai.backend.repository;

import com.tradeai.backend.entity.WhatIfSimulation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WhatIfSimulationRepository extends JpaRepository<WhatIfSimulation, Long> {
    List<WhatIfSimulation> findByUserIdAndProductId(Long userId, Long productId);
}
