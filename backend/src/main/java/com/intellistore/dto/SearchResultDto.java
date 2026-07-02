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
public class SearchResultDto {
    private UUID id;
    private String name;
    private String type; // FILE or FOLDER
    private String mimeType;
    private long sizeBytes;
    private UUID parentFolderId;
    private String ownerName;
    private String createdAt;
}
