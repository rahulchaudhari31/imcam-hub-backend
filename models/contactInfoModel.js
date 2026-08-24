import pool from '../config/db.js';

const ContactInfo = {
  async find() {
    const { rows } = await pool.query(
      'SELECT * FROM contact_information ORDER BY id LIMIT 1'
    );
    return rows[0] || null;
  },

  async update({ email, phone, address, business_hours, content }) {
    const existing = await this.find();
    if (existing) {
      const { rows } = await pool.query(
        `UPDATE contact_information
         SET email = COALESCE($2, email),
             phone = COALESCE($3, phone),
             address = COALESCE($4, address),
             business_hours = COALESCE($5, business_hours),
             content = COALESCE($6, content),
             updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [existing.id, email, phone, address, business_hours, content ? JSON.stringify(content) : null]
      );
      return rows[0];
    } else {
      const { rows } = await pool.query(
        `INSERT INTO contact_information (email, phone, address, business_hours, content)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [email, phone, address, business_hours, content ? JSON.stringify(content) : null]
      );
      return rows[0];
    }
  },
};

export default ContactInfo;
