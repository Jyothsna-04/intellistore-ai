package com.intellistore.service;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.InputStream;

@Service
@Slf4j
public class MinioService {

    private final MinioClient minioClient;

    @Value("${minio.bucket-name}")
    private String bucketName;

    public MinioService(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    public void uploadFile(String objectKey, InputStream inputStream, String contentType, long size) {
        uploadToBucket(bucketName, objectKey, inputStream, contentType, size);
    }

    public void uploadToBucket(String targetBucket, String objectKey, InputStream inputStream, String contentType, long size) {
        try {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(targetBucket)
                            .object(objectKey)
                            .stream(inputStream, size, -1)
                            .contentType(contentType)
                            .build()
            );
            log.info("Uploaded object {} to MinIO bucket {}", objectKey, targetBucket);
        } catch (Exception e) {
            log.error("Error uploading to MinIO bucket {}", targetBucket, e);
            throw new RuntimeException("Error uploading file to storage");
        }
    }

    public InputStream downloadFile(String objectKey) {
        try {
            return minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectKey)
                            .build()
            );
        } catch (Exception e) {
            log.error("Error downloading from MinIO", e);
            throw new RuntimeException("Error downloading file from storage");
        }
    }

    public void deleteFile(String objectKey) {
        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectKey)
                            .build()
            );
            log.info("Deleted object {} from MinIO bucket {}", objectKey, bucketName);
        } catch (Exception e) {
            log.error("Error deleting from MinIO", e);
            throw new RuntimeException("Error deleting file from storage");
        }
    }
}
