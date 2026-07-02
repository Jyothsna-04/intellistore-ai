package com.intellistore.service;

import com.intellistore.dto.FileDto;
import com.intellistore.entity.File;
import com.intellistore.entity.User;
import com.intellistore.exception.ResourceNotFoundException;
import com.intellistore.repository.FileRepository;
import com.intellistore.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TrashService {

    private static final int RETENTION_DAYS = 30;

    private final FileRepository fileRepository;
    private final UserRepository userRepository;
    private final MinioService minioService;

    public TrashService(FileRepository fileRepository, UserRepository userRepository, MinioService minioService) {
        this.fileRepository = fileRepository;
        this.userRepository = userRepository;
        this.minioService = minioService;
    }

    @Transactional
    public void softDeleteFile(UUID fileId, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        File file = fileRepository.findByIdAndOwnerAndDeletedAtNull(fileId, user)
                .orElseThrow(() -> new ResourceNotFoundException("File not found or not owned by you"));

        file.setDeletedAt(OffsetDateTime.now());
        fileRepository.save(file);

        // Free storage quota
        user.setStorageUsedBytes(Math.max(0, user.getStorageUsedBytes() - file.getSizeBytes()));
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<FileDto> getTrash(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return fileRepository.findByOwnerAndDeletedAtNotNull(user).stream()
                .filter(file -> file.getDeletedAt().isAfter(OffsetDateTime.now().minusDays(RETENTION_DAYS)))
                .map(this::mapToFileDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void restoreFile(UUID fileId, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        File file = fileRepository.findByIdAndOwnerAndDeletedAtNotNull(fileId, user)
                .orElseThrow(() -> new ResourceNotFoundException("File not found in trash"));

        if (file.getDeletedAt().isBefore(OffsetDateTime.now().minusDays(RETENTION_DAYS))) {
            throw new RuntimeException("File retention period has expired and cannot be restored");
        }

        // Re-add to quota
        user.setStorageUsedBytes(user.getStorageUsedBytes() + file.getSizeBytes());
        userRepository.save(user);

        file.setDeletedAt(null);
        fileRepository.save(file);
    }

    @Transactional
    public void permanentlyDelete(UUID fileId, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        File file = fileRepository.findByIdAndOwnerAndDeletedAtNotNull(fileId, user)
                .orElseThrow(() -> new ResourceNotFoundException("File not found in trash"));

        minioService.deleteFile(file.getMinioObjectKey());
        fileRepository.delete(file);
    }

    private FileDto mapToFileDto(File file) {
        return FileDto.builder()
                .id(file.getId())
                .name(file.getName())
                .originalName(file.getOriginalName())
                .folderId(file.getFolder() != null ? file.getFolder().getId() : null)
                .ownerId(file.getOwner().getId())
                .mimeType(file.getMimeType())
                .sizeBytes(file.getSizeBytes())
                .checksumSha256(file.getChecksumSha256())
                .storageTier(file.getStorageTier().name())
                .isDuplicate(file.isDuplicate())
                .duplicateOfId(file.getDuplicateOf() != null ? file.getDuplicateOf().getId() : null)
                .versionNumber(file.getVersionNumber())
                .isCurrentVersion(file.isCurrentVersion())
                .createdAt(file.getCreatedAt().toString())
                .updatedAt(file.getUpdatedAt().toString())
                .build();
    }
}
