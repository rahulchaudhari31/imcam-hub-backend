-- ============================================================
-- 015: Seed website content to match the frontend (source of truth)
-- Idempotent: only inserts rows that do not already exist.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Services (8 Solutions tiles)
-- ------------------------------------------------------------
INSERT INTO services (title, description, icon, display_order, is_active)
SELECT v.title, v.description, v.icon, v.ord, TRUE
FROM (VALUES
  ('Document Vault', 'Securely store, organise, and retrieve every case document in one centralised repository — a core part of ImCam Hub''s UK immigration case management software.', 'Database', 1),
  ('Case Pipeline View', 'A visual pipeline showing every case''s stage across your caseload, giving immigration practice management software the visibility to spot bottlenecks instantly.', 'LayoutDashboard', 2),
  ('Client Portal', 'Give individual clients an immigration client portal software experience to track application progress, upload documents, and message their caseworker — reducing back-and-forth.', 'MessageSquare', 3),
  ('Business/Sponsor Portal', 'Sponsor licence management software built for businesses, giving live visibility into licence status, sponsored workers, and CoS allocation without manual chasing.', 'Building2', 4),
  ('Reporting & Analytics', 'Real-time dashboards on caseload, revenue, and team performance, turning your visa case tracking system into a source of actionable insight.', 'PieChart', 5),
  ('Caseworker & Task Assignment', 'Assign cases and tasks to caseworkers and monitor workload from one dashboard — immigration software built for how consultancy teams actually work.', 'Users', 6),
  ('Role-Based Access & Security', 'Every user sees only what''s relevant to them, backed by the audit-ready, compliance-first security expected from immigration case management software.', 'ShieldAlert', 7),
  ('AI-Powered Case Intelligence', 'AI auto-checks documents for missing or expired items, flags sponsor licence compliance risks, and predicts case delays before problems arise.', 'Bot', 8)
) AS v(title, description, icon, ord)
WHERE NOT EXISTS (SELECT 1 FROM services s WHERE s.title = v.title);

-- ------------------------------------------------------------
-- 2. FAQs
-- ------------------------------------------------------------
-- 2a. Bring existing FAQ rows under the global page key
UPDATE faqs SET page_key = 'global' WHERE page_key IS NULL OR page_key = '';

-- Global (Home) FAQs — update the six seeded rows in place
UPDATE faqs SET page_key = 'global',
  question = 'What types of immigration cases does ImCam Hub support?',
  answer = 'ImCam Hub is built specifically for UK immigration work — Skilled Worker visas, Sponsor Licence applications and renewals, ILR, and British Citizenship. Each case type comes with pre-built workflows, document checklists, and compliance rules aligned to UKVI requirements.',
  is_active = TRUE
WHERE page_key = 'global' AND display_order = 1;

UPDATE faqs SET page_key = 'global',
  question = 'How does the document verification work?',
  answer = 'Our AI reviews uploaded documents in real time — checking for missing pages, expired dates, and incomplete fields — and flags issues before a caseworker even opens the file. This reduces rejection rates and keeps UK visa applications moving.',
  is_active = TRUE
WHERE page_key = 'global' AND display_order = 2;

UPDATE faqs SET page_key = 'global',
  question = 'Can clients and sponsoring businesses track their own case progress?',
  answer = 'Yes. Individual clients track their application through the Client Portal, while sponsoring businesses see licence status, sponsored workers, and CoS allocation in the Business Portal — both updated in real time, with direct messaging to their caseworker.',
  is_active = TRUE
WHERE page_key = 'global' AND display_order = 3;

UPDATE faqs SET page_key = 'global',
  question = 'Is ImCam Hub compliant with data privacy regulations?',
  answer = 'ImCam Hub is built with compliance at its core. We are fully GDPR compliant, with all data encrypted at rest and in transit, full audit logging, and role-based access controls — supporting the record-keeping standards expected for sponsor licence compliance and UKVI audits.',
  is_active = TRUE
WHERE page_key = 'global' AND display_order = 4;

UPDATE faqs SET page_key = 'global',
  question = 'What integrations does ImCam Hub offer?',
  answer = 'ImCam Hub connects with popular accounting tools (Xero, QuickBooks), email and calendar platforms, and communication tools like Microsoft Teams and Slack. Our API also allows custom integrations with your existing systems.',
  is_active = TRUE
WHERE page_key = 'global' AND display_order = 5;

UPDATE faqs SET page_key = 'global',
  question = 'How long does implementation typically take?',
  answer = 'Most consultancies are fully onboarded within 2-4 weeks. This includes data migration from your existing systems, workflow configuration, team training, and a parallel-run period. Dedicated onboarding managers ensure a smooth transition with minimal disruption.',
  is_active = TRUE
WHERE page_key = 'global' AND display_order = 6;

