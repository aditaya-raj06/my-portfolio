import express from 'express';
import { invalidateAndSync } from '../services/githubSync.js';

const router = express.Router();

/**
 * POST /api/webhook/github
 * GitHub Webhook listener for push, repository, release, and delete events
 */
router.post('/github', async (req, res) => {
  const event = req.headers['x-github-event'] || 'unknown';
  const payload = req.body;

  console.log(`[Webhook] Received GitHub event: '${event}' for repo: '${payload?.repository?.name || 'unknown'}'`);

  // Handle relevant events (push, repository created/deleted/edited)
  const syncEvents = ['push', 'repository', 'create', 'delete', 'public', 'release'];

  if (syncEvents.includes(event)) {
    try {
      console.log(`[Webhook] Triggering instant portfolio re-sync for event '${event}'...`);
      const updated = await invalidateAndSync();
      console.log(`[Webhook] Re-sync complete. Live projects count: ${updated.projects.length}`);

      return res.json({
        success: true,
        event,
        message: 'Portfolio data updated in real-time!',
        projectsCount: updated.projects.length
      });
    } catch (err) {
      console.error('[Webhook] Error during sync:', err.message);
      return res.status(500).json({
        success: false,
        error: 'Failed to re-sync portfolio on webhook event'
      });
    }
  }

  res.json({
    success: true,
    message: `Event '${event}' received. No sync required.`
  });
});

export default router;
