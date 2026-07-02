package com.intellistore.service;

import com.intellistore.dto.ShareDto;
import com.intellistore.entity.File;
import com.intellistore.entity.FileShare;
import com.intellistore.entity.SharePermission;
import com.intellistore.entity.User;
import com.intellistore.exception.ResourceNotFoundException;
import com.intellistore.repository.FileRepository;
import com.intellistore.repository.FileShareRepository;
import com.intellistore.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ShareService {

    private final FileShareRepository fileShareRepository;
    private final FileRepository fileRepository;
    private final UserRepository userRepository;

    public ShareService(FileShareRepository fileShareRepository, FileRepository fileRepository, UserRepository userRepository) {
        this.fileShareRepository = fileShareRepository;
        this.fileRepository = fileRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ShareDto shareFile(UUID fileId, UUID sharedWithUserId, SharePermission permission, OffsetDateTime expiresAt, UUID sharedByUserId) {
        File file = fileRepository.findByIdAndDeletedAtNull(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));

        if (!file.getOwner().getId().equals(sharedByUserId)) {
            throw new SecurityException("Only the file owner can share this file");
        }

        User sharedWithUser = userRepository.findById(sharedWithUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Target user not found"));

        // Check if already shared
        fileShareRepository.findByFileAndSharedWithAndIsActiveTrue(file, sharedWithUser)
                .ifPresent(existing -> {
                    throw new RuntimeException("File already shared with this user");
                });

        FileShare share = FileShare.builder()
                .file(file)
                .sharedBy(file.getOwner())
                .sharedWith(sharedWithUser)
                .permission(permission)
                .expiresAt(expiresAt)
                .shareToken(UUID.randomUUID().toString())
                .build();

        FileShare savedShare = fileShareRepository.save(share);

        file.setShared(true);
        fileRepository.save(file);

        return mapToDto(savedShare);
    }

    @Transactional(readOnly = true)
    public List<ShareDto> getSharedWithMe(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return fileShareRepository.findBySharedWithAndIsActiveTrue(user).stream()
                .filter(share -> share.getExpiresAt() == null || share.getExpiresAt().isAfter(OffsetDateTime.now()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ShareDto> getSharedByMe(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return fileShareRepository.findBySharedByAndIsActiveTrue(user).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void revokeShare(UUID shareId, UUID userId) {
        FileShare share = fileShareRepository.findById(shareId)
                .orElseThrow(() -> new ResourceNotFoundException("Share not found"));

        if (!share.getSharedBy().getId().equals(userId)) {
            throw new SecurityException("Only the person who shared the file can revoke access");
        }

        share.setActive(false);
        fileShareRepository.save(share);
    }

    private ShareDto mapToDto(FileShare share) {
        return ShareDto.builder()
                .id(share.getId())
                .fileId(share.getFile() != null ? share.getFile().getId() : null)
                .sharedWithUserId(share.getSharedWith() != null ? share.getSharedWith().getId() : null)
                .permission(share.getPermission().name())
                .sharedAt(share.getCreatedAt() != null ? share.getCreatedAt().toString() : null)
                .expiresAt(share.getExpiresAt() != null ? share.getExpiresAt().toString() : null)
                .build();
    }
}
