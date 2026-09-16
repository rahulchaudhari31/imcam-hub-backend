import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = process.env.TEST_PORT || 5005;
const BASE = `http://localhost:${PORT}`;

let server;
let started = false;

async function waitForServer(retries = 40) {
  for (let i = 0; i < retries; i += 1) {
    try {
      const res = await fetch(`${BASE}/api/health`);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('Server did not start in time');
}

before(async () => {
  server = spawn(process.execPath, ['server.js'], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(PORT), NODE_ENV: 'test' },
    stdio: 'ignore',
  });
  await waitForServer();
  started = true;
});

after(() => {
  if (server) server.kill();
});

async function get(pathname) {
  return fetch(`${BASE}${pathname}`);
}

test('health endpoint responds OK', async () => {
  const res = await get('/api/health');
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, 'ok');
});

test('unknown routes return 404 with { message }', async () => {
  const res = await get('/api/does-not-exist');
  assert.equal(res.status, 404);
  const body = await res.json();
  assert.equal(typeof body.message, 'string');
});

test('invalid JSON body returns 400', async () => {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{not json',
  });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.message, 'Invalid JSON format.');
});

test('CMS: home content returns data payload', async () => {
  const res = await get('/api/cms/home');
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(body.data);
});

test('CMS: services returns list', async () => {
  const res = await get('/api/cms/services?active=true');
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(Array.isArray(body.data) && body.data.length > 0);
});

test('CMS: FAQs filter by page_key=global', async () => {
  const res = await get('/api/cms/faqs?active=true&page_key=global');
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(Array.isArray(body.data));
  for (const faq of body.data) assert.equal(faq.page_key, 'global');
});

test('CMS: pricing returns plans and comparison', async () => {
  const res = await get('/api/cms/pricing?active=true');
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(Array.isArray(body.data.plans) && body.data.plans.length >= 3);
  assert.ok(Array.isArray(body.data.comparison));
});

test('CMS: feature page by key returns features', async () => {
  const res = await get('/api/cms/features/page/admin');
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.data.page_key, 'admin');
  assert.ok(Array.isArray(body.data.features) && body.data.features.length >= 6);
});

test('CMS: solutions returns sections', async () => {
  const res = await get('/api/cms/solutions?active=true');
  assert.equal(res.status, 200);
  const body = await res.json();
  const keys = body.data.map((s) => s.section_key);
  for (const expected of ['hero', 'stats', 'challenges', 'solutions', 'how_it_works', 'cta']) {
    assert.ok(keys.includes(expected), `missing section ${expected}`);
  }
});

test('CMS: book demo returns config with steps', async () => {
  const res = await get('/api/cms/book-demo');
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(body.data.hero_title);
  assert.ok(Array.isArray(body.data.steps) && body.data.steps.length >= 3);
});

test('CMS: navigation returns nav items', async () => {
  const res = await get('/api/cms/navigation?active=true');
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(Array.isArray(body.data) && body.data.length >= 4);
});

test('CMS: footer links return items', async () => {
  const res = await get('/api/cms/footer-links?active=true');
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(Array.isArray(body.data) && body.data.length >= 5);
});

test('CMS: SEO settings for solutions page', async () => {
  const res = await get('/api/cms/seo/solutions');
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.data.page_key, 'solutions');
  assert.equal(typeof body.data.page_title, 'string');
});

test('auth: login with invalid credentials returns 401', async () => {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'nobody@incamhub.test', password: 'wrongpass' }),
  });
  assert.equal(res.status, 401);
  const body = await res.json();
  assert.equal(typeof body.message, 'string');
});

test('auth: register with missing fields returns 400', async () => {
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'badpayload@incamhub.test' }),
  });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(typeof body.message, 'string');
});

test('auth: /me without token returns 401', async () => {
  const res = await get('/api/auth/me');
  assert.equal(res.status, 401);
  const body = await res.json();
  assert.equal(typeof body.message, 'string');
});

if (started) {
  // empty block to keep node:test happy when server never boots
}