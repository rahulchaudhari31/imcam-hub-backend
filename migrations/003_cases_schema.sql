-- ImCam Hub — Cases Schema Migration
-- Run: psql $DATABASE_URL -f migrations/003_cases_schema.sql

-- ============================================================
-- ENUMS
-- ============================================================
DO $$ BEGIN
    CREATE TYPE case_type_enum AS ENUM (
        'skilled_worker',
        'sponsor_licence',
        'ilr',
        'british_citizenship',
        'family_visa',
        'student_visa',
        'visitor_visa',
        'other'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE case_status_enum AS ENUM (
        'pending',
        'active',
        'on_hold',
        'completed',
        'closed'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE case_priority_enum AS ENUM (
        'low',
        'medium',
        'high',
        'urgent'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- Table: cases
-- ============================================================
CREATE TABLE IF NOT EXISTS cases (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_number     TEXT NOT NULL UNIQUE,
    client_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    caseworker_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
    case_type       case_type_enum NOT NULL,
    status          case_status_enum NOT NULL DEFAULT 'pending',
    priority        case_priority_enum NOT NULL DEFAULT 'medium',
    title           TEXT NOT NULL,
    description     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cases_client_id     ON cases (client_id);
CREATE INDEX IF NOT EXISTS idx_cases_caseworker_id ON cases (caseworker_id);
CREATE INDEX IF NOT EXISTS idx_cases_status        ON cases (status);
CREATE INDEX IF NOT EXISTS idx_cases_case_type     ON cases (case_type);
CREATE INDEX IF NOT EXISTS idx_cases_priority      ON cases (priority);
CREATE INDEX IF NOT EXISTS idx_cases_created       ON cases (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cases_case_number   ON cases (case_number);

-- Function to generate case number: IMCAM-YYYY-NNNNNN
CREATE OR REPLACE FUNCTION generate_case_number()
RETURNS TEXT AS $$
DECLARE
    year_part TEXT;
    seq_num   INTEGER;
    result    TEXT;
BEGIN
    year_part := to_char(NOW(), 'YYYY');

    -- Atomically get next sequence for this year
    INSERT INTO case_number_sequence (year, last_number)
    VALUES (year_part, 1)
    ON CONFLICT (year) DO UPDATE SET last_number = case_number_sequence.last_number + 1
    RETURNING last_number INTO seq_num;

    result := 'IMCAM-' || year_part || '-' || lpad(seq_num::TEXT, 6, '0');
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Sequence tracking table for case numbers (one row per year)
CREATE TABLE IF NOT EXISTS case_number_sequence (
    year       TEXT PRIMARY KEY,
    last_number INTEGER NOT NULL DEFAULT 0
);

-- Trigger to set case_number on insert if not provided
CREATE OR REPLACE FUNCTION set_case_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.case_number IS NULL OR NEW.case_number = '' THEN
        NEW.case_number := generate_case_number();
    END IF;
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_case_number ON cases;
CREATE TRIGGER trigger_set_case_number
BEFORE INSERT ON cases
FOR EACH ROW EXECUTE FUNCTION set_case_number();

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_cases_updated_at ON cases;
CREATE TRIGGER trigger_update_cases_updated_at
BEFORE UPDATE ON cases
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();