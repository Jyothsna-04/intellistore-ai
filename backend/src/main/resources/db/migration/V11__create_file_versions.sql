-- =============================================================================
-- V11: Create file_versions table
-- Milestone: M2 - Enterprise Storage
-- =============================================================================

CREATE TABLE file_versions (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id             UUID            NOT NULL,
    version_number      INTEGER         NOT NULL,
    minio_object_key    VARCHAR(512)    NOT NULL,
    size_bytes          BIGINT          NOT NULL,
    checksum_sha256     VARCHAR(64)     NOT NULL,
    change_summary      TEXT,
    created_by          UUID            NOT NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_file_versions_file FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
    CONSTRAINT fk_file_versions_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_file_version UNIQUE (file_id, version_number)
);

COMMENT ON TABLE file_versions IS 'Tracks historical versions of files';
CREATE INDEX idx_file_versions_file ON file_versions(file_id);
