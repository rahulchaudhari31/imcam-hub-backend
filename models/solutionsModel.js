import pool from '../config/db.js';

function parseJson(value) {
  return typeof value === 'string' ? JSON.parse(value) : value;
}

function normalizeSolutionsContent(row) {
  if (!row) return row;
  return {
    ...row,
    content: parseJson(row.content) || null,
  };
}

const SolutionsContent = {
  async findAll() {
    const { rows } = await pool.query(
      'SELECT * FROM solutions_content ORDER BY display_order ASC'
    );
    return rows.map(normalizeSolutionsContent);
  },

  async findActive() {
    const { rows } = await pool.query(
      'SELECT * FROM solutions_content WHERE is_active = true ORDER BY display_order ASC'
    );
    return rows.map(normalizeSolutionsContent);
  },

  async findBySectionKey(sectionKey) {
    const { rows } = await pool.query(
      'SELECT * FROM solutions_content WHERE section_key = $1',
      [sectionKey]
    );
    return normalizeSolutionsContent(rows[0]) || null;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM solutions_content WHERE id = $1',
      [id]
    );
    return normalizeSolutionsContent(rows[0]) || null;
  },

  async create({ sectionKey, title, description, content, display_order, is_active }) {
    const { rows } = await pool.query(
      `INSERT INTO solutions_content (section_key, title, description, content, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [sectionKey, title || null, description || null, content ? JSON.stringify(content) : null, display_order || 0, is_active !== false]
    );
    return normalizeSolutionsContent(rows[0]);
  },

  async update(id, { title, description, content, display_order, is_active }) {
    const { rows } = await pool.query(
      `UPDATE solutions_content
       SET title = COALESCE($2, title),
           description = COALESCE($3, description),
           content = COALESCE($4, content),
           display_order = COALESCE($5, display_order),
           is_active = COALESCE($6, is_active),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, title, description, content ? JSON.stringify(content) : null, display_order, is_active]
    );
    return normalizeSolutionsContent(rows[0]) || null;
  },

  async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM solutions_content WHERE id = $1 RETURNING *',
      [id]
    );
    return normalizeSolutionsContent(rows[0]) || null;
  },
};

export default SolutionsContent;