import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchLiveGitHubData, invalidateAndSync } from '../services/githubSync.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const messagesFile = path.join(__dirname, '../data/messages.json');
const metaFile = path.join(__dirname, '../data/custom-meta.json');

// Simple in-memory analytics store
let visitorCount = 142;
const startTime = Date.now();

/**
 * Helper to read JSON file safely
 */
function readJson(filePath, defaultValue = []) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) {
    console.error(`[API] Error reading ${filePath}:`, e.message);
  }
  return defaultValue;
}

/**
 * Helper to write JSON file safely
 */
function writeJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error(`[API] Error writing ${filePath}:`, e.message);
    return false;
  }
}

// ----------------------------------------------------------------------------
// 1. GET /api/portfolio - Returns Live Projects & Profile from GitHub
// ----------------------------------------------------------------------------
router.get('/portfolio', async (req, res) => {
  try {
    const liveData = await fetchLiveGitHubData();
    res.json({
      success: true,
      data: liveData
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch live portfolio data',
      message: err.message
    });
  }
});

// ----------------------------------------------------------------------------
// 2. POST /api/contact - Handles contact inquiries & message storage
// ----------------------------------------------------------------------------
router.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: name, email, and message are required.'
    });
  }

  // Basic email pattern check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email address provided.'
    });
  }

  const newMessage = {
    id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    name: name.trim(),
    email: email.trim(),
    subject: (subject || 'General Inquiry').trim(),
    message: message.trim(),
    receivedAt: new Date().toISOString(),
    ip: req.ip || req.headers['x-forwarded-for'] || 'unknown'
  };

  const messages = readJson(messagesFile, []);
  messages.unshift(newMessage);
  writeJson(messagesFile, messages);

  console.log(`[Contact API] Received new message from ${newMessage.name} <${newMessage.email}>: "${newMessage.subject}"`);

  res.status(201).json({
    success: true,
    message: 'Your message has been delivered to Aditaya Raj! Thank you for reaching out.',
    id: newMessage.id
  });
});

// ----------------------------------------------------------------------------
// 3. GET /api/analytics - Live presence and visitor counter
// ----------------------------------------------------------------------------
router.get('/analytics', (req, res) => {
  visitorCount++;
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  res.json({
    success: true,
    data: {
      visitorCount,
      uptimeSeconds,
      status: 'healthy',
      serverTime: new Date().toISOString()
    }
  });
});

// ----------------------------------------------------------------------------
// 4. POST /api/sync/refresh - Triggers immediate cache invalidation & re-sync
// ----------------------------------------------------------------------------
router.post('/sync/refresh', async (req, res) => {
  try {
    const freshData = await invalidateAndSync();
    res.json({
      success: true,
      message: 'Portfolio data successfully refreshed from GitHub!',
      syncedAt: freshData.syncedAt,
      projectsCount: freshData.projects.length
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to re-sync data',
      message: err.message
    });
  }
});

// ----------------------------------------------------------------------------
// 5. POST /api/sync/profile - Updates custom metadata / highlights
// ----------------------------------------------------------------------------
router.post('/sync/profile', (req, res) => {
  const { authKey, metadata } = req.body;
  const adminSecret = process.env.ADMIN_SECRET || 'aditaya-dev-key';

  if (authKey !== adminSecret) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid authentication key provided.'
    });
  }

  if (!metadata || typeof metadata !== 'object') {
    return res.status(400).json({
      success: false,
      error: 'Invalid metadata payload provided.'
    });
  }

  const currentMeta = readJson(metaFile, {});
  const updatedMeta = { ...currentMeta, ...metadata };
  writeJson(metaFile, updatedMeta);

  // Invalidate cache so changes reflect immediately
  invalidateAndSync().catch(console.error);

  res.json({
    success: true,
    message: 'Profile metadata updated successfully!'
  });
});

export default router;
