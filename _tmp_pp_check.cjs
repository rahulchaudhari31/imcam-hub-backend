require('dotenv').config();
const { Client } = require('pg');
(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL });
  await c.connect();
  const r = await c.query(
    "SELECT id, name, description, interval_label, billing_label, monthly_price, annual_price, cta_text, popular FROM pricing_plans ORDER BY display_order"
  );
  r.rows.forEach((p) => console.log(JSON.stringify(p)));
  await c.end();
})().catch((e) => { console.error(e); process.exit(1); });