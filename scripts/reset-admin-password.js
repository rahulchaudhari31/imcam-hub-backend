#!/usr/bin/env node
/**
 * Safe admin password reset script.
 * 
 * Usage:
 *   node scripts/reset-admin-password.js              (uses default "admin123")
 *   node scripts/reset-admin-password.js MyNewPass123
 * 
 * This script:
 *   - Reads DATABASE_URL from .env
 *   - Finds admin@test.com in the users table
 *   - Hashes the new password with bcryptjs (salt 12)
 *   - Updates password_hash
 *   - Does NOT create users, does NOT drop tables, does NOT touch other data
 */

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import pg from 'pg';

const NEW_PASSWORD = process.argv[2] || 'admin123';
const TARGET_EMAIL = 'admin@test.com';

async function resetPassword() {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Check user exists
    const { rows: users } = await pool.query(
      'SELECT id, email, role FROM users WHERE email = $1',
      [TARGET_EMAIL]
    );

    if (users.length === 0) {
      console.error(`ERROR: No user found with email "${TARGET_EMAIL}".`);
      console.error('Cannot reset password for a non-existent user.');
      process.exit(1);
    }

    const user = users[0];
    console.log(`Found user: ${user.email} (role: ${user.role}, id: ${user.id})`);

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(NEW_PASSWORD, salt);

    // Update password_hash only (no updated_at - column doesn't exist in this schema)
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2',
      [passwordHash, TARGET_EMAIL]
    );

    // Verify the update
    const { rows: verify } = await pool.query(
      'SELECT email, role FROM users WHERE email = $1',
      [TARGET_EMAIL]
    );

    console.log('');
    console.log('========================================');
    console.log('  PASSWORD RESET SUCCESSFUL');
    console.log('========================================');
    console.log(`  Email:    ${TARGET_EMAIL}`);
    console.log(`  Role:     ${user.role}`);
    console.log('========================================');
    console.log('');
    console.log('You can now log in to the Admin Panel at:');
    console.log('  URL:      http://localhost:5174/login');
    console.log(`  Email:    ${TARGET_EMAIL}`);
    console.log(`  Password: ${NEW_PASSWORD}`);
    console.log('');
    console.log('NOTE: This script is for development only.');
    console.log('      Delete or secure this script before production.');
    console.log('========================================');

  } catch (err) {
    console.error('Password reset failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

resetPassword();