-- Insert any missing global FAQs as fallback
INSERT INTO faqs (question, answer, page_key, display_order, is_active)
SELECT v.question, v.answer, 'global', v.ord, TRUE
FROM (VALUES
  ('What types of immigration cases does ImCam Hub support?', 'ImCam Hub is built specifically for UK immigration work — Skilled Worker visas, Sponsor Licence applications and renewals, ILR, and British Citizenship. Each case type comes with pre-built workflows, document checklists, and compliance rules aligned to UKVI requirements.', 1),
  ('How does the document verification work?', 'Our AI reviews uploaded documents in real time — checking for missing pages, expired dates, and incomplete fields — and flags issues before a caseworker even opens the file. This reduces rejection rates and keeps UK visa applications moving.', 2),
  ('Can clients and sponsoring businesses track their own case progress?', 'Yes. Individual clients track their application through the Client Portal, while sponsoring businesses see licence status, sponsored workers, and CoS allocation in the Business Portal — both updated in real time, with direct messaging to their caseworker.', 3),
  ('Is ImCam Hub compliant with data privacy regulations?', 'ImCam Hub is built with compliance at its core. We are fully GDPR compliant, with all data encrypted at rest and in transit, full audit logging, and role-based access controls — supporting the record-keeping standards expected for sponsor licence compliance and UKVI audits.', 4),
  ('What integrations does ImCam Hub offer?', 'ImCam Hub connects with popular accounting tools (Xero, QuickBooks), email and calendar platforms, and communication tools like Microsoft Teams and Slack. Our API also allows custom integrations with your existing systems.', 5),
  ('How long does implementation typically take?', 'Most consultancies are fully onboarded within 2-4 weeks. This includes data migration from your existing systems, workflow configuration, team training, and a parallel-run period. Dedicated onboarding managers ensure a smooth transition with minimal disruption.', 6)
) AS v(question, answer, ord)
WHERE NOT EXISTS (SELECT 1 FROM faqs f WHERE f.page_key = 'global' AND f.question = v.question);

-- Pricing FAQs
INSERT INTO faqs (question, answer, page_key, display_order, is_active)
SELECT v.question, v.answer, 'pricing', v.ord, TRUE
FROM (VALUES
  ('Is there a free trial available?', 'Yes. Both Standard and Pro plans come with a 14-day free trial — no credit card required. You get full access to every feature in your chosen plan so you can evaluate it with real cases before committing.', 1),
  ('What happens when I reach my case limit on Standard?', 'You''ll receive a notification when you''re within 10 cases of your limit. You can upgrade to Pro at any time, and the transition is seamless — all your existing cases, documents, and data carry over instantly.', 2),
  ('Can I switch between monthly and annual billing?', 'Absolutely. You can switch at any time from your account settings. When switching from monthly to annual, you''ll receive a prorated credit for the remainder of your current billing cycle.', 3),
  ('What payment methods do you accept?', 'We accept all major credit cards (Visa, Mastercard, Amex), ACH bank transfers, and wire transfers for annual plans. All payments are processed securely through Stripe.', 4),
  ('Do you offer discounts for non-profits or legal aid organizations?', 'Yes. We offer a 25% discount for registered non-profit organizations and legal aid societies. Contact our sales team with proof of your organization''s status to get started.', 5),
  ('Can I cancel at any time?', 'Yes. There are no long-term contracts or cancellation fees. You can cancel from your account settings at any time. Your access continues through the end of your current billing period, and your data is exportable for 30 days after cancellation.', 6)
) AS v(question, answer, ord)
WHERE NOT EXISTS (SELECT 1 FROM faqs f WHERE f.page_key = 'pricing' AND f.question = v.question);

-- Admin feature page FAQs
INSERT INTO faqs (question, answer, page_key, display_order, is_active)
SELECT v.question, v.answer, 'admin', v.ord, TRUE
FROM (VALUES
  ('Can I control what each staff member can access?', 'Yes. ImCam Hub provides granular role-based access control (RBAC). You can define custom roles, restrict access by case type, office location, or client — and even limit document-level permissions for sensitive cases.', 1),
  ('What kind of compliance reports are available?', 'The platform generates audit-ready reports aligned to UKVI and Home Office sponsor licence duties — including case timelines, CoS allocation, pending compliance reviews, and full audit trails — exportable as PDF or CSV.', 2),
  ('Does multi-office support include separate billing?', 'Yes. Each office can have its own billing rules and rate cards while still feeding into a consolidated consultancy-wide financial dashboard.', 3)
) AS v(question, answer, ord)
WHERE NOT EXISTS (SELECT 1 FROM faqs f WHERE f.page_key = 'admin' AND f.question = v.question);

-- Caseworker feature page FAQs
INSERT INTO faqs (question, answer, page_key, display_order, is_active)
SELECT v.question, v.answer, 'caseworker', v.ord, TRUE
FROM (VALUES
  ('How does the document checklist automation work?', 'When a caseworker starts a new case, the system automatically generates a checklist based on the case type (e.g., Skilled Worker, Sponsor Licence, ILR, British Citizenship) and the current stage. Checklists update dynamically as the case progresses.', 1),
  ('Can I customize my workflow templates?', 'Absolutely. You can create, edit, and version workflows to match how your consultancy works, pulling in case-specific data automatically. Every step is clear before a case moves forward.', 2),
  ('Does workload balancing work across offices?', 'Yes. If your consultancy has multiple offices, the workload view can be scoped to a single location or show a firm-wide view. Cases can be reassigned across offices with appropriate permission controls.', 3)
) AS v(question, answer, ord)
WHERE NOT EXISTS (SELECT 1 FROM faqs f WHERE f.page_key = 'caseworker' AND f.question = v.question);

