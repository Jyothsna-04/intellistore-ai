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
public class FileDto {
    private UUID id;
    private String name;
    private String originalName;
    private UUID folderId;
    private UUID ownerId;
    private String mimeType;
    private long sizeBytes;
    private String checksumSha256;
    private String storageTier;
    private boolean isDuplicate;
    private UUID duplicateOfId;
    private int versionNumber;
    private boolean isCurrentVersion;
    private String createdAt;
    private String updatedAt;
}
