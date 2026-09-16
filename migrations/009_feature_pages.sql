-- Feature page configurations (4 pages: admin, caseworker, candidate, client)
CREATE TABLE IF NOT EXISTS feature_pages (
    id                  SERIAL PRIMARY KEY,
    page_key            TEXT NOT NULL UNIQUE,          -- 'admin', 'caseworker', 'candidate', 'client'
    role_name           TEXT NOT NULL,                  -- 'Admin / Practice Manager', 'Caseworker', etc.
    banner_text         TEXT NOT NULL,                  -- 'Built for Managers'
    banner_subline      TEXT,                           -- 'From caseloads to compliance...'
    banner_color        TEXT DEFAULT 'bg-navy',
    banner_image        TEXT,
    banner_overlay      BOOLEAN DEFAULT TRUE,
    intro_heading       TEXT,
    intro_text          JSONB,                          -- array of paragraphs
    intro_reverse       BOOLEAN DEFAULT FALSE,
    intro_image         TEXT,
    intro_image_label   TEXT,
    middle_badge        TEXT,
    middle_heading      TEXT,
    middle_paragraphs   JSONB,                          -- array of paragraphs
    middle_points       JSONB,                          -- array of bullet points
    middle_image        TEXT,
    bottom_cta_heading  TEXT,
    bottom_cta_text     TEXT,
    bottom_cta_button_text TEXT,
    bottom_cta_button_link TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Feature cards for each feature page
CREATE TABLE IF NOT EXISTS feature_page_features (
    id                  SERIAL PRIMARY KEY,
    feature_page_id     INTEGER NOT NULL REFERENCES feature_pages(id) ON DELETE CASCADE,
    icon                TEXT NOT NULL,                  -- lucide icon name
    title               TEXT NOT NULL,
    description         TEXT,
    display_order       INTEGER DEFAULT 0,
    color_class         TEXT,                           -- e.g., 'bg-blue/10 text-blue'
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feature_page_features_page ON feature_page_features (feature_page_id);
CREATE INDEX IF NOT EXISTS idx_feature_page_features_order ON feature_page_features (display_order);

-- Trigger for feature_page_features
DROP TRIGGER IF EXISTS trigger_update_feature_page_features_updated_at ON feature_page_features;
CREATE TRIGGER trigger_update_feature_page_features_updated_at
BEFORE UPDATE ON feature_page_features
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for feature_pages
DROP TRIGGER IF EXISTS trigger_update_feature_pages_updated_at ON feature_pages;
CREATE TRIGGER trigger_update_feature_pages_updated_at
BEFORE UPDATE ON feature_pages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();