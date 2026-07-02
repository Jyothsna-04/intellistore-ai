package com.intellistore.controller;

import com.intellistore.dto.ApiResponse;
import com.intellistore.dto.FileDto;
import com.intellistore.dto.FolderCreateRequest;
import com.intellistore.dto.FolderDto;
import com.intellistore.security.UserDetailsImpl;
import com.intellistore.service.FileService;
import com.intellistore.service.FolderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/storage")
public class StorageController {

    private final FileService fileService;
    private final FolderService folderService;

    public StorageController(FileService fileService, FolderService folderService) {
        this.fileService = fileService;
        this.folderService = folderService;
    }

    @PostMapping("/folders")
    public ResponseEntity<ApiResponse<FolderDto>> createFolder(@Valid @RequestBody FolderCreateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        FolderDto folder = folderService.createFolder(request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(folder, "Folder created successfully"));
    }

    @GetMapping("/folders")
    public ResponseEntity<ApiResponse<List<FolderDto>>> getFolders(@RequestParam(required = false) UUID parentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        List<FolderDto> folders = folderService.getFoldersByParent(parentId, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(folders, "Folders retrieved successfully"));
    }

    @PostMapping("/files")
    public ResponseEntity<ApiResponse<FileDto>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) UUID folderId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        FileDto fileDto = fileService.uploadFile(file, folderId, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(fileDto, "File uploaded successfully"));
    }

    @GetMapping("/files")
    public ResponseEntity<ApiResponse<List<FileDto>>> getFiles(@RequestParam(required = false) UUID folderId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        List<FileDto> files = fileService.getFilesByFolder(folderId, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(files, "Files retrieved successfully"));
    }
}
