package com.intellistore.service;

import com.intellistore.entity.AuditAction;
import com.intellistore.entity.AuditLog;
import com.intellistore.repository.AuditLogRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final SseEventService sseEventService;

    public AuditLogService(AuditLogRepository auditLogRepository, @Lazy SseEventService sseEventService) {
        this.auditLogRepository = auditLogRepository;
        this.sseEventService = sseEventService;
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

        // Broadcast real-time SSE event to connected frontend clients
        String category = mapActionToCategory(action.name());
        String severity = "FAILED".equals(status) ? "WARNING" : "INFO";
        String message = (email != null ? email : "System") + " → " + action.name()
                + (resourceId != null ? " [" + resourceType + ": " + resourceId + "]" : "");

        sseEventService.broadcastEvent(SseEventService.ActivityEvent.of(
                category, action.name(), message, severity, userId, email, resourceId, status));
    }

    private String mapActionToCategory(String action) {
        return switch (action) {
            case "LOGIN", "LOGOUT", "FAILED_LOGIN", "PASSWORD_CHANGE" -> "Authentication";
            case "UPLOAD", "DOWNLOAD", "DELETE", "RESTORE" -> "Storage";
            case "SHARE_CREATE", "SHARE_REVOKE", "SHARE_ACCESS" -> "Sharing";
            case "ROLE_CHANGES", "APPROVE", "REJECT" -> "Administration";
            default -> "System";
        };
    }
}
