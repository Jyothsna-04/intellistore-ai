package com.intellistore.service;

import com.intellistore.entity.SecurityLog;
import com.intellistore.repository.SecurityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.OffsetDateTime;

/**
 * Service responsible for persisting audit log entries.
 */
@Service
@RequiredArgsConstructor
public class SecurityLogService {

    private final SecurityLogRepository securityLogRepository;

    /**
     * Create a new audit log entry.
     *
     * @param action      Description of the action (e.g., "FILE_UPLOAD").
     * @param performedBy Identifier of the user performing the action (username or UUID).
     * @param details     Optional free‑form details (e.g., file name, object key).
     */
    public SecurityLog logAction(String action, String performedBy, String details) {
        SecurityLog log = SecurityLog.builder()
                .action(action)
                .performedBy(performedBy)
                .details(details)
                .performedAt(OffsetDateTime.now())
                .build();
        return securityLogRepository.save(log);
    }
}
