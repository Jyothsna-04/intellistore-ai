package com.intellistore.repository;

import com.intellistore.entity.WorkflowStep;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface WorkflowStepRepository extends JpaRepository<WorkflowStep, UUID> {
}
