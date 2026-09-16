-- Extend faqs table with page_key for page-specific FAQs
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS page_key TEXT DEFAULT 'global';

CREATE INDEX IF NOT EXISTS idx_faqs_page_key ON faqs (page_key);