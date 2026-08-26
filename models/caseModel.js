import pool from '../config/db.js';

const Case = {
  async create({ clientId, caseworkerId, caseType, priority, title, description, status }) {
    const { rows } = await pool.query(
      `INSERT INTO cases (client_id, caseworker_id, case_type, priority, title, description, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, case_number, client_id, caseworker_id, case_type, status, priority, title, description, created_at, updated_at`,
      [clientId, caseworkerId || null, caseType, priority || 'medium', title, description || null, status || 'pending']
    );
    return rows[0];
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT
         c.id, c.case_number, c.client_id, c.caseworker_id, c.case_type, c.status, c.priority, c.title, c.description, c.created_at, c.updated_at,
         u_client.email AS client_email, u_client.full_name AS client_name, u_client.role AS client_role,
         u_cw.email AS caseworker_email, u_cw.full_name AS caseworker_name, u_cw.role AS caseworker_role
       FROM cases c
       LEFT JOIN users u_client ON c.client_id = u_client.id
       LEFT JOIN users u_cw ON c.caseworker_id = u_cw.id
       WHERE c.id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  async findByCaseNumber(caseNumber) {
    const { rows } = await pool.query(
      `SELECT
         c.id, c.case_number, c.client_id, c.caseworker_id, c.case_type, c.status, c.priority, c.title, c.description, c.created_at, c.updated_at,
         u_client.email AS client_email, u_client.full_name AS client_name,
         u_cw.email AS caseworker_email, u_cw.full_name AS caseworker_name
       FROM cases c
       LEFT JOIN users u_client ON c.client_id = u_client.id
       LEFT JOIN users u_cw ON c.caseworker_id = u_cw.id
       WHERE c.case_number = $1`,
      [caseNumber]
    );
    return rows[0] || null;
  },

  async findAll({ page = 1, limit = 20, status, caseType, priority, search } = {}) {
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];
    let paramIdx = 1;

    if (status) {
      conditions.push(`c.status = $${paramIdx++}`);
      params.push(status);
    }
    if (caseType) {
      conditions.push(`c.case_type = $${paramIdx++}`);
      params.push(caseType);
    }
    if (priority) {
      conditions.push(`c.priority = $${paramIdx++}`);
      params.push(priority);
    }
    if (search) {
      conditions.push(`(c.case_number ILIKE $${paramIdx} OR c.title ILIKE $${paramIdx} OR u_client.full_name ILIKE $${paramIdx} OR u_client.email ILIKE $${paramIdx})`);
      params.push(`%${search}%`);
      paramIdx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM cases c
       LEFT JOIN users u_client ON c.client_id = u_client.id ${where}`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    params.push(limit, offset);
    const { rows } = await pool.query(
      `SELECT
         c.id, c.case_number, c.client_id, c.caseworker_id, c.case_type, c.status, c.priority, c.title, c.description, c.created_at, c.updated_at,
         u_client.email AS client_email, u_client.full_name AS client_name,
         u_cw.email AS caseworker_email, u_cw.full_name AS caseworker_name
       FROM cases c
       LEFT JOIN users u_client ON c.client_id = u_client.id
       LEFT JOIN users u_cw ON c.caseworker_id = u_cw.id ${where}
       ORDER BY c.created_at DESC
       LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
      params
    );

    return { data: rows, total, page, limit };
  },

  async update(id, { caseworkerId, status, priority, caseType, title, description }) {
    const { rows } = await pool.query(
      `UPDATE cases
       SET caseworker_id = COALESCE($2, caseworker_id),
           status = COALESCE($3, status),
           priority = COALESCE($4, priority),
           case_type = COALESCE($5, case_type),
           title = COALESCE($6, title),
           description = COALESCE($7, description),
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, case_number, client_id, caseworker_id, case_type, status, priority, title, description, created_at, updated_at`,
      [id, caseworkerId, status, priority, caseType, title, description]
    );
    return rows[0] || null;
  },

  async verifyClient(clientId) {
    const { rows } = await pool.query(
      `SELECT id, role FROM users WHERE id = $1`,
      [clientId]
    );
    return rows[0] || null;
  },

  async verifyCaseworker(caseworkerId) {
    const { rows } = await pool.query(
      `SELECT id, role FROM users WHERE id = $1`,
      [caseworkerId]
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rows } = await pool.query(
      `DELETE FROM cases WHERE id = $1 RETURNING id`,
      [id]
    );
    return rows[0] || null;
  },

  async getClients() {
    const { rows } = await pool.query(
      `SELECT id, full_name, email FROM users WHERE role = 'client' ORDER BY full_name`
    );
    return rows;
  },

  async getCaseworkers() {
    const { rows } = await pool.query(
      `SELECT id, full_name, email FROM users WHERE role = 'caseworker' ORDER BY full_name`
    );
    return rows;
  },
};

export default Case;