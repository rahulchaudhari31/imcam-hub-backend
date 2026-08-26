import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import demoRequestRoutes from './routes/demoRequestRoutes.js';
import caseRoutes from './routes/caseRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import websiteSettingsRoutes from './routes/websiteSettingsRoutes.js';
import homeContentRoutes from './routes/homeContentRoutes.js';
import aboutContentRoutes from './routes/aboutContentRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import contactInfoRoutes from './routes/contactInfoRoutes.js';
import socialLinkRoutes from './routes/socialLinkRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import seoSettingsRoutes from './routes/seoSettingsRoutes.js';
import adminUserRoutes from './routes/adminUserRoutes.js';
import caseworkerRoutes from './routes/caseworkerRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import { testConnection } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// --- CORS ---
const isDev = process.env.NODE_ENV !== 'production';

const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((u) => u.trim().replace(/\/+$/, ''))
  .filter(Boolean);

if (isDev) {
  const devDefaults = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
    'http://127.0.0.1:5176',
    'http://127.0.0.1:3000',
  ];
  for (const o of devDefaults) {
    if (!allowedOrigins.includes(o)) allowedOrigins.push(o);
  }
}

console.log('CORS allowed origins:', allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: "${origin}"`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// --- Body parsing ---
app.use(express.json({ limit: '10mb' }));

// Handle JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON format.' });
  }
  next(err);
});

// --- Static files ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Health check ---
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/demo-requests', demoRequestRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api', documentRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/caseworker', caseworkerRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/cms/settings', websiteSettingsRoutes);
app.use('/api/cms/home', homeContentRoutes);
app.use('/api/cms/about', aboutContentRoutes);
app.use('/api/cms/services', serviceRoutes);
app.use('/api/cms/faqs', faqRoutes);
app.use('/api/cms/testimonials', testimonialRoutes);
app.use('/api/cms/contact', contactInfoRoutes);
app.use('/api/cms/social-links', socialLinkRoutes);
app.use('/api/cms/media', mediaRoutes);
app.use('/api/cms/seo', seoSettingsRoutes);

// --- 404 catch-all ---
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// --- Error handler ---
app.use(errorHandler);

// --- Start server with DB check ---
const start = async () => {
  const dbOk = await testConnection();
  if (!dbOk) {
    console.error('Cannot start server — database is unreachable.');
    process.exit(1);
  }
  app.listen(PORT, () => {
    console.log(`ImCam Hub API running on port ${PORT}`);
  });
};

start();
