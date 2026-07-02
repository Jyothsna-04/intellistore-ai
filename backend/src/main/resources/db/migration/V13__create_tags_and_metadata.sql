-- =============================================================================
-- V13: Create tags and metadata tables
-- Milestone: M4 - Search & Metadata Engine
-- =============================================================================

CREATE TABLE tags (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100)    NOT NULL,
    owner_id        UUID            NOT NULL,
    color           VARCHAR(7), -- Hex color code e.g. #FF5733
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_tags_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_tag_name_owner UNIQUE (name, owner_id)
);

CREATE TABLE file_tags (
    file_id         UUID            NOT NULL,
    tag_id          UUID            NOT NULL,
    PRIMARY KEY (file_id, tag_id),
    CONSTRAINT fk_file_tags_file FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
    CONSTRAINT fk_file_tags_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE file_metadata (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id             UUID            NOT NULL UNIQUE,
    custom_properties   JSONB           NOT NULL DEFAULT '{}',
    extracted_metadata  JSONB           NOT NULL DEFAULT '{}',
    dimensions          VARCHAR(50),
    duration            DOUBLE PRECISION,
    page_count          INTEGER,
    checksum_md5        VARCHAR(32),
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_metadata_file FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
);

COMMENT ON TABLE tags IS 'Custom tagging labels created by users';
COMMENT ON TABLE file_metadata IS 'Extracted and custom metadata properties for files';
CREATE INDEX idx_file_metadata_properties ON file_metadata USING gin (custom_properties);
CREATE INDEX idx_file_metadata_extracted ON file_metadata USING gin (extracted_metadata);
