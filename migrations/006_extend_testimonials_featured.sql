-- Extend testimonials table with is_featured flag
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials (is_featured);