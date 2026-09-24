-- Book Demo page configuration (single record)
CREATE TABLE IF NOT EXISTS book_demo_config (
    id                      SERIAL PRIMARY KEY,
    -- Hero section
    hero_title              TEXT DEFAULT 'See ImCam Hub in Action',
    hero_description        TEXT DEFAULT 'Get a personalized walkthrough of the platform. No commitment, no hard sell — just a clear look at how ImCam Hub fits your practice.',
    -- Trust section
    trust_title             TEXT DEFAULT 'What to expect',
    trust_description       TEXT DEFAULT 'Over 200 immigration practices trust ImCam Hub to manage their cases, deadlines, and client relationships. This demo is a no-pressure walkthrough tailored to your firm''s specific workflows and questions.',
    -- Steps (4 steps)
    steps                   JSONB DEFAULT '[
        {"icon": "Clock", "text": "We confirm your preferred slot within 24 hours", "color": "bg-blue/10 text-blue"},
        {"icon": "Play", "text": "30-minute live walkthrough with a product specialist", "color": "bg-indigo/10 text-indigo"},
        {"icon": "FileText", "text": "Custom quote based on your firm size and needs", "color": "bg-emerald/10 text-emerald"},
        {"icon": "Shield", "text": "No commitment — decide at your own pace", "color": "bg-purple/10 text-purple"}
    ]',
    -- Testimonial
    testimonial_quote       TEXT DEFAULT 'We went from 3 different tools and endless email chains to one system in under a month. Our caseworkers saved 10+ hours a week within the first quarter.',
    testimonial_author      TEXT DEFAULT 'Sarah Mitchell',
    testimonial_role        TEXT DEFAULT 'Managing Partner, Mitchell & Associates',
    -- Contact fallback
    contact_phone           TEXT DEFAULT '+44 20 7946 0958',
    contact_email           TEXT DEFAULT 'hello@incamhub.com',
    -- CTA
    cta_title               TEXT DEFAULT 'Ready to see ImCam Hub in action?',
    cta_description         TEXT DEFAULT 'Explore how ImCam Hub can transform your immigration practice with a personalized demo.',
    cta_button_text         TEXT DEFAULT 'Book a Free Demo',
    cta_button_link         TEXT DEFAULT '/book-demo',
    -- Background image
    background_image        TEXT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger
DROP TRIGGER IF EXISTS trigger_update_book_demo_config_updated_at ON book_demo_config;
CREATE TRIGGER trigger_update_book_demo_config_updated_at
BEFORE UPDATE ON book_demo_config
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();