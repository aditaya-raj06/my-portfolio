import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import apiRoutes from './routes/api.js';
import webhookRoutes from './routes/webhook.js';
import geetRoutes from './routes/geet.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 3001;

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api')) {
      console.log(`[HTTP] ${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
    }
  });
  next();
});

// API Routes
app.use('/api', apiRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/geet', geetRoutes);

// Health Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Serve Static Frontend Assets
app.use(express.static(publicDir));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 Aditaya Raj Portfolio Backend running on port ${PORT}`);
  console.log(`🌐 Web App:         http://localhost:${PORT}`);
  console.log(`📡 Live Data API:   http://localhost:${PORT}/api/portfolio`);
  console.log(`📬 Contact API:     http://localhost:${PORT}/api/contact`);
  console.log(`⚡ GitHub Webhook:  http://localhost:${PORT}/api/webhook/github`);
  console.log('====================================================');
});
