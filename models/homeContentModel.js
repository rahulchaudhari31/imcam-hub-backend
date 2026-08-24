import pool from '../config/db.js';

function normalizeHomeContent(row) {
  if (!row) return row;
  return {
    ...row,
    secondaryButtonText: row.secondarybuttontext ?? row.secondaryButtonText ?? null,
    secondaryButtonLink: row.secondarybuttonlink ?? row.secondaryButtonLink ?? null,
  };
}

const HomeContent = {
  async findAll() {
    const { rows } = await pool.query(
      'SELECT * FROM home_content ORDER BY display_order ASC'
    );
    return rows.map(normalizeHomeContent);
  },

  async findBySection(sectionKey) {
    const { rows } = await pool.query(
      'SELECT * FROM home_content WHERE section_key = $1',
      [sectionKey]
    );
    return normalizeHomeContent(rows[0]) || null;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM home_content WHERE id = $1',
      [id]
    );
    return normalizeHomeContent(rows[0]) || null;
  },

  async create({ sectionKey, title, description, imageUrl, button_text, button_link, secondaryButtonText, secondaryButtonLink, content, display_order, is_active }) {
    const { rows } = await pool.query(
      `INSERT INTO home_content (section_key, title, description, image_url, button_text, button_link, secondaryButtonText, secondaryButtonLink, content, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [sectionKey, title, description, imageUrl || null, button_text || null, button_link || null, secondaryButtonText || null, secondaryButtonLink || null, content ? JSON.stringify(content) : null, display_order || 0, is_active !== false]
    );
    return normalizeHomeContent(rows[0]);
  },

  async update(id, { title, description, imageUrl, button_text, button_link, secondaryButtonText, secondaryButtonLink, content, display_order, is_active }) {
    const { rows } = await pool.query(
      `UPDATE home_content
       SET title = COALESCE($2, title),
           description = COALESCE($3, description),
           image_url = COALESCE($4, image_url),
           button_text = COALESCE($5, button_text),
           button_link = COALESCE($6, button_link),
           secondaryButtonText = COALESCE($7, secondaryButtonText),
           secondaryButtonLink = COALESCE($8, secondaryButtonLink),
           content = COALESCE($9, content),
           display_order = COALESCE($10, display_order),
           is_active = COALESCE($11, is_active),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, title, description, imageUrl, button_text, button_link, secondaryButtonText, secondaryButtonLink, content ? JSON.stringify(content) : null, display_order, is_active]
    );
    return normalizeHomeContent(rows[0]) || null;
  },

  async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM home_content WHERE id = $1 RETURNING *',
      [id]
    );
    return normalizeHomeContent(rows[0]) || null;
  },
};

export default HomeContent;
