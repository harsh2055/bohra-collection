// Firebase Admin Auth Middleware
// This verifies Firebase ID tokens sent from the frontend

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'admin@bohracollection.com').split(',');

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    // If firebase-admin is configured, verify token
    try {
      const { admin } = await import('../services/firebaseAdmin.js');
      const decoded = await admin.auth().verifyIdToken(token);
      req.user = decoded;
      next();
    } catch {
      // For development without Firebase Admin, basic check
      if (token === process.env.ADMIN_SECRET_TOKEN) {
        req.user = { email: ADMIN_EMAILS[0], admin: true };
        return next();
      }
      res.status(401).json({ error: 'Invalid token' });
    }
  } catch (err) {
    res.status(401).json({ error: 'Auth failed' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (!ADMIN_EMAILS.includes(req.user.email)) {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
};
