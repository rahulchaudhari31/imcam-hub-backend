import pool from '../config/db.js';

const Navigation = {
  async findAll() {
    const { rows } = await pool.query(
      'SELECT * FROM website_navigation ORDER BY parent_id NULLS FIRST, display_order ASC'
    );
    return rows;
  },

  async findActive() {
    const { rows } = await pool.query(
      'SELECT * FROM website_navigation WHERE is_active = true ORDER BY parent_id NULLS FIRST, display_order ASC'
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM website_navigation WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  async create({ label, url, parent_id, display_order, is_active, target_blank, icon }) {
    const { rows } = await pool.query(
      `INSERT INTO website_navigation (label, url, parent_id, display_order, is_active, target_blank, icon)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [label, url || null, parent_id || null, display_order || 0, is_active !== false, target_blank || false, icon || null]
    );
    return rows[0];
  },

  async update(id, { label, url, parent_id, display_order, is_active, target_blank, icon }) {
    const { rows } = await pool.query(
      `UPDATE website_navigation
       SET label = COALESCE($2, label),
           url = COALESCE($3, url),
           parent_id = COALESCE($4, parent_id),
           display_order = COALESCE($5, display_order),
           is_active = COALESCE($6, is_active),
           target_blank = COALESCE($7, target_blank),
           icon = COALESCE($8, icon),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, label, url, parent_id, display_order, is_active, target_blank, icon]
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM website_navigation WHERE id = $1 RETURNING *',
      [id]
    );
    return rows[0] || null;
  },

  async reorder(items) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const item of items) {
        await client.query(
          'UPDATE website_navigation SET display_order = $1, parent_id = $2, updated_at = NOW() WHERE id = $3',
          [item.display_order, item.parent_id || null, item.id]
        );
      }
      await client.query('COMMIT');
      return true;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },
};

export default Navigation;