-- Candidate feature page FAQs
INSERT INTO faqs (question, answer, page_key, display_order, is_active)
SELECT v.question, v.answer, 'candidate', v.ord, TRUE
FROM (VALUES
  ('Is the client portal mobile-friendly?', 'Yes. The Client Portal is fully responsive and works on any device — phone, tablet, or desktop. You can upload documents, check your case status, and message your caseworker from anywhere.', 1),
  ('Can other applicants see my information?', 'No. Each client only sees their own case data. The portal is fully isolated — there is no way for one applicant to access another''s information, documents, or communications.', 2),
  ('How do the AI document checks work?', 'When you upload a document, AI reviews it for missing pages or expired dates and flags any issues immediately — so you can fix them before they delay your case.', 3)
) AS v(question, answer, ord)
WHERE NOT EXISTS (SELECT 1 FROM faqs f WHERE f.page_key = 'candidate' AND f.question = v.question);

-- Client (sponsor business) feature page FAQs
INSERT INTO faqs (question, answer, page_key, display_order, is_active)
SELECT v.question, v.answer, 'client', v.ord, TRUE
FROM (VALUES
  ('Can we see the status of every sponsored worker in one place?', 'Yes. The Business Portal tracks your sponsor licence, Certificate of Sponsorship allocation, and every sponsored worker''s visa type, case reference, and status in one unified view — with compliance alerts specific to UKVI reporting duties.', 1),
  ('How do document uploads work for our business?', 'From the Business Portal, you can upload documents directly against worker records. Each file is validated (format, size, expiry), automatically routed to the correct case, and the assigned caseworker is notified. You''ll see a real-time status for each uploaded document.', 2),
  ('Can different departments see different sets of workers?', 'Yes. Role-based access can be configured to scope visibility by department, office location, or cost centre. A department lead, for example, would only see workers sponsored by their department.', 3)
) AS v(question, answer, ord)
WHERE NOT EXISTS (SELECT 1 FROM faqs f WHERE f.page_key = 'client' AND f.question = v.question);

-- ------------------------------------------------------------
-- 3. Feature pages + feature cards
-- ------------------------------------------------------------
INSERT INTO feature_pages
  (page_key, role_name, banner_text, banner_subline, banner_color, banner_overlay,
   intro_heading, intro_text, intro_reverse, intro_image_label,
   bottom_cta_heading, bottom_cta_text, bottom_cta_button_text, bottom_cta_button_link)
SELECT 'admin', 'Admin / Practice Manager', 'Built for Managers',
  'From caseloads to compliance, the Admin Portal keeps your entire consultancy visible, organised, and ahead of deadlines.',
  'bg-navy', TRUE,
  'Everything a Manager Needs, at a Glance',
  $j$[
    "The Admin Portal is the command centre of ImCam Hub's immigration practice management software, giving managers a single, consolidated view of every case, caseworker, and compliance obligation across Skilled Worker visa, Sponsor Licence, ILR, and British Citizenship work.",
    "Track total cases and revenue, monitor pending licence and CoS requests, and stay ahead of sponsor licence compliance software requirements — all from one dashboard. Purpose-built for UK immigration consultancies, it replaces scattered spreadsheets and status-check emails with real-time oversight managers can act on."
  ]$j$::jsonb,
  FALSE, 'Admin Dashboard Preview',
  'See this in action', 'Book a personalized walkthrough of the Admin Dashboard and discover how it fits your workflow.', 'Book a Free Demo', '/book-demo'
WHERE NOT EXISTS (SELECT 1 FROM feature_pages p WHERE p.page_key = 'admin');

INSERT INTO feature_pages
  (page_key, role_name, banner_text, banner_subline, banner_color, banner_overlay,
   intro_heading, intro_text, intro_reverse, intro_image_label,
   bottom_cta_heading, bottom_cta_text, bottom_cta_button_text, bottom_cta_button_link)
SELECT 'caseworker', 'Caseworker', 'Built for Caseworkers',
  'Everything you need for a case — one platform.',
  'bg-navy', TRUE,
  'Manage Every Assigned Case, Task, and Deadline in One Place',
  $j$[
    "The Caseworker Portal is where day-to-day case management software for UK immigration teams actually happens — giving caseworkers a clear, focused view of every case assigned to them, from Skilled Worker visa applications to Sponsor Licence, ILR, and British Citizenship work.",
    "Track assigned tasks and deadlines, manage documents and client communication, and move each case through its workflow without losing time to scattered emails or spreadsheets. Purpose-built for UK immigration consultancies, it gives caseworkers exactly what they need to focus on cases, not admin."
  ]$j$::jsonb,
  TRUE, 'Caseworker Portal Preview',
  'See this in action', 'Book a personalized walkthrough of the Caseworker Portal and discover how it fits your workflow.', 'Book a Free Demo', '/book-demo'
WHERE NOT EXISTS (SELECT 1 FROM feature_pages p WHERE p.page_key = 'caseworker');

INSERT INTO feature_pages
  (page_key, role_name, banner_text, banner_subline, banner_color, banner_overlay,
   intro_heading, intro_text, intro_reverse, intro_image_label,
   bottom_cta_heading, bottom_cta_text, bottom_cta_button_text, bottom_cta_button_link)
