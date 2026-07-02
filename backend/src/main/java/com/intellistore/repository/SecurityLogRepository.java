package com.intellistore.repository;

import com.intellistore.entity.SecurityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface SecurityLogRepository extends JpaRepository<SecurityLog, UUID> {
    Page<SecurityLog> findBySeverity(String severity, Pageable pageable);
    Page<SecurityLog> findByResolvedAtIsNull(Pageable pageable);
}
