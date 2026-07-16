package com.tradeai.backend.repository;

import com.tradeai.backend.entity.Importer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ImporterRepository extends JpaRepository<Importer, Long> {
    Optional<Importer> findByUserId(Long userId);
}
