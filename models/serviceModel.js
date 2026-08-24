import pool from '../config/db.js';

const Service = {
  async findAll({ activeOnly = false } = {}) {
    const where = activeOnly ? 'WHERE is_active = TRUE' : '';
    const { rows } = await pool.query(
      `SELECT * FROM services ${where} ORDER BY display_order ASC, created_at ASC`
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM services WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  async create({ title, description, imageUrl, icon, display_order, is_active }) {
    const { rows } = await pool.query(
      `INSERT INTO services (title, description, image_url, icon, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, description || null, imageUrl || null, icon || null, display_order || 0, is_active !== false]
    );
    return rows[0];
  },

  async update(id, { title, description, imageUrl, icon, display_order, is_active }) {
    const { rows } = await pool.query(
      `UPDATE services
       SET title = COALESCE($2, title),
           description = COALESCE($3, description),
           image_url = COALESCE($4, image_url),
           icon = COALESCE($5, icon),
           display_order = COALESCE($6, display_order),
           is_active = COALESCE($7, is_active),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, title, description, imageUrl, icon, display_order, is_active]
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM services WHERE id = $1 RETURNING *',
      [id]
    );
    return rows[0] || null;
  },
};

export default Service;
