package com.intellistore.service;

import com.intellistore.dto.FileDto;
import org.springframework.stereotype.Service;

import com.intellistore.entity.File;
import com.intellistore.entity.FileVersion;
import com.intellistore.entity.Folder;
import com.intellistore.entity.User;
import com.intellistore.exception.ResourceNotFoundException;
import com.intellistore.exception.StorageException;
import com.intellistore.repository.FileRepository;
import com.intellistore.repository.FileVersionRepository;
import com.intellistore.repository.FolderRepository;
import com.intellistore.repository.UserRepository;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.security.MessageDigest;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FileService {

    private final FileRepository fileRepository;
    private final FileVersionRepository fileVersionRepository;
    private final FolderRepository folderRepository;
    private final UserRepository userRepository;
    private final MinioService minioService;

    private final ClamAVClient clamAVClient;
    private final EncryptionService encryptionService;
    private final QuarantineService quarantineService;

    public FileService(FileRepository fileRepository, FileVersionRepository fileVersionRepository,
                       FolderRepository folderRepository, UserRepository userRepository,
                       MinioService minioService, ClamAVClient clamAVClient,
                       EncryptionService encryptionService, QuarantineService quarantineService) {
        this.fileRepository = fileRepository;
        this.fileVersionRepository = fileVersionRepository;
        this.folderRepository = folderRepository;
        this.userRepository = userRepository;
        this.minioService = minioService;
        this.clamAVClient = clamAVClient;
        this.encryptionService = encryptionService;
        this.quarantineService = quarantineService;
    }

    @Transactional
    public FileDto uploadFile(MultipartFile multipartFile, UUID folderId, UUID ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Folder folder = null;
        if (folderId != null) {
            folder = folderRepository.findByIdAndDeletedAtNull(folderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Folder not found"));
        }

        // Validate quota
        long newTotalUsed = owner.getStorageUsedBytes() + multipartFile.getSize();
        if (newTotalUsed > owner.getStorageQuotaBytes()) {
            throw new StorageException("Storage quota exceeded!");
        }

        java.nio.file.Path tempFile = null;
        java.nio.file.Path encryptedFile = null;
        try {
            tempFile = java.nio.file.Files.createTempFile("upload_", ".tmp");
            multipartFile.transferTo(tempFile.toFile());

            String originalName = multipartFile.getOriginalFilename();
            if (originalName == null) originalName = "unknown_file";

            try {
                // 1. Virus Scan
                clamAVClient.scan(tempFile);
            } catch (com.intellistore.exception.VirusDetectedException vde) {
                // 2. Quarantine
                quarantineService.quarantine(tempFile, originalName, ownerId, vde.getMessage());
                throw new StorageException("File rejected due to virus detection.", vde);
            }

            // 3. Checksum (original file)
            String checksum = calculateChecksum(java.nio.file.Files.readAllBytes(tempFile));
            
            // 4. Encrypt
            EncryptionService.EncryptionResult encryptionResult = encryptionService.encrypt(tempFile);
            encryptedFile = encryptionResult.getEncryptedFilePath();

            // 5. MinIO Upload
            String objectKey = ownerId.toString() + "/" + UUID.randomUUID() + "_" + originalName;
            try (java.io.InputStream encryptedStream = java.nio.file.Files.newInputStream(encryptedFile)) {
                minioService.uploadFile(objectKey, encryptedStream, multipartFile.getContentType(), java.nio.file.Files.size(encryptedFile));
            }

            File file = File.builder()
                    .name(originalName)
                    .originalName(originalName)
                    .folder(folder)
                    .owner(owner)
                    .minioObjectKey(objectKey)
                    .mimeType(multipartFile.getContentType())
                    .sizeBytes(multipartFile.getSize())
                    .checksumSha256(checksum)
                    .build();

            File savedFile = fileRepository.save(file);
            
            // Create initial version
            FileVersion version = FileVersion.builder()
                    .file(savedFile)
                    .versionNumber(1)
                    .minioObjectKey(objectKey)
                    .sizeBytes(multipartFile.getSize())
                    .checksumSha256(checksum)
                    .changeSummary("Initial upload")
                    .createdBy(owner.getId())
                    .build();
            fileVersionRepository.save(version);

            // Update user quota
            owner.setStorageUsedBytes(newTotalUsed);
            userRepository.save(owner);

            return mapToFileDto(savedFile);
        } catch (Exception e) {
            throw new StorageException("Failed to upload file", e);
        } finally {
            if (tempFile != null) {
                try { java.nio.file.Files.deleteIfExists(tempFile); } catch (Exception ignored) {}
            }
            if (encryptedFile != null) {
                try { java.nio.file.Files.deleteIfExists(encryptedFile); } catch (Exception ignored) {}
            }
        }
    }

    @Transactional(readOnly = true)
    public List<FileDto> getFilesByFolder(UUID folderId, UUID ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<File> files;
        if (folderId == null) {
            files = fileRepository.findByOwnerAndFolderAndDeletedAtNull(owner, null);
        } else {
            Folder folder = folderRepository.findByIdAndDeletedAtNull(folderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Folder not found"));
            files = fileRepository.findByOwnerAndFolderAndDeletedAtNull(owner, folder);
        }

        return files.stream()
                .map(this::mapToFileDto)
                .collect(Collectors.toList());
    }

    private String calculateChecksum(byte[] bytes) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(bytes);
        StringBuilder hexString = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
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
