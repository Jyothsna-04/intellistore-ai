package com.intellistore.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "recent_files")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecentFile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_id", nullable = false)
    private File file;

    @Builder.Default
    @Column(name = "accessed_at", nullable = false)
    private OffsetDateTime accessedAt = OffsetDateTime.now();
}
