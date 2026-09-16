-- Resource categories (Guides, Case Studies, Product Updates, Compliance)
CREATE TABLE IF NOT EXISTS resource_categories (
    id                  SERIAL PRIMARY KEY,
    key                 TEXT NOT NULL UNIQUE,           -- 'guides', 'case-studies', 'product', 'compliance'
    label               TEXT NOT NULL,                  -- 'Guides', 'Case Studies'
    bg_class            TEXT,                           -- 'bg-emerald/10'
    text_class          TEXT,                           -- 'text-emerald'
    display_order       INTEGER DEFAULT 0,
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Resource articles
CREATE TABLE IF NOT EXISTS resources (
    id                  SERIAL PRIMARY KEY,
    category_id         INTEGER REFERENCES resource_categories(id) ON DELETE SET NULL,
    title               TEXT NOT NULL,
    excerpt             TEXT,
    content             TEXT,                           -- full article content (HTML/Markdown)
    image_url           TEXT,
    read_time           TEXT,                           -- '7 min read'
    published_at        TIMESTAMPTZ,
    is_active           BOOLEAN DEFAULT TRUE,
    display_order       INTEGER DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resources_category ON resources (category_id);
CREATE INDEX IF NOT EXISTS idx_resources_published ON resources (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_active ON resources (is_active);

-- Triggers
DROP TRIGGER IF EXISTS trigger_update_resource_categories_updated_at ON resource_categories;
CREATE TRIGGER trigger_update_resource_categories_updated_at
BEFORE UPDATE ON resource_categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_resources_updated_at ON resources;
CREATE TRIGGER trigger_update_resources_updated_at
BEFORE UPDATE ON resources
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();