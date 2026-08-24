import pool from '../config/db.js';

const SeoSettings = {
  async findAll() {
    const { rows } = await pool.query(
      'SELECT * FROM seo_settings ORDER BY id'
    );
    return rows;
  },

  async findByPageKey(pageKey) {
    const { rows } = await pool.query(
      'SELECT * FROM seo_settings WHERE page_key = $1',
      [pageKey]
    );
    return rows[0] || null;
  },

  async upsert({ page_key, page_title, meta_description, meta_keywords, og_title, og_description, og_image }) {
    const { rows } = await pool.query(
      `INSERT INTO seo_settings (page_key, page_title, meta_description, meta_keywords, og_title, og_description, og_image, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       ON CONFLICT (page_key) DO UPDATE SET
         page_title = COALESCE($2, seo_settings.page_title),
         meta_description = COALESCE($3, seo_settings.meta_description),
         meta_keywords = COALESCE($4, seo_settings.meta_keywords),
         og_title = COALESCE($5, seo_settings.og_title),
         og_description = COALESCE($6, seo_settings.og_description),
         og_image = COALESCE($7, seo_settings.og_image),
         updated_at = NOW()
       RETURNING *`,
      [page_key, page_title || null, meta_description || null, meta_keywords || null, og_title || null, og_description || null, og_image || null]
    );
    return rows[0];
  },
};

export default SeoSettings;
