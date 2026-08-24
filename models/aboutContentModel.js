import pool from '../config/db.js';

const AboutContent = {
  async find() {
    const { rows } = await pool.query(
      'SELECT * FROM about_content ORDER BY id LIMIT 1'
    );
    return rows[0] || null;
  },

  async update({ heading, description, mission, vision, values, imageUrl, content }) {
    const existing = await this.find();
    if (existing) {
      const { rows } = await pool.query(
        `UPDATE about_content
         SET heading = COALESCE($2, heading),
             description = COALESCE($3, description),
             mission = COALESCE($4, mission),
             vision = COALESCE($5, vision),
             values = COALESCE($6, values),
             image_url = COALESCE($7, image_url),
             content = COALESCE($8, content),
             updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [existing.id, heading, description, mission, vision, values ? JSON.stringify(values) : null, imageUrl, content ? JSON.stringify(content) : null]
      );
      return rows[0];
    } else {
      const { rows } = await pool.query(
        `INSERT INTO about_content (heading, description, mission, vision, values, image_url, content)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [heading, description, mission, vision, values ? JSON.stringify(values) : null, imageUrl, content ? JSON.stringify(content) : null]
      );
      return rows[0];
    }
  },
};

export default AboutContent;