SELECT 'candidate', 'Individual Applicant', 'Built for Applicants',
  'Everything you need to follow your case.',
  'bg-navy', TRUE,
  'One Portal to Track Your Entire Visa Application',
  $j$[
    "The Client Portal gives individual applicants a clear, live view of their UK visa case — whether it's a Skilled Worker visa, ILR, or British Citizenship application — without needing to call or email for updates.",
    "See exactly which stage your case is at, what's needed from you, and what your caseworker is handling next. Built as part of ImCam Hub's UK immigration case management software, it replaces uncertainty and status-check emails with straightforward, real-time visibility."
  ]$j$::jsonb,
  FALSE, 'Client Portal Preview',
  'See this in action', 'Book a personalized walkthrough of the Client Portal and discover how it fits your workflow.', 'Book a Free Demo', '/book-demo'
WHERE NOT EXISTS (SELECT 1 FROM feature_pages p WHERE p.page_key = 'candidate');

INSERT INTO feature_pages
  (page_key, role_name, banner_text, banner_subline, banner_color, banner_overlay,
   intro_heading, intro_text, intro_reverse, intro_image_label,
   bottom_cta_heading, bottom_cta_text, bottom_cta_button_text, bottom_cta_button_link)
SELECT 'client', 'Sponsoring Business', 'Built for Sponsoring Businesses',
  'UK Sponsor Licence software for growing businesses.',
  'bg-navy', TRUE,
  'UK Sponsor Licence Management Software, Built for Businesses',
  $j$[
    "The Business Portal gives sponsoring businesses a live, consolidated view of their sponsor licence, sponsored workers, and compliance obligations, without relying on spreadsheets or chasing updates from an immigration consultancy.",
    "See your licence status, available CoS allocation, and upcoming renewal deadlines at a glance, alongside every sponsored worker's case progress. Built as part of ImCam Hub's UK immigration case management software, it keeps sponsor licence compliance straightforward, transparent, and audit-ready at every stage."
  ]$j$::jsonb,
  TRUE, 'Business Portal Preview',
  'See this in action', 'Book a personalized walkthrough of the Sponsor Business portal and discover how it fits your workflow.', 'Book a Free Demo', '/book-demo'
WHERE NOT EXISTS (SELECT 1 FROM feature_pages p WHERE p.page_key = 'client');

-- Feature cards per page
INSERT INTO feature_page_features (feature_page_id, icon, title, description, display_order)
SELECT p.id, v.icon, v.title, v.description, v.ord
FROM feature_pages p
JOIN (VALUES
  ('admin', 1, 'LayoutDashboard', 'Consolidated Case Dashboard', 'Live metrics on total cases, in-progress work, delayed cases, and completions, giving managers instant visibility across the whole consultancy.'),
  ('admin', 2, 'Users', 'Caseworker & Team Management', 'Add and manage caseworkers and admin users, assign cases, and monitor individual workload without needing constant status updates.'),
  ('admin', 3, 'FileCheck', 'Licence & CoS Request Tracking', 'Track pending licence reviews and CoS requests in real time, keeping Sponsor Licence obligations moving without manual chasing.'),
  ('admin', 4, 'ClipboardList', 'Compliance Review Oversight', 'Monitor pending compliance reviews and CCL fee approvals in one place, keeping your consultancy audit-ready at every stage.'),
  ('admin', 5, 'CreditCard', 'Revenue & Reporting Analytics', 'Generate reports and track revenue alongside caseload data, giving managers a clear view of both operational and financial performance.'),
  ('admin', 6, 'Building2', 'Sponsor & Visa Alerts', 'Get automatic sponsor and visa alerts on upcoming deadlines, so nothing tied to compliance or renewals is ever missed.'),
  ('caseworker', 1, 'ClipboardList', 'Assigned Case Dashboard', 'A clear view of every case assigned to you, showing current status and stage across Skilled Worker, Sponsor Licence, ILR, and Citizenship work.'),
  ('caseworker', 2, 'Clock', 'AI-Powered Delay Alerts', 'AI predicts potential case delays based on progress and history, alerting you early enough to act before deadlines are at risk.'),
  ('caseworker', 3, 'FileCheck', 'Document Review & Management', 'Review and manage uploaded client documents against checklists, flagging what''s missing or outstanding without chasing clients manually.'),
  ('caseworker', 4, 'Workflow', 'Case Workflow Progression', 'Move each case through its stages — enquiry, application, compliance, completion — with clear next steps at every point.'),
  ('caseworker', 5, 'MessageSquare', 'Client Communication Hub', 'Message clients directly within the portal, keeping every conversation tied to the relevant case instead of scattered across email.'),
  ('caseworker', 6, 'ShieldCheck', 'Compliance & Licence Support', 'Access licence requests, CoS details, and compliance notes relevant to your cases, keeping your work audit-ready at every stage.'),
  ('candidate', 1, 'Activity', 'Live Application Tracking', 'See your current stage and percentage complete at a glance, from initial enquiry through to final decision.'),
  ('candidate', 2, 'ClipboardList', 'Clear Next Steps', 'Know exactly what''s needed from you and when your caseworker is handling a step, with no guesswork involved.'),
  ('candidate', 3, 'Upload', 'Document Upload & Checklist', 'Upload required documents directly and track what''s been received versus outstanding, without emailing files back and forth.'),
  ('candidate', 4, 'LayoutDashboard', 'Key Case Details at a Glance', 'View your visa type, case reference, workflow step, and next deadline, all in one simple dashboard view.'),
  ('candidate', 5, 'MessageSquare', 'Direct Messaging with Your Caseworker', 'Message your caseworker directly within the portal, keeping every conversation tied to your case instead of scattered emails.'),
  ('candidate', 6, 'Sparkles', 'AI-Assisted Document Checks', 'AI reviews your uploaded documents for missing pages or expired dates, flagging issues early so your case isn''t delayed.'),
  ('client', 1, 'LayoutDashboard', 'Licence Status at a Glance', 'See your sponsor licence status, licence number, and expiry date instantly, with no need to track renewal dates manually.'),
  ('client', 2, 'BarChart3', 'CoS Allocation Tracking', 'Monitor available and used Certificate of Sponsorship allocation, so you always know your capacity for new sponsored workers.'),
  ('client', 3, 'UserCheck', 'Sponsored Worker Records', 'View every sponsored worker''s visa type, case reference, job title, and status in one organised, easy-to-navigate table.'),
  ('client', 4, 'ShieldCheck', 'Compliance & Reporting Obligations', 'Track compliance documents, reporting obligations, and right-to-work checks, keeping your business audit-ready at every stage.'),
  ('client', 5, 'Bell', 'Automatic Compliance Alerts', 'Get automatic reminders on licence expiry, pending reviews, and overdue cases, so nothing critical is ever missed.'),
  ('client', 6, 'Sparkles', 'AI-Flagged Compliance Risks', 'AI reviews your licence and worker data for compliance risks and flags them early, before they become UKVI-facing problems.')
) AS v(page_key, ord, icon, title, description)
  ON p.page_key = v.page_key
