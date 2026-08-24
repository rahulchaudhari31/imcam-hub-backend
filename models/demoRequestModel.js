import pool from '../config/db.js';

const DemoRequest = {
  async create({ company, fullName, email, phone, firmSize, message }) {
    const { rows } = await pool.query(
      `INSERT INTO demo_requests (company, full_name, email, phone, firm_size, message)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, company, full_name, email, phone, firm_size, message, status, created_at`,
      [company, fullName, email, phone || null, firmSize, message || null]
    );
    return rows[0];
  },

  async findByEmail(email) {
    const { rows } = await pool.query(
      `SELECT id FROM demo_requests WHERE email = $1 LIMIT 1`,
      [email]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT id, company, full_name, email, phone, firm_size, message, status, created_at
       FROM demo_requests WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  async findAll({ page = 1, limit = 20, status } = {}) {
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];
    let paramIdx = 1;

    if (status) {
      conditions.push(`status = $${paramIdx++}`);
      params.push(status);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM demo_requests ${where}`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    params.push(limit, offset);
    const { rows } = await pool.query(
      `SELECT id, company, full_name, email, phone, firm_size, message, status, created_at
       FROM demo_requests ${where}
       ORDER BY created_at DESC
       LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
      params
    );

    return { data: rows, total, page, limit };
  },

  async updateStatus(id, status) {
    const { rows } = await pool.query(
      `UPDATE demo_requests SET status = $2 WHERE id = $1
       RETURNING id, company, full_name, email, phone, firm_size, message, status, created_at`,
      [id, status]
    );
    return rows[0] || null;
  },
};

export default DemoRequest;
