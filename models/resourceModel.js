import pool from '../config/db.js';

const ResourceCategory = {
  async findAll() {
    const { rows } = await pool.query(
      'SELECT * FROM resource_categories ORDER BY display_order ASC'
    );
    return rows;
  },

  async findActive() {
    const { rows } = await pool.query(
      'SELECT * FROM resource_categories WHERE is_active = true ORDER BY display_order ASC'
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM resource_categories WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  async create({ key, label, bg_class, text_class, display_order, is_active }) {
    const { rows } = await pool.query(
      `INSERT INTO resource_categories (key, label, bg_class, text_class, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [key, label, bg_class || null, text_class || null, display_order || 0, is_active !== false]
    );
    return rows[0];
  },

  async update(id, { label, bg_class, text_class, display_order, is_active }) {
    const { rows } = await pool.query(
      `UPDATE resource_categories
       SET label = COALESCE($2, label),
           bg_class = COALESCE($3, bg_class),
           text_class = COALESCE($4, text_class),
           display_order = COALESCE($5, display_order),
           is_active = COALESCE($6, is_active),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, label, bg_class, text_class, display_order, is_active]
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM resource_categories WHERE id = $1 RETURNING *',
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
          'UPDATE resource_categories SET display_order = $1, updated_at = NOW() WHERE id = $2',
          [item.display_order, item.id]
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

const Resource = {
  async findAll() {
    const { rows } = await pool.query(
      'SELECT * FROM resources ORDER BY display_order ASC'
    );
    return rows;
  },

  async findActive() {
    const { rows } = await pool.query(
      'SELECT * FROM resources WHERE is_active = true ORDER BY published_at DESC NULLS LAST, display_order ASC'
    );
    return rows;
  },

  async findByCategory(categoryId) {
    const { rows } = await pool.query(
      'SELECT * FROM resources WHERE category_id = $1 AND is_active = true ORDER BY published_at DESC NULLS LAST, display_order ASC',
      [categoryId]
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM resources WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  async create({ category_id, title, excerpt, content, image_url, read_time, published_at, is_active, display_order }) {
    const { rows } = await pool.query(
      `INSERT INTO resources (category_id, title, excerpt, content, image_url, read_time, published_at, is_active, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [category_id || null, title, excerpt || null, content || null, image_url || null, read_time || null, published_at || null, is_active !== false, display_order || 0]
    );
    return rows[0];
  },

  async update(id, { category_id, title, excerpt, content, image_url, read_time, published_at, is_active, display_order }) {
    const { rows } = await pool.query(
      `UPDATE resources
       SET category_id = COALESCE($2, category_id),
           title = COALESCE($3, title),
           excerpt = COALESCE($4, excerpt),
           content = COALESCE($5, content),
           image_url = COALESCE($6, image_url),
           read_time = COALESCE($7, read_time),
           published_at = COALESCE($8, published_at),
           is_active = COALESCE($9, is_active),
           display_order = COALESCE($10, display_order),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, category_id, title, excerpt, content, image_url, read_time, published_at, is_active, display_order]
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM resources WHERE id = $1 RETURNING *',
      [id]
    );
    return rows[0] || null;
  },

  async reorder(categoryId, items) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const item of items) {
        await client.query(
          'UPDATE resources SET display_order = $1, updated_at = NOW() WHERE id = $2 AND category_id = $3',
          [item.display_order, item.id, categoryId]
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

export { ResourceCategory, Resource };