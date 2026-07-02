package com.intellistore.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "storage_metrics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StorageMetrics {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id")
    private UUID userId;

    private String department;

    @Builder.Default
    @Column(name = "total_files", nullable = false)
    private long totalFiles = 0;

    @Builder.Default
    @Column(name = "total_size_bytes", nullable = false)
    private long totalSizeBytes = 0;

    @Builder.Default
    @Column(name = "hot_tier_bytes", nullable = false)
    private long hotTierBytes = 0;

    @Builder.Default
    @Column(name = "warm_tier_bytes", nullable = false)
    private long warmTierBytes = 0;

    @Builder.Default
    @Column(name = "cold_tier_bytes", nullable = false)
    private long coldTierBytes = 0;

    @Builder.Default
    @Column(name = "archive_tier_bytes", nullable = false)
    private long archiveTierBytes = 0;

    @Builder.Default
    @Column(name = "duplicate_bytes", nullable = false)
    private long duplicateBytes = 0;

    @Builder.Default
    @Column(name = "health_score", nullable = false)
    private double healthScore = 100.0;

    @Builder.Default
    @Column(name = "recorded_at", nullable = false)
    private OffsetDateTime recordedAt = OffsetDateTime.now();
}
