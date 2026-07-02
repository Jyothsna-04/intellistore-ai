package com.intellistore.controller;

import com.intellistore.dto.ApiResponse;
import com.intellistore.dto.ShareDto;
import com.intellistore.entity.SharePermission;
import com.intellistore.security.UserDetailsImpl;
import com.intellistore.service.ShareService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/shares")
public class ShareController {

    private final ShareService shareService;

    public ShareController(ShareService shareService) {
        this.shareService = shareService;
    }

    @PostMapping("/file/{fileId}")
    public ResponseEntity<ApiResponse<ShareDto>> shareFile(
            @PathVariable UUID fileId,
            @RequestParam UUID sharedWithUserId,
            @RequestParam SharePermission permission,
            @RequestParam(required = false) String expiresAt) {

        UserDetailsImpl userDetails = getCurrentUser();
        OffsetDateTime expiration = expiresAt != null ? OffsetDateTime.parse(expiresAt) : null;

        ShareDto share = shareService.shareFile(fileId, sharedWithUserId, permission, expiration, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(share, "File shared successfully"));
    }

    @GetMapping("/shared-with-me")
    public ResponseEntity<ApiResponse<List<ShareDto>>> getSharedWithMe() {
        UserDetailsImpl userDetails = getCurrentUser();
        List<ShareDto> shares = shareService.getSharedWithMe(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(shares, "Shared files retrieved successfully"));
    }

    @GetMapping("/shared-by-me")
    public ResponseEntity<ApiResponse<List<ShareDto>>> getSharedByMe() {
        UserDetailsImpl userDetails = getCurrentUser();
        List<ShareDto> shares = shareService.getSharedByMe(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(shares, "Shared files retrieved successfully"));
    }

    @DeleteMapping("/{shareId}")
    public ResponseEntity<ApiResponse<Void>> revokeShare(@PathVariable UUID shareId) {
        UserDetailsImpl userDetails = getCurrentUser();
        shareService.revokeShare(shareId, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "Share revoked successfully"));
    }

    private UserDetailsImpl getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserDetailsImpl) authentication.getPrincipal();
    }
}
