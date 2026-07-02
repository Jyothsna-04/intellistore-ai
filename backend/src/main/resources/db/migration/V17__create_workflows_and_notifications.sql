-- =============================================================================
-- V17: Create workflow automation and notifications tables
-- Milestone: M7 - Workflow Automation & Notifications
-- =============================================================================

CREATE TABLE notifications (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID            NOT NULL,
    type            VARCHAR(100)    NOT NULL, -- STORAGE_WARNING, QUOTA_WARNING, WORKFLOW_SUCCESS, WORKFLOW_FAILURE, APPROVAL_REQUIRED, SHARE_REQUEST
    title           VARCHAR(255)    NOT NULL,
    message         TEXT            NOT NULL,
    is_read         BOOLEAN         NOT NULL DEFAULT FALSE,
    metadata        JSONB           NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE workflows (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255)    NOT NULL,
    description     TEXT,
    trigger_type    VARCHAR(100)    NOT NULL, -- FILE_UPLOAD, FILE_DELETE, STORAGE_THRESHOLD, INACTIVE_FILE, POLICY_VIOLATION
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_by      UUID            NOT NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_workflows_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE workflow_steps (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id     UUID            NOT NULL,
    step_order      INTEGER         NOT NULL,
    action_type     VARCHAR(100)    NOT NULL, -- SEND_EMAIL, SEND_NOTIFICATION, MOVE_FILE, DELETE_FILE, REQUEST_APPROVAL
    config          JSONB           NOT NULL DEFAULT '{}',
    CONSTRAINT fk_steps_workflow FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE,
    CONSTRAINT uq_workflow_step_order UNIQUE (workflow_id, step_order)
);

CREATE TABLE workflow_history (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id     UUID            NOT NULL,
    triggered_by    UUID,
    status          VARCHAR(50)     NOT NULL, -- RUNNING, COMPLETED, FAILED, WAITING_APPROVAL
    started_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMPTZ,
    error_message   TEXT,
    CONSTRAINT fk_history_workflow FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE,
    CONSTRAINT fk_history_trigger FOREIGN KEY (triggered_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE approval_requests (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_history_id UUID,
    requested_by        UUID            NOT NULL,
    approver_id         UUID, -- NULL means any admin or eligible user
    status              VARCHAR(50)     NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    resource_type       VARCHAR(100)    NOT NULL, -- FILE, FOLDER, WORKFLOW
    resource_id         VARCHAR(255)    NOT NULL,
    details             TEXT,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_approvals_history FOREIGN KEY (workflow_history_id) REFERENCES workflow_history(id) ON DELETE SET NULL,
    CONSTRAINT fk_approvals_requester FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_approvals_approver FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE SET NULL
);

COMMENT ON TABLE notifications IS 'User notification log';
COMMENT ON TABLE workflows IS 'User-configured or automated workflow templates';
COMMENT ON TABLE workflow_steps IS 'Individual step executions for workflow definitions';
COMMENT ON TABLE workflow_history IS 'Executions logs for triggered workflows';
COMMENT ON TABLE approval_requests IS 'Decisions awaiting explicit manager or admin approval';
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_workflows_trigger ON workflows(trigger_type);
CREATE INDEX idx_approval_status ON approval_requests(status);