WHERE NOT EXISTS (
  SELECT 1 FROM feature_page_features f
  WHERE f.feature_page_id = p.id AND f.title = v.title
);

-- ------------------------------------------------------------
-- 4. Pricing plans
-- ------------------------------------------------------------
INSERT INTO pricing_plans
  (name, monthly_price, annual_price, description, cta_text, cta_class, popular, check_color, display_order, is_active)
SELECT v.name, v.monthly_price, v.annual_price, v.description, v.cta_text, v.cta_class, v.popular, 'text-blue', v.ord, TRUE
FROM (VALUES
  ('Starter', 49, 39, 'Perfect for small agencies', 'Start Free Trial', 'border-2 border-navy text-navy hover:bg-navy hover:text-white', FALSE, 1),
  ('Professional', 69, 55, 'For growing businesses', 'Book a Demo', 'btn-gradient-primary', TRUE, 2),
  ('Enterprise', 249, 199, 'Full power for large organisations', 'Contact Sales', 'border-2 border-navy text-navy hover:bg-navy hover:text-white', FALSE, 3)
) AS v(name, monthly_price, annual_price, description, cta_text, cta_class, popular, ord)
WHERE NOT EXISTS (SELECT 1 FROM pricing_plans p WHERE p.name = v.name);

-- Plan features (only if the plan currently has none)
INSERT INTO pricing_features (pricing_plan_id, feature, display_order)
SELECT pl.id, v.feature, v.ord
FROM pricing_plans pl
JOIN (VALUES
  ('Starter', 'Dashboard', 1), ('Starter', 'Cases', 2), ('Starter', 'Candidates', 3), ('Starter', 'Caseworkers', 4), ('Starter', 'Businesses', 5),
  ('Starter', 'Finance', 6), ('Starter', 'Reports', 7), ('Starter', 'Pipeline', 8), ('Starter', 'Documents', 9), ('Starter', 'Calendar', 10),
  ('Starter', 'Messages', 11), ('Starter', 'Permissions', 12), ('Starter', 'Settings', 13), ('Starter', 'Licence Requests', 14), ('Starter', 'Enquiries', 15),
  ('Starter', 'Tasks', 16), ('Starter', 'Clients', 17), ('Starter', 'Licence Reviews', 18), ('Starter', 'Application', 19), ('Starter', 'Payments', 20),
  ('Starter', 'Appointments', 21), ('Starter', 'Application Status', 22), ('Starter', 'My Account', 23), ('Starter', 'Profile', 24), ('Starter', 'Licence', 25),
  ('Starter', 'Compliance', 26), ('Starter', 'Workers', 27), ('Starter', 'Payment', 28), ('Starter', 'Reporting Obligations', 29),
  ('Professional', 'Dashboard', 1), ('Professional', 'Cases', 2), ('Professional', 'Candidates', 3), ('Professional', 'Caseworkers', 4), ('Professional', 'Businesses', 5),
  ('Professional', 'Finance', 6), ('Professional', 'Reports', 7), ('Professional', 'Pipeline', 8), ('Professional', 'Workload', 9), ('Professional', 'Documents', 10),
  ('Professional', 'Calendar', 11), ('Professional', 'Messages', 12), ('Professional', 'Escalations', 13), ('Professional', 'Audit Logs', 14), ('Professional', 'Permissions', 15),
  ('Professional', 'Settings', 16), ('Professional', 'Licence Requests', 17), ('Professional', 'Enquiries', 18), ('Professional', 'Assign', 19), ('Professional', 'Departments', 20),
  ('Professional', 'Tasks', 21), ('Professional', 'Clients', 22), ('Professional', 'Performance', 23), ('Professional', 'Licence Reviews', 24), ('Professional', 'Application', 25),
  ('Professional', 'Payments', 26), ('Professional', 'Appointments', 27), ('Professional', 'Application Status', 28), ('Professional', 'My Account', 29), ('Professional', 'Profile', 30),
  ('Professional', 'Licence', 31), ('Professional', 'Compliance', 32), ('Professional', 'Workers', 33), ('Professional', 'Payment', 34), ('Professional', 'Reporting Obligations', 35),
  ('Enterprise', 'Dashboard', 1), ('Enterprise', 'Cases', 2), ('Enterprise', 'Candidates', 3), ('Enterprise', 'Caseworkers', 4), ('Enterprise', 'Businesses', 5),
  ('Enterprise', 'Finance', 6), ('Enterprise', 'Reports', 7), ('Enterprise', 'Pipeline', 8), ('Enterprise', 'Workload', 9), ('Enterprise', 'Documents', 10),
  ('Enterprise', 'Calendar', 11), ('Enterprise', 'Messages', 12), ('Enterprise', 'Escalations', 13), ('Enterprise', 'Audit Logs', 14), ('Enterprise', 'Permissions', 15),
  ('Enterprise', 'Settings', 16), ('Enterprise', 'Licence Requests', 17), ('Enterprise', 'Enquiries', 18), ('Enterprise', 'Assign', 19), ('Enterprise', 'Departments', 20),
  ('Enterprise', 'Tasks', 21), ('Enterprise', 'Clients', 22), ('Enterprise', 'Performance', 23), ('Enterprise', 'Licence Reviews', 24), ('Enterprise', 'Application', 25),
  ('Enterprise', 'Payments', 26), ('Enterprise', 'Appointments', 27), ('Enterprise', 'Application Status', 28), ('Enterprise', 'My Account', 29), ('Enterprise', 'Profile', 30),
  ('Enterprise', 'Licence', 31), ('Enterprise', 'Compliance', 32), ('Enterprise', 'Workers', 33), ('Enterprise', 'Payment', 34), ('Enterprise', 'Reporting Obligations', 35)
) AS v(plan_name, feature, ord)
  ON pl.name = v.plan_name
