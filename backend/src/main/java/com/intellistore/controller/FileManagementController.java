package com.intellistore.controller;

import com.intellistore.dto.ApiResponse;
import com.intellistore.dto.FileDto;
import com.intellistore.dto.FileVersionDto;
import com.intellistore.security.UserDetailsImpl;
import com.intellistore.service.TrashService;
import com.intellistore.service.VersionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
public class FileManagementController {

    private final VersionService versionService;
    private final TrashService trashService;

    public FileManagementController(VersionService versionService, TrashService trashService) {
        this.versionService = versionService;
        this.trashService = trashService;
    }

    // ========== Version Control ==========

    @GetMapping("/{fileId}/versions")
    public ResponseEntity<ApiResponse<List<FileVersionDto>>> getVersions(@PathVariable UUID fileId) {
        UserDetailsImpl userDetails = getCurrentUser();
        List<FileVersionDto> versions = versionService.getVersions(fileId, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(versions, "File versions retrieved"));
    }

    @PostMapping("/{fileId}/versions")
    public ResponseEntity<ApiResponse<FileVersionDto>> uploadNewVersion(
            @PathVariable UUID fileId,
            @RequestParam("file") MultipartFile file) {
        UserDetailsImpl userDetails = getCurrentUser();
        FileVersionDto version = versionService.uploadNewVersion(fileId, file, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(version, "New version uploaded"));
    }

    // ========== Trash / Recovery ==========

    @DeleteMapping("/{fileId}")
    public ResponseEntity<ApiResponse<Void>> deleteFile(@PathVariable UUID fileId) {
        UserDetailsImpl userDetails = getCurrentUser();
        trashService.softDeleteFile(fileId, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "File moved to trash"));
    }

    @GetMapping("/trash")
    public ResponseEntity<ApiResponse<List<FileDto>>> getTrash() {
        UserDetailsImpl userDetails = getCurrentUser();
        List<FileDto> files = trashService.getTrash(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(files, "Trash contents retrieved"));
    }

    @PostMapping("/{fileId}/restore")
    public ResponseEntity<ApiResponse<Void>> restoreFile(@PathVariable UUID fileId) {
        UserDetailsImpl userDetails = getCurrentUser();
        trashService.restoreFile(fileId, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "File restored successfully"));
    }

    @DeleteMapping("/{fileId}/permanent")
    public ResponseEntity<ApiResponse<Void>> permanentlyDelete(@PathVariable UUID fileId) {
        UserDetailsImpl userDetails = getCurrentUser();
        trashService.permanentlyDelete(fileId, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "File permanently deleted"));
    }

    private UserDetailsImpl getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserDetailsImpl) authentication.getPrincipal();
    }
}
