import pool from '../config/db.js';

const User = {
  async create({ email, password, fullName, role }) {
    const { rows } = await pool.query(
      `INSERT INTO users (email, password, fullname, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, fullname, role, created_at`,
      [email, password, fullName, role]
    );
    return rows[0];
  },

  async findByEmail(email) {
    const { rows } = await pool.query(
      `SELECT id, email, password, fullname, role, created_at
       FROM users WHERE email = $1`,
      [email]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT id, email, fullname, role, created_at
       FROM users WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  },
};

export default User;
