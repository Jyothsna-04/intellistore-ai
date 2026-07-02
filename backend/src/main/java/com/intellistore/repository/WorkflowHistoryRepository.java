package com.intellistore.repository;

import com.intellistore.entity.WorkflowHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface WorkflowHistoryRepository extends JpaRepository<WorkflowHistory, UUID> {
    Page<WorkflowHistory> findByWorkflowId(UUID workflowId, Pageable pageable);
}
