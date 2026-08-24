import pool from '../config/db.js';

const Faq = {
  async findAll({ activeOnly = false } = {}) {
    const where = activeOnly ? 'WHERE is_active = TRUE' : '';
    const { rows } = await pool.query(
      `SELECT * FROM faqs ${where} ORDER BY display_order ASC, created_at ASC`
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM faqs WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  async create({ question, answer, display_order, is_active }) {
    const { rows } = await pool.query(
      `INSERT INTO faqs (question, answer, display_order, is_active)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [question, answer, display_order || 0, is_active !== false]
    );
    return rows[0];
  },

  async update(id, { question, answer, display_order, is_active }) {
    const { rows } = await pool.query(
      `UPDATE faqs
       SET question = COALESCE($2, question),
           answer = COALESCE($3, answer),
           display_order = COALESCE($4, display_order),
           is_active = COALESCE($5, is_active),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, question, answer, display_order, is_active]
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM faqs WHERE id = $1 RETURNING *',
      [id]
    );
    return rows[0] || null;
  },
};

export default Faq;
