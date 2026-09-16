-- Extend services table for Solutions page
ALTER TABLE services ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS color TEXT;