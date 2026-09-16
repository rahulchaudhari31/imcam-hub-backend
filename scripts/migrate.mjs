import 'dotenv/config';
import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

const MIGRATIONS_DIR = path.join(process.cwd(), 'migrations');
const isSeedFile = (name) => /_seed\.sql$/i.test(name);

async function listSqlFiles() {
  const names = await fs.promises.readdir(MIGRATIONS_DIR);
  return names.filter((name) => name.endsWith('.sql')).sort();
}

async function ensureTracker(client) {
  await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    name        TEXT PRIMARY KEY,
    applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
}

async function applyFile(client, filename) {
  const sql = await fs.promises.readFile(path.join(MIGRATIONS_DIR, filename), 'utf8');
  await client.query('BEGIN');
  try {
    await client.query(sql);
    await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [filename]);
    await client.query('COMMIT');
    console.log(`applied  ${filename}`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`failed   ${filename}: ${err.message}`);
    throw err;
  }
}

async function main() {
  const [,, flag] = process.argv;
  const mode = flag === '--seed' ? 'seed' : flag === '--all' ? 'all' : 'migrate';

  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  try {
    await ensureTracker(client);
    const files = await listSqlFiles();
    const migrationFiles = files.filter((name) => !isSeedFile(name));
    const seedFiles = files.filter(isSeedFile);
    const targets = mode === 'seed' ? seedFiles : mode === 'all' ? files : migrationFiles;

    const { rows } = await client.query('SELECT name FROM schema_migrations');
    const applied = new Set(rows.map((row) => row.name));

    let appliedCount = 0;
    for (const file of targets) {
      if (applied.has(file)) {
        console.log(`skipped  ${file}`);
        continue;
      }
      await applyFile(client, file);
      appliedCount += 1;
    }
    console.log(`\n${mode}: ${appliedCount} new, ${targets.length - appliedCount} already applied`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('Migration run aborted:', err.message || err);
  process.exit(1);
});