WHERE pl.id NOT IN (SELECT DISTINCT pricing_plan_id FROM pricing_features);

-- Pricing comparison table
INSERT INTO pricing_comparison (label, standard_value, pro_value, display_order)
SELECT v.label, v.standard, v.pro, v.ord
FROM (VALUES
  ('Active cases', 'Up to 100', 'Unlimited', 1),
  ('Caseworker accounts', '5', 'Unlimited', 2),
  ('Candidate portal', 'true', 'true', 3),
  ('Client portal', 'true', 'true', 4),
  ('Document checklist automation', 'true', 'true', 5),
  ('Deadline tracking & alerts', 'true', 'true', 6),
  ('Compliance reports', 'Standard', 'Advanced + Custom', 7),
  ('Smart Chat (candidate-facing)', 'false', 'true', 8),
  ('Email drafting', 'false', 'true', 9),
  ('Contract generation', 'false', 'true', 10),
  ('Templates library', 'false', 'true', 11),
  ('Speech-to-text notes', 'false', 'true', 12),
  ('Text-to-speech summaries', 'false', 'true', 13),
  ('Firm Feed activity stream', 'false', 'true', 14),
  ('Multi-office management', 'false', 'true', 15),
  ('Analytics & reporting', 'Basic dashboard', 'Advanced + Exports', 16),
  ('API access', 'false', 'true', 17),
  ('Custom integrations', 'false', 'true', 18),
  ('Support', 'Email', 'Priority email + phone', 19),
  ('Onboarding', 'Self-serve', 'Guided setup', 20)
) AS v(label, standard, pro, ord)
WHERE NOT EXISTS (SELECT 1 FROM pricing_comparison c WHERE c.label = v.label);

-- ------------------------------------------------------------
-- 5. Resource categories + sample resources
-- ------------------------------------------------------------
INSERT INTO resource_categories (key, label, bg_class, text_class, display_order, is_active)
SELECT v.key, v.label, v.bg, v.text, v.ord, TRUE
FROM (VALUES
  ('guides', 'Guides', 'bg-emerald/10', 'text-emerald', 1),
  ('case-studies', 'Case Studies', 'bg-blue/10', 'text-blue', 2),
  ('product', 'Product Updates', 'bg-indigo/10', 'text-indigo', 3),
  ('compliance', 'Compliance', 'bg-amber/10', 'text-amber', 4)
) AS v(key, label, bg, text, ord)
WHERE NOT EXISTS (SELECT 1 FROM resource_categories c WHERE c.key = v.key);

INSERT INTO resources (category_id, title, excerpt, read_time, is_active, display_order)
SELECT c.id, v.title, v.excerpt, v.read_time, TRUE, v.ord
FROM resource_categories c
JOIN (VALUES
  ('guides', 1, 'Building a compliant sponsor licence file: a practical checklist', 'A step-by-step guide to keeping the records UKVI expects from every licensed sponsor, from CoS allocation to worker monitoring.', '6 min read'),
  ('guides', 2, 'Moving your immigration practice off spreadsheets', 'Why spreadsheet-based case tracking fails at scale and how a purpose-built platform keeps every matter audit-ready.', '8 min read'),
  ('product', 3, 'What is ImCam Hub?', 'An overview of the platform — case management, portals for clients and sponsors, and AI-assisted compliance for UK immigration consultancies.', '4 min read'),
  ('compliance', 4, 'Understanding sponsor licence reporting duties', 'A plain-English summary of the reporting obligations every UK sponsor must meet, and how automation keeps them on track.', '7 min read')
) AS v(cat_key, ord, title, excerpt, read_time)
  ON c.key = v.cat_key
