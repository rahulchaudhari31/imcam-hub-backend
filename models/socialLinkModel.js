import pool from '../config/db.js';

const SocialLink = {
  async findAll() {
    const { rows } = await pool.query(
      'SELECT * FROM social_links ORDER BY display_order ASC'
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM social_links WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  async create({ platform, url, display_order, is_active }) {
    const { rows } = await pool.query(
      `INSERT INTO social_links (platform, url, display_order, is_active)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [platform, url, display_order || 0, is_active !== false]
    );
    return rows[0];
  },

  async update(id, { platform, url, display_order, is_active }) {
    const { rows } = await pool.query(
      `UPDATE social_links
       SET platform = COALESCE($2, platform),
           url = COALESCE($3, url),
           display_order = COALESCE($4, display_order),
           is_active = COALESCE($5, is_active),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, platform, url, display_order, is_active]
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM social_links WHERE id = $1 RETURNING *',
      [id]
    );
    return rows[0] || null;
  },
};

export default SocialLink;
