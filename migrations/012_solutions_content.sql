-- Solutions page content sections
CREATE TABLE IF NOT EXISTS solutions_content (
    id                  SERIAL PRIMARY KEY,
    section_key         TEXT NOT NULL UNIQUE,           -- 'hero', 'stats', 'challenges', 'solutions', 'how_it_works', 'cta'
    title               TEXT,
    description         TEXT,
    content             JSONB,                          -- flexible JSON for complex sections
    display_order       INTEGER DEFAULT 0,
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger
DROP TRIGGER IF EXISTS trigger_update_solutions_content_updated_at ON solutions_content;
CREATE TRIGGER trigger_update_solutions_content_updated_at
BEFORE UPDATE ON solutions_content
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();