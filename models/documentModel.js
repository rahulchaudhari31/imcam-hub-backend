import pool from '../config/db.js';

const Document = {
  async findByCaseId(caseId, { page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM documents WHERE case_id = $1',
      [caseId]
    );
    const total = parseInt(countResult.rows[0].count, 10);
    const { rows } = await pool.query(
      `SELECT
         d.id, d.case_id, d.uploaded_by, d.document_type, d.original_file_name,
         d.stored_file_name, d.mime_type, d.file_size, d.status, d.created_at, d.updated_at,
         u.email AS uploader_email, u.full_name AS uploader_name
       FROM documents d
       LEFT JOIN users u ON d.uploaded_by = u.id
       WHERE d.case_id = $1
       ORDER BY d.created_at DESC
       LIMIT $2 OFFSET $3`,
      [caseId, limit, offset]
    );
    return { data: rows, total, page, limit };
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT
         d.id, d.case_id, d.uploaded_by, d.document_type, d.original_file_name,
         d.stored_file_name, d.mime_type, d.file_size, d.status, d.created_at, d.updated_at,
         u.email AS uploader_email, u.full_name AS uploader_name
       FROM documents d
       LEFT JOIN users u ON d.uploaded_by = u.id
       WHERE d.id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  async create({ caseId, uploadedBy, documentType, originalFileName, storedFileName, mimeType, fileSize }) {
    const { rows } = await pool.query(
      `INSERT INTO documents (case_id, uploaded_by, document_type, original_file_name, stored_file_name, mime_type, file_size)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, case_id, uploaded_by, document_type, original_file_name, stored_file_name, mime_type, file_size, status, created_at, updated_at`,
      [caseId, uploadedBy, documentType, originalFileName, storedFileName, mimeType, fileSize]
    );
    return rows[0];
  },

  async updateStatus(id, status) {
    const { rows } = await pool.query(
      `UPDATE documents
       SET status = $2, updated_at = NOW()
       WHERE id = $1
       RETURNING id, case_id, uploaded_by, document_type, original_file_name, stored_file_name, mime_type, file_size, status, created_at, updated_at`,
      [id, status]
    );
    return rows[0] || null;
  },

  async updateDocumentType(id, documentType) {
    const { rows } = await pool.query(
      `UPDATE documents
       SET document_type = $2, updated_at = NOW()
       WHERE id = $1
       RETURNING id, case_id, uploaded_by, document_type, original_file_name, stored_file_name, mime_type, file_size, status, created_at, updated_at`,
      [id, documentType]
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rows } = await pool.query(
      `DELETE FROM documents WHERE id = $1 RETURNING id, stored_file_name`,
      [id]
    );
    return rows[0] || null;
  },

  async verifyCaseExists(caseId) {
    const { rows } = await pool.query(
      'SELECT id FROM cases WHERE id = $1',
      [caseId]
    );
    return rows[0] || null;
  },
};

export default Document;