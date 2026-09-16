-- Pricing plans (Standard, Pro)
CREATE TABLE IF NOT EXISTS pricing_plans (
    id                  SERIAL PRIMARY KEY,
    name                TEXT NOT NULL,                  -- 'Standard', 'Pro'
    monthly_price       INTEGER NOT NULL,               -- in dollars (349, 799)
    annual_price        INTEGER NOT NULL,               -- in dollars (279, 639)
    description         TEXT,
    cta_text            TEXT NOT NULL,                  -- 'Start Free Trial', 'Book a Demo'
    cta_class           TEXT,                           -- CSS classes for CTA button
    popular             BOOLEAN DEFAULT FALSE,
    check_color         TEXT DEFAULT 'text-blue',       -- color for checkmarks
    display_order       INTEGER DEFAULT 0,
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Features for each pricing plan
CREATE TABLE IF NOT EXISTS pricing_features (
    id                  SERIAL PRIMARY KEY,
    pricing_plan_id     INTEGER NOT NULL REFERENCES pricing_plans(id) ON DELETE CASCADE,
    feature             TEXT NOT NULL,
    display_order       INTEGER DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comparison table rows
CREATE TABLE IF NOT EXISTS pricing_comparison (
    id                  SERIAL PRIMARY KEY,
    label               TEXT NOT NULL,                  -- 'Active cases', 'Caseworker accounts'
    standard_value      TEXT,                           -- 'Up to 100', '5', 'true', 'false'
    pro_value           TEXT,                           -- 'Unlimited', 'Unlimited', 'true', 'true'
    display_order       INTEGER DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Triggers
DROP TRIGGER IF EXISTS trigger_update_pricing_plans_updated_at ON pricing_plans;
CREATE TRIGGER trigger_update_pricing_plans_updated_at
BEFORE UPDATE ON pricing_plans
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_pricing_features_updated_at ON pricing_features;
CREATE TRIGGER trigger_update_pricing_features_updated_at
BEFORE UPDATE ON pricing_features
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();