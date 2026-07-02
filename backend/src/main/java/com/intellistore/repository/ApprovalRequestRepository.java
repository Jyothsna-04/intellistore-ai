package com.intellistore.repository;

import com.intellistore.entity.ApprovalRequest;
import com.intellistore.entity.ApprovalStatus;
import com.intellistore.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ApprovalRequestRepository extends JpaRepository<ApprovalRequest, UUID> {
    List<ApprovalRequest> findByApproverAndStatus(User approver, ApprovalStatus status);
    List<ApprovalRequest> findByStatus(ApprovalStatus status);
    List<ApprovalRequest> findByRequestedByAndStatus(User requestedBy, ApprovalStatus status);
}
