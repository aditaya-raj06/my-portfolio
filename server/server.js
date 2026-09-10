import app from './app.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..');

const PORT = process.env.PORT || 3001;

// Serve Static Frontend Assets for local dev
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
