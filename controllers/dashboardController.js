import pool from '../config/db.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getDashboard = asyncHandler(async (_req, res) => {
  const [totalUsers, totalDemoRequests, newRequests, contactedRequests, scheduledRequests, closedRequests, recentDemoRequests, recentUsers] = await Promise.all([
    pool.query('SELECT COUNT(*) FROM users'),
    pool.query('SELECT COUNT(*) FROM demo_requests'),
    pool.query("SELECT COUNT(*) FROM demo_requests WHERE status = 'new'"),
    pool.query("SELECT COUNT(*) FROM demo_requests WHERE status = 'contacted'"),
    pool.query("SELECT COUNT(*) FROM demo_requests WHERE status = 'scheduled'"),
    pool.query("SELECT COUNT(*) FROM demo_requests WHERE status = 'closed'"),
    pool.query(
      `SELECT id, company, full_name, email, phone, firm_size, status, created_at
       FROM demo_requests ORDER BY created_at DESC LIMIT 5`
    ),
    pool.query(
      `SELECT id, email, full_name, role, created_at
       FROM users ORDER BY created_at DESC LIMIT 5`
    ),
  ]);

  res.json({
    data: {
      stats: {
        totalUsers: parseInt(totalUsers.rows[0].count, 10),
        totalDemoRequests: parseInt(totalDemoRequests.rows[0].count, 10),
        newRequests: parseInt(newRequests.rows[0].count, 10),
        contactedRequests: parseInt(contactedRequests.rows[0].count, 10),
        scheduledRequests: parseInt(scheduledRequests.rows[0].count, 10),
        closedRequests: parseInt(closedRequests.rows[0].count, 10),
      },
      recentDemoRequests: recentDemoRequests.rows,
      recentUsers: recentUsers.rows,
    },
  });
});