WHERE NOT EXISTS (SELECT 1 FROM resources r WHERE r.title = v.title);

-- ------------------------------------------------------------
-- 6. Solutions page content sections
-- ------------------------------------------------------------
INSERT INTO solutions_content (section_key, title, description, content, display_order, is_active)
SELECT 'hero', 'The Challenges UK Immigration Consultancies Face',
  'Complex regulations. Tight deadlines. High client expectations. Lean teams. Fragmented tools. ImCam Hub was built to solve every one of these challenges for UK immigration consultancies.',
  $j$ {"badge": "The Problem"} $j$::jsonb, 1, TRUE
WHERE NOT EXISTS (SELECT 1 FROM solutions_content s WHERE s.section_key = 'hero');

INSERT INTO solutions_content (section_key, title, description, content, display_order, is_active)
SELECT 'stats', NULL, NULL,
  $j$ {
    "items": [
      { "value": "73%", "label": "of firms use spreadsheets", "color": "text-rose" },
      { "value": "40%", "label": "cases miss deadlines", "color": "text-orange" },
      { "value": "6hrs", "label": "wasted daily on admin", "color": "text-amber" }
    ]
  } $j$::jsonb, 2, TRUE
WHERE NOT EXISTS (SELECT 1 FROM solutions_content s WHERE s.section_key = 'stats');

INSERT INTO solutions_content (section_key, title, description, content, display_order, is_active)
SELECT 'challenges', 'Sound Familiar?',
  'These are the daily realities UK immigration teams face without a unified system.',
  $j$ {
    "items": [
      { "title": "Manual Case Tracking", "description": "Spreadsheets, shared drives, and sticky notes create a fragmented view of your caseload — making it impossible to see which matters are on track and which are at risk." },
      { "title": "Missed Deadlines", "description": "Filing windows, interview dates, and renewal deadlines are tracked in emails and calendars with no automated safety net — one missed date can mean a rejected application." },
      { "title": "Fragmented Client Communication", "description": "Requests, documents, and updates are scattered across email threads, phone calls, and messaging apps — caseworkers waste hours reconstructing conversation history." },
      { "title": "Compliance Risk", "description": "Regulatory requirements change frequently and vary by jurisdiction. Without automated checks, firms risk filing errors, data breaches, and audit failures." }
    ]
  } $j$::jsonb, 3, TRUE
WHERE NOT EXISTS (SELECT 1 FROM solutions_content s WHERE s.section_key = 'challenges');

INSERT INTO solutions_content (section_key, title, description, content, display_order, is_active)
SELECT 'solutions', 'Our Solutions',
  'Eight powerful capabilities that eliminate manual work, reduce risk, and keep your caseload moving automatically.',
  $j$ {} $j$::jsonb, 4, TRUE
WHERE NOT EXISTS (SELECT 1 FROM solutions_content s WHERE s.section_key = 'solutions');

INSERT INTO solutions_content (section_key, title, description, content, display_order, is_active)
SELECT 'how_it_works', 'How It Works',
  'Three steps from sign-up to a fully connected immigration practice.',
  $j$ {
    "steps": [
      { "number": "01", "title": "Register", "description": "Register your consultancy, add your caseworkers, and set up your admin account. Managers get full oversight from day one, with role-based access configured automatically." },
      { "number": "02", "title": "Onboard Cases & Clients", "description": "Add candidates or sponsoring businesses and start their case journey — Skilled Worker, Sponsor Licence, ILR, or Citizenship — with pre-built workflows ready to go, no manual setup required." },
      { "number": "03", "title": "Manage & Track", "description": "Assign caseworkers, track every case through its stages, and let AI flag missing documents, compliance risks, and delays — while clients and businesses follow their own progress in real time." }
    ]
  } $j$::jsonb, 5, TRUE
WHERE NOT EXISTS (SELECT 1 FROM solutions_content s WHERE s.section_key = 'how_it_works');

INSERT INTO solutions_content (section_key, title, description, content, display_order, is_active)
SELECT 'cta', 'Ready to see ImCam Hub in action?',
  'Join UK immigration consultancies that have transformed their workflow with ImCam Hub. Schedule a personalized demo today.',
  $j$ { "button_text": "Book a Free Demo", "button_link": "/book-demo" } $j$::jsonb, 6, TRUE
WHERE NOT EXISTS (SELECT 1 FROM solutions_content s WHERE s.section_key = 'cta');

-- ------------------------------------------------------------
-- 7. Book Demo config
-- ------------------------------------------------------------
INSERT INTO book_demo_config
  (hero_title, hero_description, trust_title, trust_description, steps,
   testimonial_quote, testimonial_author, testimonial_role, contact_phone, contact_email,
   cta_title, cta_description, cta_button_text, cta_button_link, background_image)
