import pool from '../config/db.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllUsers = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const role = req.query.role;
  const search = req.query.search;
  const offset = (page - 1) * limit;

  const conditions = [];
  const params = [];
  let paramIdx = 1;

  if (role) {
    conditions.push(`role = $${paramIdx++}`);
    params.push(role);
  }
  if (search) {
    conditions.push(`(full_name ILIKE $${paramIdx} OR email ILIKE $${paramIdx})`);
    params.push(`%${search}%`);
    paramIdx++;
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await pool.query(`SELECT COUNT(*) FROM users ${where}`, params);
  const total = parseInt(countResult.rows[0].count, 10);

  params.push(limit, offset);
  const { rows } = await pool.query(
    `SELECT id, email, full_name, role, created_at
     FROM users ${where}
     ORDER BY created_at DESC
     LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
    params
  );

  res.json({
    data: rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const getUser = asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, email, full_name, role, created_at FROM users WHERE id = $1',
    [req.params.id]
  );
  if (!rows[0]) {
    return res.status(404).json({ message: 'User not found.' });
  }
  res.json({ data: rows[0] });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { fullName, email, role } = req.body;
  const { id } = req.params;

  const { rows: existing } = await pool.query('SELECT id, role FROM users WHERE id = $1', [id]);
  if (!existing[0]) {
    return res.status(404).json({ message: 'User not found.' });
  }

  if (role && role !== existing[0].role) {
    const { rows: adminCount } = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role = 'admin'"
    );
    if (existing[0].role === 'admin' && parseInt(adminCount.rows[0].count, 10) <= 1) {
      return res.status(400).json({ message: 'Cannot change the role of the last admin account.' });
    }
  }

  const { rows } = await pool.query(
    `UPDATE users
     SET full_name = COALESCE($2, full_name),
         email = COALESCE($3, email),
         role = COALESCE($4, role)
     WHERE id = $1
     RETURNING id, email, full_name, role, created_at`,
    [id, fullName, email, role]
  );
  res.json({ data: rows[0] });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rows: existing } = await pool.query('SELECT id, role FROM users WHERE id = $1', [id]);
  if (!existing[0]) {
    return res.status(404).json({ message: 'User not found.' });
  }
  if (existing[0].role === 'admin') {
    const { rows: adminCount } = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role = 'admin'"
    );
    if (parseInt(adminCount.rows[0].count, 10) <= 1) {
      return res.status(400).json({ message: 'Cannot delete the last admin account.' });
    }
  }
  if (req.user && String(req.user.id) === String(id)) {
    return res.status(400).json({ message: 'Cannot delete your own account.' });
  }
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
  res.json({ message: 'User deleted successfully.' });
});
