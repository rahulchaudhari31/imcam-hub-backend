require('dotenv').config();
const { Client } = require('pg');
(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL });
  await c.connect();
  const r = await c.query(
    "UPDATE pricing_plans SET cta_text = 'Book a Demo' WHERE name = 'Starter' RETURNING id, name, cta_text"
  );
  console.log(JSON.stringify(r.rows[0]));
  await c.end();
})().catch((e) => { console.error(e); process.exit(1); });