package com.intellistore.service;

import com.intellistore.dto.FileVersionDto;
import com.intellistore.entity.File;
import com.intellistore.entity.FileVersion;
import com.intellistore.entity.User;
import com.intellistore.exception.ResourceNotFoundException;
import com.intellistore.repository.FileRepository;
import com.intellistore.repository.FileVersionRepository;
import com.intellistore.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.security.MessageDigest;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class VersionService {

    private final FileVersionRepository fileVersionRepository;
    private final FileRepository fileRepository;
    private final UserRepository userRepository;
    private final MinioService minioService;

    public VersionService(FileVersionRepository fileVersionRepository, FileRepository fileRepository,
                          UserRepository userRepository, MinioService minioService) {
        this.fileVersionRepository = fileVersionRepository;
        this.fileRepository = fileRepository;
        this.userRepository = userRepository;
        this.minioService = minioService;
    }

    @Transactional(readOnly = true)
    public List<FileVersionDto> getVersions(UUID fileId, UUID userId) {
        File file = fileRepository.findByIdAndDeletedAtNull(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));

        return fileVersionRepository.findByFileOrderByVersionNumberDesc(file).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public FileVersionDto uploadNewVersion(UUID fileId, MultipartFile multipartFile, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        File file = fileRepository.findByIdAndOwnerAndDeletedAtNull(fileId, user)
                .orElseThrow(() -> new ResourceNotFoundException("File not found or not owned by you"));

        try {
            byte[] bytes = multipartFile.getBytes();
            String checksum = calculateChecksum(bytes);
            String objectKey = userId + "/" + UUID.randomUUID() + "_v_" + file.getOriginalName();

            minioService.uploadFile(objectKey, multipartFile.getInputStream(), multipartFile.getContentType(), multipartFile.getSize());

            // Find max version
            List<FileVersion> existingVersions = fileVersionRepository.findByFileOrderByVersionNumberDesc(file);
            int nextVersion = existingVersions.isEmpty() ? 1 : existingVersions.get(0).getVersionNumber() + 1;

            FileVersion version = FileVersion.builder()
                    .file(file)
                    .versionNumber(nextVersion)
                    .minioObjectKey(objectKey)
                    .sizeBytes(multipartFile.getSize())
                    .checksumSha256(checksum)
                    .changeSummary("Version " + nextVersion)
                    .createdBy(userId)
                    .build();

            FileVersion saved = fileVersionRepository.save(version);

            // Update the main file record to reflect the latest version
            file.setVersionNumber(nextVersion);
            file.setMinioObjectKey(objectKey);
            file.setSizeBytes(multipartFile.getSize());
            file.setChecksumSha256(checksum);
            fileRepository.save(file);

            // Update user storage usage
            user.setStorageUsedBytes(user.getStorageUsedBytes() + multipartFile.getSize());
            userRepository.save(user);

            return mapToDto(saved);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload new version", e);
        }
    }

    private String calculateChecksum(byte[] bytes) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(bytes);
        StringBuilder hexString = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }

    private FileVersionDto mapToDto(FileVersion version) {
        return FileVersionDto.builder()
                .id(version.getId())
                .fileId(version.getFile().getId())
                .versionNumber(version.getVersionNumber())
                .sizeBytes(version.getSizeBytes())
                .checksumSha256(version.getChecksumSha256())
                .changeSummary(version.getChangeSummary())
                .createdBy(version.getCreatedBy())
                .createdAt(version.getCreatedAt().toString())
                .build();
    }
}
