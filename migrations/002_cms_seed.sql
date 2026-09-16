-- ImCam Hub -- CMS Seed Data
-- Run: psql $DATABASE_URL -f migrations/002_cms_seed.sql
-- Seeds CMS tables with content from existing frontend

-- ============================================================
-- Website Settings
-- ============================================================
INSERT INTO website_settings (setting_key, setting_value) VALUES
('site_name', 'ImCam Hub'),
('site_tagline', 'Immigration Case Management'),
('site_description', 'One Platform. Every Case, Handled.'),('logo_url', '/assets/imcam-hub-logo.png'),
('favicon_url', '/favicon.svg')
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================================
-- Home Content: Hero
-- ============================================================
INSERT INTO home_content (section_key, title, description, button_text, button_link, secondaryButtonText, secondaryButtonLink, content, display_order) VALUES
('hero', 'The Complete Case Management Platform for UK Immigration Consultancies', 'Manage Skilled Worker visas, Sponsor Licences, ILR, and British Citizenship cases — from first enquiry to final approval, in one connected platform.', 'Book a Free Demo', '/book-demo', 'Watch Demo', '#video-showcase',
 '{"tagline": "Immigration Case Management Platform"}', 1)
ON CONFLICT (section_key) DO NOTHING;

-- ============================================================
-- Home Content: Stats
-- ============================================================
INSERT INTO home_content (section_key, title, content, display_order) VALUES
('stats', 'Platform Statistics',
 '[
   {"label": "Faster Processing", "value": "60%"},
   {"label": "Client Satisfaction", "value": "98%"},
   {"label": "Compliance Rate", "value": "100%"}
 ]', 2)
ON CONFLICT (section_key) DO NOTHING;

-- ============================================================
-- Home Content: Trusted Features
-- ============================================================
INSERT INTO home_content (section_key, title, content, display_order) VALUES
('trusted_features', 'Trusted Features',
  '[
   {"title": "Role-Based Access", "description": "Every user sees only the cases and data relevant to their role."},
   {"title": "Real-Time Visibility", "description": "Live dashboards track every case, deadline, and caseworker\'s progress instantly."},
   {"title": "Four Connected Portals", "description": "Admin, caseworker, client, and business, all sharing one live case."},
   {"title": "AI-Powered Case Intelligence", "description": "Auto-checks documents, flags compliance risks, and predicts delays early."}
 ]', 3)
ON CONFLICT (section_key) DO NOTHING;

-- ============================================================
-- Home Content: AI Agents
-- ============================================================
INSERT INTO home_content (section_key, title, description, content, display_order) VALUES
('ai_agents', 'Intelligent System', 'Our AI-powered agents handle routine tasks so your team can focus on what matters.',
  '[
   {"title": "Case & Workflow Management", "description": "Track every case through enquiry, application, compliance, and completion with pre-built workflows for each UK visa type.", "badges": ["FULL LIFECYCLE", "PRE-BUILT WORKFLOWS"], "icon": "Workflow"},
   {"title": "Document Vault", "description": "Store, organise, and retrieve every case document securely in one place, with checklists showing what\'s received and outstanding.", "badges": ["SECURE STORAGE", "CHECKLIST TRACKING"], "icon": "FileCheck"},
   {"title": "Caseworker & Task Assignment", "description": "Assign cases and tasks to caseworkers, then monitor workload and progress from a single manager dashboard.", "badges": ["TASK ASSIGNMENT", "WORKLOAD VISIBILITY"], "icon": "Users"},
   {"title": "Compliance & Licence Tracking", "description": "Manage licence requests, CoS allocation, and compliance reviews with automatic alerts before deadlines are at risk.", "badges": ["LICENCE TRACKING", "AUTO ALERTS"], "icon": "Shield"},
   {"title": "Client Self-Service Portal", "description": "Let individual clients track their application progress, upload documents, and message your team without needing to call or email.", "badges": ["CLIENT PORTAL", "SELF-SERVICE"], "icon": "UserCheck"},
   {"title": "Business/Sponsor Portal", "description": "Give sponsoring businesses live visibility into licence status, sponsored workers, compliance obligations, and upcoming renewal deadlines.", "badges": ["SPONSOR PORTAL", "LIVE COMPLIANCE"], "icon": "Building2"}
 ]', 4)
ON CONFLICT (section_key) DO NOTHING;

