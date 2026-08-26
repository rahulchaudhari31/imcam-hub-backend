-- ImCam Hub — Documents Schema Migration
-- Run: psql $DATABASE_URL -f migrations/004_documents_schema.sql

-- ============================================================
-- ENUMS
-- ============================================================
DO $$ BEGIN
    CREATE TYPE document_type_enum AS ENUM (
        'passport',
        'identity_document',
        'education_document',
        'employment_document',
        'financial_document',
        'visa_document',
        'application_form',
        'other'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE document_status_enum AS ENUM (
        'pending',
        'approved',
        'rejected'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- Table: documents
-- ============================================================
CREATE TABLE IF NOT EXISTS documents (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id             UUID NOT NULL REFERENCES cases(id) ON DELETE RESTRICT,
    uploaded_by         INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    document_type       document_type_enum NOT NULL,
    original_file_name  TEXT NOT NULL,
    stored_file_name    TEXT NOT NULL,
    mime_type           TEXT NOT NULL,
    file_size           BIGINT NOT NULL,
    status              document_status_enum NOT NULL DEFAULT 'pending',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_documents_case_id       ON documents (case_id);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by   ON documents (uploaded_by);
CREATE INDEX IF NOT EXISTS idx_documents_status        ON documents (status);
CREATE INDEX IF NOT EXISTS idx_documents_document_type ON documents (document_type);
CREATE INDEX IF NOT EXISTS idx_documents_created       ON documents (created_at DESC);

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS trigger_update_documents_updated_at ON documents;
CREATE TRIGGER trigger_update_documents_updated_at
BEFORE UPDATE ON documents
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();