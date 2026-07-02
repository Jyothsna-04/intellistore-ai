package com.intellistore.service;

import com.intellistore.exception.QuarantineException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class QuarantineService {
    private static final Logger log = LoggerFactory.getLogger(QuarantineService.class);

    private final MinioService minioService;

    @Value("${minio.bucket.quarantine:quarantine}")
    private String quarantineBucket;

    public QuarantineService(MinioService minioService) {
        this.minioService = minioService;
    }

    /**
     * Uploads an infected file to the quarantine bucket.
     * @param file The infected file.
     * @param originalName The original filename.
     * @param ownerId The ID of the user who uploaded it.
     * @param virusInfo Information about the detected virus.
     */
    public void quarantine(Path file, String originalName, UUID ownerId, String virusInfo) {
        String quarantineKey = ownerId.toString() + "/" + UUID.randomUUID() + "_QUARANTINE_" + originalName;
        
        log.warn("Quarantining file {} due to virus: {}", originalName, virusInfo);

        try (InputStream is = Files.newInputStream(file)) {
            long size = Files.size(file);
            minioService.uploadToBucket(quarantineBucket, quarantineKey, is, "application/octet-stream", size);
            // In a full enterprise system, we would also persist a QuarantineRecord in the DB here
            // and trigger an async security notification.
        } catch (Exception e) {
            log.error("Failed to move file to quarantine bucket", e);
            throw new QuarantineException("Failed to quarantine infected file", e);
        }
    }
}