-- ============================================================
-- Home Content: Core Modules
-- ============================================================
INSERT INTO home_content (section_key, title, content, display_order) VALUES
('core_modules', 'Core Modules',
  '[
   {"title": "Admin Dashboard", "description": "Complete oversight of every case, caseworker, and compliance obligation across your consultancy.", "link": "/features/admin", "color": "indigo"},
   {"title": "Caseworker Portal", "description": "Every assigned case, task, and deadline in one place — from Skilled Worker to ILR and Citizenship work.", "link": "/features/caseworker", "color": "emerald"},
   {"title": "Client Portal", "description": "Self-service tracking, document upload, and direct messaging for individual applicants.", "link": "/features/candidate", "color": "blue"},
   {"title": "Business/Sponsor Portal", "description": "Live visibility into sponsor licence status, sponsored workers, and CoS allocation.", "link": "/features/client", "color": "purple"}
 ]', 5)
ON CONFLICT (section_key) DO NOTHING;

-- ============================================================
-- Home Content: Why ImCam Hub
-- ============================================================
INSERT INTO home_content (section_key, title, description, content, display_order) VALUES
('why_incimhub', 'Why ImCam Hub', 'Everything your immigration practice needs in one platform.',
 '[
   {"title": "Unified Client Communication", "description": "All client messages, documents, and updates in one thread."},
   {"title": "Access on the Go", "description": "Manage cases from anywhere with our mobile-responsive platform."},
   {"title": "Enhanced Scheduling", "description": "Never miss a deadline with intelligent date tracking and alerts."}
 ]', 6)
ON CONFLICT (section_key) DO NOTHING;

-- ============================================================
-- Home Content: FAQ
-- ============================================================
INSERT INTO home_content (section_key, title, content, display_order) VALUES
('faq', 'Frequently Asked Questions',
 '[
   {"question": "What types of immigration cases does ImCam Hub support?", "answer": "ImCam Hub supports all major immigration case types including work permits, permanent residency applications, LMIA, Express Entry, Provincial Nominee Programs, study permits, and visitor visas."},
   {"question": "How does document verification work?", "answer": "Our AI-powered OCR scans uploaded documents, extracts key data, verifies authenticity markers, and flags any inconsistencies for caseworker review."},
   {"question": "Can candidates track their own case progress?", "answer": "Yes! The Candidate Portal provides real-time case status tracking, document upload capabilities, deadline notifications, and direct messaging with caseworkers."},
   {"question": "Is ImCam Hub compliant with privacy regulations?", "answer": "Absolutely. ImCam Hub is built with PIPEDA, GDPR, and IRCC data handling requirements in mind. All data is encrypted at rest and in transit."},
   {"question": "What integrations does ImCam Hub offer?", "answer": "We integrate with common tools including email platforms, calendar apps, document management systems, and government portals where APIs are available."},
   {"question": "How long does implementation take?", "answer": "Most firms are fully onboarded within 2-4 weeks, depending on firm size and data migration requirements. Our onboarding team provides dedicated support throughout."}
 ]', 7)
ON CONFLICT (section_key) DO NOTHING;

-- ============================================================
-- Home Content: CTA
-- ============================================================
INSERT INTO home_content (section_key, title, description, button_text, button_link, display_order) VALUES
('cta', 'Ready to see ImCam Hub in action?', 'Join hundreds of immigration firms already using ImCam Hub to streamline their practice.', 'Book a Free Demo', '/book-demo', 8)
ON CONFLICT (section_key) DO NOTHING;

-- ============================================================
-- About Content
-- ============================================================
INSERT INTO about_content (heading, description, mission, vision, content) VALUES
('About ImCam Hub', 'We are building the future of immigration case management. Our platform combines intelligent automation with human expertise to help immigration practices deliver faster, more accurate outcomes for their clients.',
 'To empower immigration professionals with technology that simplifies complexity, ensures compliance, and improves outcomes for every stakeholder.',
 'A world where immigration processes are transparent, efficient, and accessible to everyone involved.',
 '{"values": [
   {"title": "Innovation", "description": "We leverage cutting-edge AI and automation to solve real immigration challenges."},
   {"title": "Compliance", "description": "Every feature is designed with regulatory compliance at its core."},
   {"title": "Transparency", "description": "We believe all stakeholders deserve real-time visibility into case progress."},
   {"title": "Security", "description": "Bank-grade encryption and data protection are non-negotiable."}
 ]}')
