package com.intellistore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileVersionDto {
    private UUID id;
    private UUID fileId;
    private int versionNumber;
    private long sizeBytes;
    private String checksumSha256;
    private String changeSummary;
    private UUID createdBy;
    private String createdAt;
}
