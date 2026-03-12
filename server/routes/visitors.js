import express from 'express';
import Visitor from '../models/Visitor.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Track a visit (public)
router.post('/track', async (req, res) => {
  try {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const { page = '/', referrer } = req.body;
    await Visitor.create({ ip, userAgent: req.headers['user-agent'], page, referrer });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get analytics (admin only)
router.get('/analytics', requireAuth, requireAdmin, async (req, res) => {
  try {
    const [total, today, byPage, recent] = await Promise.all([
      Visitor.countDocuments(),
      Visitor.countDocuments({ timestamp: { $gte: new Date(new Date().setHours(0,0,0,0)) } }),
      Visitor.aggregate([
        { $group: { _id: '$page', visits: { $sum: 1 } } },
        { $sort: { visits: -1 } },
        { $limit: 10 }
      ]),
      Visitor.find().sort({ timestamp: -1 }).limit(20).select('page timestamp userAgent')
    ]);
    res.json({ total, today, byPage, recent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
