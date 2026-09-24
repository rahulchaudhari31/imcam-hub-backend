-- ImCam Hub -- Demo Request Preferred Date / Time
-- Adds optional preferred demo slot to existing demo_requests tables.
-- Run: psql $DATABASE_URL -f migrations/016_demo_requests_preferred_slot.sql

ALTER TABLE demo_requests
  ADD COLUMN IF NOT EXISTS preferred_date DATE,
  ADD COLUMN IF NOT EXISTS preferred_time TIME;

CREATE INDEX IF NOT EXISTS idx_demo_requests_preferred_date ON demo_requests (preferred_date);