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
public class ShareDto {
    private UUID id;
    private UUID fileId;
    private UUID sharedWithUserId;
    private String permission;
    private String sharedAt;
    private String expiresAt;
}
