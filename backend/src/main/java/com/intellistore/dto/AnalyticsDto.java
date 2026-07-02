package com.intellistore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDto {
    private long totalFiles;
    private long totalFolders;
    private long totalStorageUsedBytes;
    private long totalStorageQuotaBytes;
    private double storageUtilizationPercent;
    private long totalUsers;
    private long activeUsers;
    private long totalShares;
    private Map<String, Long> storageByMimeType;
    private Map<String, Long> storageByDepartment;
    private Map<String, Long> filesUploadedByMonth;
}
