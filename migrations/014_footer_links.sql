-- Footer link groups (Product, Company, Legal, etc.)
CREATE TABLE IF NOT EXISTS footer_links (
    id                  SERIAL PRIMARY KEY,
    group_key           TEXT NOT NULL,                  -- 'product', 'company', 'legal', 'contact'
    label               TEXT NOT NULL,
    url                 TEXT,
    display_order       INTEGER DEFAULT 0,
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_footer_links_group ON footer_links (group_key, display_order);

-- Trigger
DROP TRIGGER IF EXISTS trigger_update_footer_links_updated_at ON footer_links;
CREATE TRIGGER trigger_update_footer_links_updated_at
BEFORE UPDATE ON footer_links
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();