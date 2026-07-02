package com.intellistore.repository;

import com.intellistore.entity.StorageMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StorageMetricsRepository extends JpaRepository<StorageMetrics, UUID> {
    Optional<StorageMetrics> findFirstByUserIdIsNullAndDepartmentIsNullOrderByRecordedAtDesc();
    Optional<StorageMetrics> findFirstByUserIdOrderByRecordedAtDesc(UUID userId);
    Optional<StorageMetrics> findFirstByDepartmentOrderByRecordedAtDesc(String department);
    List<StorageMetrics> findByUserIdIsNullAndDepartmentIsNullOrderByRecordedAtAsc();
}
