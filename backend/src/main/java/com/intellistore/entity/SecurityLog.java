package com.intellistore.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "security_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SecurityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String action;

    @Column(nullable = false)
    private String performedBy;

    @Column(nullable = false)
    private OffsetDateTime performedAt;

    @Column(length = 1024)
    private String details;

    @Column(name = "severity")
    private String severity;

    @Column(name = "resolved_at")
    private OffsetDateTime resolvedAt;

    @Column(name = "event_type")
    private String eventType;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "email")
    private String email;

    @Column(name = "description")
    private String description;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "user_agent")
    private String userAgent;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;
}
