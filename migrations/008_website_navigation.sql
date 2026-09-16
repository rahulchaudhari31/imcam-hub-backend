-- Navigation menu items (supports nested dropdowns)
CREATE TABLE IF NOT EXISTS website_navigation (
    id              SERIAL PRIMARY KEY,
    label           TEXT NOT NULL,
    url             TEXT,
    parent_id       INTEGER REFERENCES website_navigation(id) ON DELETE CASCADE,
    display_order   INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    target_blank    BOOLEAN DEFAULT FALSE,
    icon            TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_navigation_parent ON website_navigation (parent_id);
CREATE INDEX IF NOT EXISTS idx_navigation_order ON website_navigation (display_order);

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS trigger_update_navigation_updated_at ON website_navigation;
CREATE TRIGGER trigger_update_navigation_updated_at
BEFORE UPDATE ON website_navigation
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();