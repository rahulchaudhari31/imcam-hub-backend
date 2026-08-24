import pool from '../config/db.js';

const Testimonial = {
  async findAll({ activeOnly = false } = {}) {
    const where = activeOnly ? 'WHERE is_active = TRUE' : '';
    const { rows } = await pool.query(
      `SELECT * FROM testimonials ${where} ORDER BY created_at ASC`
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM testimonials WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  async create({ fullName, company, role, testimonial, imageUrl, rating, is_active }) {
    const { rows } = await pool.query(
      `INSERT INTO testimonials (full_name, company, role, testimonial, image_url, rating, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [fullName, company || null, role || null, testimonial, imageUrl || null, rating || 5, is_active !== false]
    );
    return rows[0];
  },

  async update(id, { fullName, company, role, testimonial, imageUrl, rating, is_active }) {
    const { rows } = await pool.query(
      `UPDATE testimonials
       SET full_name = COALESCE($2, full_name),
           company = COALESCE($3, company),
           role = COALESCE($4, role),
           testimonial = COALESCE($5, testimonial),
           image_url = COALESCE($6, image_url),
           rating = COALESCE($7, rating),
           is_active = COALESCE($8, is_active),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, fullName, company, role, testimonial, imageUrl, rating, is_active]
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM testimonials WHERE id = $1 RETURNING *',
      [id]
    );
    return rows[0] || null;
  },
};

export default Testimonial;
