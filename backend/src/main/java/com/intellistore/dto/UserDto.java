package com.intellistore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private UUID id;
    private String email;
    private String fullName;
    private String avatarUrl;
    private String department;
    private String jobTitle;
    private List<String> roles;
    private long storageQuotaBytes;
    private long storageUsedBytes;
}
