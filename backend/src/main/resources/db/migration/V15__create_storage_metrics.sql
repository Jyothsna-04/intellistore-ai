-- =============================================================================
-- V15: Create storage_metrics table
-- Milestone: M3 - Dashboard & M6 - Analytics
-- =============================================================================

CREATE TABLE storage_metrics (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID, -- NULL means organization-wide metric
    department          VARCHAR(100), -- NULL means individual/org metric
    total_files         BIGINT          NOT NULL DEFAULT 0,
    total_size_bytes    BIGINT          NOT NULL DEFAULT 0,
    hot_tier_bytes      BIGINT          NOT NULL DEFAULT 0,
    warm_tier_bytes     BIGINT          NOT NULL DEFAULT 0,
    cold_tier_bytes     BIGINT          NOT NULL DEFAULT 0,
    archive_tier_bytes  BIGINT          NOT NULL DEFAULT 0,
    duplicate_bytes     BIGINT          NOT NULL DEFAULT 0,
    health_score        DOUBLE PRECISION NOT NULL DEFAULT 100.0,
    recorded_at         TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE storage_metrics IS 'Tracks daily or hourly storage snapshots for charts and health scores';
CREATE INDEX idx_metrics_recorded ON storage_metrics(recorded_at DESC);
CREATE INDEX idx_metrics_user ON storage_metrics(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_metrics_dept ON storage_metrics(department) WHERE department IS NOT NULL;
