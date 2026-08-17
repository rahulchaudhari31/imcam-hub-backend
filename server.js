import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import demoRequestRoutes from './routes/demoRequestRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import { testConnection } from './config/db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// --- CORS ---
const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((u) => u.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// --- Body parsing ---
app.use(express.json());

// --- Health check ---
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/demo-requests', demoRequestRoutes);

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
