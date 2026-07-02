package com.intellistore.service;

import com.intellistore.dto.AnalyticsDto;
import com.intellistore.repository.FileRepository;
import com.intellistore.repository.FileShareRepository;
import com.intellistore.repository.FolderRepository;
import com.intellistore.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class AnalyticsService {

    private final UserRepository userRepository;
    private final FileRepository fileRepository;
    private final FolderRepository folderRepository;
    private final FileShareRepository fileShareRepository;

    public AnalyticsService(UserRepository userRepository, FileRepository fileRepository,
                            FolderRepository folderRepository, FileShareRepository fileShareRepository) {
        this.userRepository = userRepository;
        this.fileRepository = fileRepository;
        this.folderRepository = folderRepository;
        this.fileShareRepository = fileShareRepository;
    }

    @Transactional(readOnly = true)
    public AnalyticsDto getDashboardAnalytics() {
        long totalFiles = fileRepository.count();
        long totalFolders = folderRepository.count();
        long totalUsers = userRepository.count();
        long totalShares = fileShareRepository.count();

        // Aggregate storage usage from users
        long totalStorageUsed = userRepository.findAll().stream()
                .mapToLong(u -> u.getStorageUsedBytes())
                .sum();

        long totalStorageQuota = userRepository.findAll().stream()
                .mapToLong(u -> u.getStorageQuotaBytes())
                .sum();

        double utilizationPercent = totalStorageQuota > 0
                ? (double) totalStorageUsed / totalStorageQuota * 100.0
                : 0.0;

        // Active users: those who logged in within last 30 days
        long activeUsers = userRepository.findAll().stream()
                .filter(u -> u.getLastLoginAt() != null)
                .filter(u -> u.getLastLoginAt().isAfter(java.time.OffsetDateTime.now().minusDays(30)))
                .count();

        // Storage by department
        Map<String, Long> storageByDepartment = new HashMap<>();
        userRepository.findAll().forEach(user -> {
            String dept = user.getDepartment() != null ? user.getDepartment() : "Unassigned";
            storageByDepartment.merge(dept, user.getStorageUsedBytes(), (a, b) -> a + b);
        });

        // Storage by MIME type (aggregate from all files)
        Map<String, Long> storageByMimeType = new HashMap<>();
        fileRepository.findAll().forEach(file -> {
            if (file.getDeletedAt() == null) {
                String mime = file.getMimeType() != null ? file.getMimeType() : "unknown";
                storageByMimeType.merge(mime, file.getSizeBytes(), (a, b) -> a + b);
            }
        });

        return AnalyticsDto.builder()
                .totalFiles(totalFiles)
                .totalFolders(totalFolders)
                .totalStorageUsedBytes(totalStorageUsed)
                .totalStorageQuotaBytes(totalStorageQuota)
                .storageUtilizationPercent(Math.round(utilizationPercent * 100.0) / 100.0)
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .totalShares(totalShares)
                .storageByMimeType(storageByMimeType)
                .storageByDepartment(storageByDepartment)
                .filesUploadedByMonth(new HashMap<>()) // Placeholder — can be filled with custom JPQL later
                .build();
    }
}
