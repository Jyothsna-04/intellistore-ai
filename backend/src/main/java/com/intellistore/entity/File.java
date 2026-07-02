package com.intellistore.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "files")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class File {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(name = "original_name", nullable = false)
    private String originalName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id")
    private Folder folder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "minio_object_key", nullable = false, length = 512)
    private String minioObjectKey;

    @Column(name = "mime_type", nullable = false)
    private String mimeType;

    @Column(name = "size_bytes", nullable = false)
    private long sizeBytes;

    @Column(name = "checksum_sha256", nullable = false, length = 64)
    private String checksumSha256;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "storage_tier", nullable = false, length = 50)
    private StorageTier storageTier = StorageTier.HOT;

    @Builder.Default
    @Column(name = "is_duplicate", nullable = false)
    private boolean isDuplicate = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "duplicate_of_id")
    private File duplicateOf;

    private String classification;

    @Column(name = "classification_conf")
    private Double classificationConf;

    @Builder.Default
    @Column(name = "version_number", nullable = false)
    private int versionNumber = 1;

    @Builder.Default
    @Column(name = "is_current_version", nullable = false)
    private boolean isCurrentVersion = true;

    @Builder.Default
    @Column(name = "access_count", nullable = false)
    private long accessCount = 0;

    @Column(name = "last_accessed_at")
    private OffsetDateTime lastAccessedAt;

    @Builder.Default
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Builder.Default
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    @Builder.Default
    @Column(name = "is_shared", nullable = false)
    private boolean shared = false;

    @Column(name = "deleted_at")
    private OffsetDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
        updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
