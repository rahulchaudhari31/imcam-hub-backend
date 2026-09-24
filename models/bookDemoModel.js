import pool from '../config/db.js';

function parseJson(value) {
  return typeof value === 'string' ? JSON.parse(value) : value;
}

function normalizeBookDemoConfig(row) {
  if (!row) return row;
  return {
    ...row,
    steps: parseJson(row.steps) || [],
  };
}

const BookDemoConfig = {
  async find() {
    const { rows } = await pool.query(
      'SELECT * FROM book_demo_config ORDER BY id ASC LIMIT 1'
    );
    return normalizeBookDemoConfig(rows[0]) || null;
  },

  async create({
    heroTitle, heroDescription, trustTitle, trustDescription, steps,
    testimonialQuote, testimonialAuthor, testimonialRole,
    contactPhone, contactEmail,
    ctaTitle, ctaDescription, ctaButtonText, ctaButtonLink,
    backgroundImage
  }) {
    const { rows } = await pool.query(
      `INSERT INTO book_demo_config (
        hero_title, hero_description, trust_title, trust_description, steps,
        testimonial_quote, testimonial_author, testimonial_role,
        contact_phone, contact_email,
        cta_title, cta_description, cta_button_text, cta_button_link,
        background_image
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        heroTitle || 'See ImCam Hub in Action',
        heroDescription || 'Get a personalized walkthrough of the platform. No commitment, no hard sell — just a clear look at how ImCam Hub fits your practice.',
        trustTitle || 'What to expect',
        trustDescription || 'Over 200 immigration practices trust ImCam Hub to manage their cases, deadlines, and client relationships. This demo is a no-pressure walkthrough tailored to your firm\'s specific workflows and questions.',
        steps ? JSON.stringify(steps) : null,
        testimonialQuote || 'We went from 3 different tools and endless email chains to one system in under a month. Our caseworkers saved 10+ hours a week within the first quarter.',
        testimonialAuthor || 'Sarah Mitchell',
        testimonialRole || 'Managing Partner, Mitchell & Associates',
        contactPhone || '+44 20 7946 0958',
        contactEmail || 'hello@incamhub.com',
        ctaTitle || 'Ready to see ImCam Hub in action?',
        ctaDescription || 'Explore how ImCam Hub can transform your immigration practice with a personalized demo.',
        ctaButtonText || 'Book a Free Demo',
        ctaButtonLink || '/book-demo',
        backgroundImage || null
      ]
    );
    return normalizeBookDemoConfig(rows[0]);
  },

  async update(id, {
    heroTitle, heroDescription, trustTitle, trustDescription, steps,
    testimonialQuote, testimonialAuthor, testimonialRole,
    contactPhone, contactEmail,
    ctaTitle, ctaDescription, ctaButtonText, ctaButtonLink,
    backgroundImage
  }) {
    const { rows } = await pool.query(
      `UPDATE book_demo_config
       SET hero_title = COALESCE($2, hero_title),
           hero_description = COALESCE($3, hero_description),
           trust_title = COALESCE($4, trust_title),
           trust_description = COALESCE($5, trust_description),
           steps = COALESCE($6, steps),
           testimonial_quote = COALESCE($7, testimonial_quote),
           testimonial_author = COALESCE($8, testimonial_author),
           testimonial_role = COALESCE($9, testimonial_role),
           contact_phone = COALESCE($10, contact_phone),
           contact_email = COALESCE($11, contact_email),
           cta_title = COALESCE($12, cta_title),
           cta_description = COALESCE($13, cta_description),
           cta_button_text = COALESCE($14, cta_button_text),
           cta_button_link = COALESCE($15, cta_button_link),
           background_image = COALESCE($16, background_image),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [
        id, heroTitle, heroDescription, trustTitle, trustDescription,
        steps ? JSON.stringify(steps) : null,
        testimonialQuote, testimonialAuthor, testimonialRole,
        contactPhone, contactEmail,
        ctaTitle, ctaDescription, ctaButtonText, ctaButtonLink,
        backgroundImage
      ]
    );
    return normalizeBookDemoConfig(rows[0]) || null;
  },

  async upsert(data) {
    const existing = await this.find();
    if (existing) {
      return this.update(existing.id, data);
    }
    return this.create(data);
  },
};

export default BookDemoConfig;