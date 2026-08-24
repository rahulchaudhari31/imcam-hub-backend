import pool from '../config/db.js';

const Media = {
  async findAll({ page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    const countResult = await pool.query('SELECT COUNT(*) FROM media');
    const total = parseInt(countResult.rows[0].count, 10);
    const { rows } = await pool.query(
      'SELECT * FROM media ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return { data: rows, total, page, limit };
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM media WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  async create({ filename, originalName, mimeType, fileSize, url, altText }) {
    const { rows } = await pool.query(
      `INSERT INTO media (filename, original_name, mime_type, file_size, url, alt_text)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [filename, originalName, mimeType, fileSize, url, altText || null]
    );
    return rows[0];
  },

  async updateAltText(id, altText) {
    const { rows } = await pool.query(
      'UPDATE media SET alt_text = $2 WHERE id = $1 RETURNING *',
      [id, altText]
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM media WHERE id = $1 RETURNING *',
      [id]
    );
    return rows[0] || null;
  },
};

export default Media;
