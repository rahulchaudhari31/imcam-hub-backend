-- ImCam Hub — Initial Schema
-- Run against a fresh PostgreSQL database:
--   psql $DATABASE_URL -f migrations/001_initial_schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
DO $$ BEGIN
    CREATE TYPE firm_size_enum AS ENUM ('1-10', '11-50', '51-200', '201-1000', '1000+');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE demo_status_enum AS ENUM ('new', 'contacted', 'scheduled', 'closed');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('admin', 'caseworker', 'candidate', 'client');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- Table: demo_requests
-- ============================================================
CREATE TABLE IF NOT EXISTS demo_requests (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company     TEXT NOT NULL,
    full_name   TEXT NOT NULL,
    email       TEXT NOT NULL,
    phone       TEXT,
    firm_size   firm_size_enum NOT NULL,
    message     TEXT,
    status      demo_status_enum NOT NULL DEFAULT 'new',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_demo_requests_email    ON demo_requests (email);
CREATE INDEX IF NOT EXISTS idx_demo_requests_status   ON demo_requests (status);
CREATE INDEX IF NOT EXISTS idx_demo_requests_created  ON demo_requests (created_at DESC);

-- ============================================================
-- Table: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           TEXT NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL,
    full_name       TEXT NOT NULL,
    role            user_role_enum NOT NULL DEFAULT 'client',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
