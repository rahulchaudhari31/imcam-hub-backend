-- ImCam Hub -- CMS Schema Migration
-- Run: psql $DATABASE_URL -f migrations/002_cms_schema.sql

-- ============================================================
-- Table: website_settings (key-value site-wide config)
-- ============================================================
CREATE TABLE IF NOT EXISTS website_settings (
    id          SERIAL PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Table: home_content (home page sections)
-- ============================================================
CREATE TABLE IF NOT EXISTS home_content (
    id              SERIAL PRIMARY KEY,
    section_key     TEXT NOT NULL UNIQUE,
    title           TEXT,
    description     TEXT,
    image_url       TEXT,
    button_text     TEXT,
    button_link     TEXT,
    secondaryButtonText TEXT,
    secondaryButtonLink TEXT,
    content         JSONB,
    display_order   INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Table: about_content
-- ============================================================
CREATE TABLE IF NOT EXISTS about_content (
    id          SERIAL PRIMARY KEY,
    heading     TEXT,
    description TEXT,
    mission     TEXT,
    vision      TEXT,
    values      JSONB,
    image_url   TEXT,
    content     JSONB,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Table: services
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
    id              SERIAL PRIMARY KEY,
    title           TEXT NOT NULL,
    description     TEXT,
    image_url       TEXT,
    icon            TEXT,
    display_order   INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Table: faqs
-- ============================================================
CREATE TABLE IF NOT EXISTS faqs (
    id              SERIAL PRIMARY KEY,
    question        TEXT NOT NULL,
    answer          TEXT NOT NULL,
    display_order   INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Table: testimonials
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
    id              SERIAL PRIMARY KEY,
    full_name       TEXT NOT NULL,
    company         TEXT,
    role            TEXT,
    testimonial     TEXT NOT NULL,
    image_url       TEXT,
    rating          INTEGER DEFAULT 5,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Table: contact_information
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_information (
    id              SERIAL PRIMARY KEY,
    email           TEXT,
    phone           TEXT,
    address         TEXT,
    business_hours  TEXT,
    content         JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Table: social_links
-- ============================================================
CREATE TABLE IF NOT EXISTS social_links (
    id              SERIAL PRIMARY KEY,
    platform        TEXT NOT NULL,
    url             TEXT NOT NULL,
    display_order   INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Table: media
-- ============================================================
CREATE TABLE IF NOT EXISTS media (
    id              SERIAL PRIMARY KEY,
    filename        TEXT NOT NULL,
    original_name   TEXT NOT NULL,
    mime_type       TEXT,
    file_size       INTEGER,
    url             TEXT NOT NULL,
    alt_text        TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_created ON media (created_at DESC);

-- ============================================================
-- Table: seo_settings
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_settings (
    id              SERIAL PRIMARY KEY,
    page_key        TEXT NOT NULL UNIQUE,
    page_title      TEXT,
    meta_description TEXT,
    meta_keywords   TEXT,
    og_title        TEXT,
    og_description  TEXT,
    og_image        TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
