import pool from '../config/db.js';

const FooterLink = {
  async findAll() {
    const { rows } = await pool.query(
      'SELECT * FROM footer_links ORDER BY group_key, display_order ASC'
    );
    return rows;
  },

  async findActive() {
    const { rows } = await pool.query(
      'SELECT * FROM footer_links WHERE is_active = true ORDER BY group_key, display_order ASC'
    );
    return rows;
  },

  async findByGroupKey(groupKey) {
    const { rows } = await pool.query(
      'SELECT * FROM footer_links WHERE group_key = $1 AND is_active = true ORDER BY display_order ASC',
      [groupKey]
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM footer_links WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  async create({ group_key, label, url, display_order, is_active }) {
    const { rows } = await pool.query(
      `INSERT INTO footer_links (group_key, label, url, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [group_key, label, url || null, display_order || 0, is_active !== false]
    );
    return rows[0];
  },

  async update(id, { group_key, label, url, display_order, is_active }) {
    const { rows } = await pool.query(
      `UPDATE footer_links
       SET group_key = COALESCE($2, group_key),
           label = COALESCE($3, label),
           url = COALESCE($4, url),
           display_order = COALESCE($5, display_order),
           is_active = COALESCE($6, is_active),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, group_key, label, url, display_order, is_active]
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM footer_links WHERE id = $1 RETURNING *',
      [id]
    );
    return rows[0] || null;
  },

  async reorder(groupKey, items) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const item of items) {
        await client.query(
          'UPDATE footer_links SET display_order = $1, updated_at = NOW() WHERE id = $2 AND group_key = $3',
          [item.display_order, item.id, groupKey]
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

  async getAllGrouped() {
    const links = await this.findActive();
    const grouped = {};
    for (const link of links) {
      if (!grouped[link.group_key]) {
        grouped[link.group_key] = [];
      }
      grouped[link.group_key].push(link);
    }
    return grouped;
  },
};

export default FooterLink;