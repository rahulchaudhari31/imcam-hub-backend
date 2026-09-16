import pool from '../config/db.js';

function parseJson(value) {
  return typeof value === 'string' ? JSON.parse(value) : value;
}

function normalizeFeaturePage(row) {
  if (!row) return row;
  return {
    ...row,
    introText: parseJson(row.intro_text) || [],
    introReverse: parseJson(row.intro_reverse) || false,
    middleParagraphs: parseJson(row.middle_paragraphs) || [],
    middlePoints: parseJson(row.middle_points) || [],
  };
}

const FeaturePage = {
  async findAll() {
    const { rows } = await pool.query(
      'SELECT * FROM feature_pages ORDER BY id ASC'
    );
    return rows.map(normalizeFeaturePage);
  },

  async findActive() {
    const { rows } = await pool.query(
      'SELECT * FROM feature_pages ORDER BY id ASC'
    );
    return rows.map(normalizeFeaturePage);
  },

  async findByPageKey(pageKey) {
    const { rows } = await pool.query(
      'SELECT * FROM feature_pages WHERE page_key = $1',
      [pageKey]
    );
    return normalizeFeaturePage(rows[0]) || null;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM feature_pages WHERE id = $1',
      [id]
    );
    return normalizeFeaturePage(rows[0]) || null;
  },

  async create({
    pageKey, roleName, bannerText, bannerSubline, bannerColor, bannerImage, bannerOverlay,
    introHeading, introText, introReverse, introImage, introImageLabel,
    middleBadge, middleHeading, middleParagraphs, middlePoints, middleImage,
    bottomCtaHeading, bottomCtaText, bottomCtaButtonText, bottomCtaButtonLink
  }) {
    const { rows } = await pool.query(
      `INSERT INTO feature_pages (
        page_key, role_name, banner_text, banner_subline, banner_color, banner_image, banner_overlay,
        intro_heading, intro_text, intro_reverse, intro_image, intro_image_label,
        middle_badge, middle_heading, middle_paragraphs, middle_points, middle_image,
        bottom_cta_heading, bottom_cta_text, bottom_cta_button_text, bottom_cta_button_link
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *`,
      [
        pageKey, roleName, bannerText, bannerSubline, bannerColor || 'bg-navy', bannerImage || null, bannerOverlay !== false,
        introHeading || null, introText ? JSON.stringify(introText) : null, introReverse || false, introImage || null, introImageLabel || null,
        middleBadge || null, middleHeading || null, middleParagraphs ? JSON.stringify(middleParagraphs) : null, middlePoints ? JSON.stringify(middlePoints) : null, middleImage || null,
        bottomCtaHeading || null, bottomCtaText || null, bottomCtaButtonText || null, bottomCtaButtonLink || null
      ]
    );
    return normalizeFeaturePage(rows[0]);
  },

  async update(id, {
    roleName, bannerText, bannerSubline, bannerColor, bannerImage, bannerOverlay,
    introHeading, introText, introReverse, introImage, introImageLabel,
    middleBadge, middleHeading, middleParagraphs, middlePoints, middleImage,
    bottomCtaHeading, bottomCtaText, bottomCtaButtonText, bottomCtaButtonLink
  }) {
    const { rows } = await pool.query(
      `UPDATE feature_pages
       SET role_name = COALESCE($2, role_name),
           banner_text = COALESCE($3, banner_text),
           banner_subline = COALESCE($4, banner_subline),
           banner_color = COALESCE($5, banner_color),
           banner_image = COALESCE($6, banner_image),
           banner_overlay = COALESCE($7, banner_overlay),
           intro_heading = COALESCE($8, intro_heading),
           intro_text = COALESCE($9, intro_text),
           intro_reverse = COALESCE($10, intro_reverse),
           intro_image = COALESCE($11, intro_image),
           intro_image_label = COALESCE($12, intro_image_label),
           middle_badge = COALESCE($13, middle_badge),
           middle_heading = COALESCE($14, middle_heading),
           middle_paragraphs = COALESCE($15, middle_paragraphs),
           middle_points = COALESCE($16, middle_points),
           middle_image = COALESCE($17, middle_image),
           bottom_cta_heading = COALESCE($18, bottom_cta_heading),
           bottom_cta_text = COALESCE($19, bottom_cta_text),
           bottom_cta_button_text = COALESCE($20, bottom_cta_button_text),
           bottom_cta_button_link = COALESCE($21, bottom_cta_button_link),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [
        id, roleName, bannerText, bannerSubline, bannerColor, bannerImage, bannerOverlay,
        introHeading, introText ? JSON.stringify(introText) : null, introReverse, introImage, introImageLabel,
        middleBadge, middleHeading, middleParagraphs ? JSON.stringify(middleParagraphs) : null, middlePoints ? JSON.stringify(middlePoints) : null, middleImage,
        bottomCtaHeading, bottomCtaText, bottomCtaButtonText, bottomCtaButtonLink
      ]
    );
    return normalizeFeaturePage(rows[0]) || null;
  },

  async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM feature_pages WHERE id = $1 RETURNING *',
      [id]
    );
    return normalizeFeaturePage(rows[0]) || null;
  },
};

const FeaturePageFeature = {
  async findByPageId(pageId) {
    const { rows } = await pool.query(
      'SELECT * FROM feature_page_features WHERE feature_page_id = $1 ORDER BY display_order ASC',
      [pageId]
    );
    return rows;
  },

  async create({ featurePageId, icon, title, description, display_order, color_class }) {
    const { rows } = await pool.query(
      `INSERT INTO feature_page_features (feature_page_id, icon, title, description, display_order, color_class)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [featurePageId, icon, title, description || null, display_order || 0, color_class || null]
    );
    return rows[0];
  },

  async update(id, { icon, title, description, display_order, color_class }) {
    const { rows } = await pool.query(
      `UPDATE feature_page_features
       SET icon = COALESCE($2, icon),
           title = COALESCE($3, title),
           description = COALESCE($4, description),
           display_order = COALESCE($5, display_order),
           color_class = COALESCE($6, color_class),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, icon, title, description, display_order, color_class]
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM feature_page_features WHERE id = $1 RETURNING *',
      [id]
    );
    return rows[0] || null;
  },

  async reorder(pageId, items) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const item of items) {
        await client.query(
          'UPDATE feature_page_features SET display_order = $1, updated_at = NOW() WHERE id = $2 AND feature_page_id = $3',
          [item.display_order, item.id, pageId]
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

export { FeaturePage, FeaturePageFeature };