package com.intellistore.repository;

import com.intellistore.entity.Workflow;
import com.intellistore.entity.WorkflowTriggerType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface WorkflowRepository extends JpaRepository<Workflow, UUID> {
    List<Workflow> findByIsActiveTrue();
    List<Workflow> findByTriggerTypeAndIsActiveTrue(WorkflowTriggerType triggerType);
}
