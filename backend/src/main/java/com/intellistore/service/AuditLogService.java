package com.intellistore.service;

import com.intellistore.entity.AuditAction;
import com.intellistore.entity.AuditLog;
import com.intellistore.repository.AuditLogRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Async
    @Transactional
    public void logAction(UUID userId, String email, AuditAction action, String resourceType, String resourceId, String details, String ipAddress, String userAgent, String status) {
        AuditLog log = AuditLog.builder()
                .userId(userId)
                .email(email)
                .action(action)
                .resourceType(resourceType)
                .resourceId(resourceId)
                .details(details)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .status(status)
                .build();
        auditLogRepository.save(log);
    }
}