SELECT 'See ImCam Hub in Action',
  'Get a personalized walkthrough of the platform. No commitment, no hard sell — just a clear look at how ImCam Hub fits your practice.',
  'What to expect',
  'Over 200 immigration practices trust ImCam Hub to manage their cases, deadlines, and client relationships. This demo is a no-pressure walkthrough tailored to your firm''s specific workflows and questions.',
  $j$ [
    { "icon": "Clock", "text": "We confirm your preferred slot within 24 hours", "color": "bg-blue/10 text-blue" },
    { "icon": "Play", "text": "30-minute live walkthrough with a product specialist", "color": "bg-indigo/10 text-indigo" },
    { "icon": "FileText", "text": "Custom quote based on your firm size and needs", "color": "bg-emerald/10 text-emerald" },
    { "icon": "Shield", "text": "No commitment — decide at your own pace", "color": "bg-purple/10 text-purple" }
  ] $j$::jsonb,
  'We went from 3 different tools and endless email chains to one system in under a month. Our caseworkers saved 10+ hours a week within the first quarter.',
  'Sarah Mitchell', 'Managing Partner, Mitchell & Associates',
  '1-800-555-1234', 'hello@incamhub.com',
  'Ready to see ImCam Hub in action?',
  'Explore how ImCam Hub can transform your immigration practice with a personalized demo.',
  'Book a Free Demo', '/book-demo', NULL
WHERE NOT EXISTS (SELECT 1 FROM book_demo_config);

-- ------------------------------------------------------------
-- 8. Website navigation
-- ------------------------------------------------------------
INSERT INTO website_navigation (label, url, display_order, is_active)
SELECT v.label, v.url, v.ord, TRUE
FROM (VALUES
  ('Home', '/', 1),
  ('Features', '/features', 2),
  ('Solutions', '/solutions', 3),
  ('Pricing', '/pricing', 4)
) AS v(label, url, ord)
WHERE NOT EXISTS (SELECT 1 FROM website_navigation n WHERE n.label = v.label AND n.parent_id IS NULL);

INSERT INTO website_navigation (label, url, parent_id, display_order, is_active)
SELECT v.label, v.url, p.id, v.ord, TRUE
FROM website_navigation p
JOIN (VALUES
  ('Admin Dashboard', '/features/admin', 1),
  ('Caseworker Portal', '/features/caseworker', 2),
  ('Client Portal', '/features/candidate', 3),
  ('Sponsor Business', '/features/client', 4)
) AS v(label, url, ord) ON p.label = 'Features' AND p.parent_id IS NULL
WHERE NOT EXISTS (SELECT 1 FROM website_navigation n WHERE n.label = v.label AND n.parent_id = p.id);

-- ------------------------------------------------------------
-- 9. Footer links
-- ------------------------------------------------------------
INSERT INTO footer_links (group_key, label, url, display_order, is_active)
SELECT v.group_key, v.label, v.url, v.ord, TRUE
FROM (VALUES
  ('product', 'Admin Dashboard', '/features/admin', 1),
  ('product', 'Caseworker Portal', '/features/caseworker', 2),
  ('product', 'Client Portal', '/features/candidate', 3),
  ('product', 'Sponsor Business', '/features/client', 4),
  ('product', 'Integrations', '/resources', 5),
  ('company', 'About Us', '/resources', 1),
  ('company', 'Solutions', '/solutions', 2),
  ('company', 'Pricing', '/pricing', 3),
  ('company', 'Resources', '/resources', 4),
  ('company', 'Careers', '/resources', 5)
) AS v(group_key, label, url, ord)
WHERE NOT EXISTS (SELECT 1 FROM footer_links f WHERE f.group_key = v.group_key AND f.label = v.label);

-- ------------------------------------------------------------
-- 10. SEO settings (global + marketing pages)
-- ------------------------------------------------------------
INSERT INTO seo_settings (page_key, page_title, meta_description)
SELECT v.page_key, v.page_title, v.meta_description
FROM (VALUES
  ('home', 'UK Immigration Case Management Platform - ImCam Hub', 'ImCam Hub is the case management platform for UK immigration consultancies. Manage Skilled Worker visas, Sponsor Licences, ILR, and British Citizenship cases in one place.'),
  ('features', 'Features - ImCam Hub', 'Explore the four connected portals of ImCam Hub for UK immigration consultancies: admin, caseworker, client, and business/sponsor.'),
  ('solutions', 'Solutions - ImCam Hub', 'Document vault, case pipelines, client and sponsor portals, reporting, and AI-powered case intelligence - built for UK immigration consultancies.'),
  ('pricing', 'Pricing - ImCam Hub', 'Simple, transparent pricing for immigration practices of every size. Compare Starter, Professional and Enterprise plans.'),
  ('demo', 'Book a Free Demo - ImCam Hub', 'Schedule a personalized walkthrough of ImCam Hub and see how it transforms immigration case management for your practice.'),
  ('about', 'About - ImCam Hub', 'Learn about ImCam Hub, the case management platform built for UK immigration consultancies.'),
  ('contact', 'Contact - ImCam Hub', 'Get in touch with the ImCam Hub team for support, partnerships, or a free demo.')
) AS v(page_key, page_title, meta_description)
WHERE NOT EXISTS (SELECT 1 FROM seo_settings s WHERE s.page_key = v.page_key);