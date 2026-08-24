import pool from '../config/db.js';

const WebsiteSettings = {
  async findAll() {
    const { rows } = await pool.query(
      'SELECT id, setting_key, setting_value, created_at, updated_at FROM website_settings ORDER BY id'
    );
    return rows;
  },

  async findByKey(key) {
    const { rows } = await pool.query(
      'SELECT id, setting_key, setting_value FROM website_settings WHERE setting_key = $1',
      [key]
    );
    return rows[0] || null;
  },

  async upsert(key, value) {
    const { rows } = await pool.query(
      `INSERT INTO website_settings (setting_key, setting_value, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (setting_key) DO UPDATE SET setting_value = $2, updated_at = NOW()
       RETURNING id, setting_key, setting_value, updated_at`,
      [key, value]
    );
    return rows[0];
  },

  async bulkUpsert(settings) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const results = [];
      for (const { key, value } of settings) {
        const { rows } = await client.query(
          `INSERT INTO website_settings (setting_key, setting_value, updated_at)
           VALUES ($1, $2, NOW())
           ON CONFLICT (setting_key) DO UPDATE SET setting_value = $2, updated_at = NOW()
           RETURNING id, setting_key, setting_value, updated_at`,
          [key, value]
        );
        results.push(rows[0]);
      }
      await client.query('COMMIT');
      return results;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },
};

export default WebsiteSettings;
