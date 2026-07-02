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
public class FolderDto {
    private UUID id;
    private String name;
    private UUID parentId;
    private UUID ownerId;
    private String path;
    private boolean isShared;
    private String createdAt;
    private String updatedAt;
}