ON CONFLICT DO NOTHING;

-- ============================================================
-- FAQs
-- ============================================================
INSERT INTO faqs (question, answer, display_order) VALUES
('What types of immigration cases does ImCam Hub support?', 'ImCam Hub supports all major immigration case types including work permits, permanent residency applications, LMIA, Express Entry, Provincial Nominee Programs, study permits, and visitor visas.', 1),
('How does document verification work?', 'Our AI-powered OCR scans uploaded documents, extracts key data, verifies authenticity markers, and flags any inconsistencies for caseworker review.', 2),
('Can candidates track their own case progress?', 'Yes! The Candidate Portal provides real-time case status tracking, document upload capabilities, deadline notifications, and direct messaging with caseworkers.', 3),
('Is ImCam Hub compliant with privacy regulations?', 'Absolutely. ImCam Hub is built with PIPEDA, GDPR, and IRCC data handling requirements in mind. All data is encrypted at rest and in transit.', 4),
('What integrations does ImCam Hub offer?', 'We integrate with common tools including email platforms, calendar apps, document management systems, and government portals where APIs are available.', 5),
('How long does implementation take?', 'Most firms are fully onboarded within 2-4 weeks, depending on firm size and data migration requirements. Our onboarding team provides dedicated support throughout.', 6)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Testimonials
-- ============================================================
INSERT INTO testimonials (full_name, company, role, testimonial, rating) VALUES
('Sarah Mitchell', 'Maple Leaf Immigration Law', 'Managing Partner', 'ImCam Hub has transformed how our firm handles cases. We have reduced processing time by 40% and our clients love the transparency of the candidate portal.', 5),
('David Chen', 'NorthStar Immigration Group', 'Senior Caseworker', 'The document verification AI alone saves us hours every week. Combined with the deadline tracking, it is an indispensable tool for our practice.', 5),
('Priya Sharma', 'CanFlow Consulting', 'Operations Director', 'Switching to ImCam Hub was the best decision we made. Our team is more productive and our clients are happier than ever.', 5)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Contact Information
-- ============================================================
INSERT INTO contact_information (email, phone, address, business_hours, content) VALUES
('hello@incamhub.com', '1-800-555-1234', '123 Bay Street Suite 400 Toronto ON M5J 2R2 Canada', 'Monday - Friday: 9:00 AM - 6:00 PM EST',
 '{"support_email": "support@incamhub.com", "sales_email": "sales@incamhub.com"}')
ON CONFLICT DO NOTHING;

-- ============================================================
-- Social Links
-- ============================================================
INSERT INTO social_links (platform, url, display_order) VALUES
('twitter', 'https://twitter.com/incamhub', 1),
('linkedin', 'https://linkedin.com/company/incamhub', 2),
('github', 'https://github.com/incamhub', 3)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEO Settings
-- ============================================================
INSERT INTO seo_settings (page_key, page_title, meta_description, meta_keywords, og_title, og_description) VALUES
('home', 'ImCam Hub - Immigration Case Management Platform', 'The all-in-one immigration case management platform. Manage cases, documents, deadlines, and client communication from a single dashboard.', 'immigration, case management, LMIA, Express Entry, work permit, PR application', 'ImCam Hub - Immigration Case Management', 'One Platform. Every Case, Handled.'),
('about', 'About Us - ImCam Hub', 'Learn about ImCam Hub, the future of immigration case management technology.', 'about incam hub, immigration technology, case management platform', 'About ImCam Hub', 'Building the future of immigration case management.'),
('features', 'Features - ImCam Hub', 'Explore the features of ImCam Hub immigration case management platform.', 'immigration features, case management features, AI immigration', 'ImCam Hub Features', 'Powerful features for modern immigration practices.'),
('pricing', 'Pricing - ImCam Hub', 'Simple, transparent pricing for immigration case management.', 'immigration software pricing, case management cost', 'ImCam Hub Pricing', 'Simple, transparent pricing.'),
('contact', 'Contact Us - ImCam Hub', 'Get in touch with the ImCam Hub team.', 'contact incamhub, immigration software support', 'Contact ImCam Hub', 'Get in touch with our team.'),
('demo', 'Book a Demo - ImCam Hub', 'See ImCam Hub in action. Book a free demo today.', 'book demo, immigration software demo', 'Book a Demo - ImCam Hub', 'See ImCam Hub in action.')
ON CONFLICT (page_key) DO NOTHING;
