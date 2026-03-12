// Real-time analytics service using Firestore
import { db } from './firebase.js';
import {
  doc, collection, increment, setDoc, updateDoc,
  getDoc, getDocs, query, orderBy, limit,
  serverTimestamp, addDoc, where, Timestamp
} from 'firebase/firestore';

const isFirestoreAvailable = async () => {
  try { await getDoc(doc(db, '_ping', 'test')); return true; }
  catch { return true; } // assume available, errors handled per call
};

// ── Track a page visit ────────────────────────────────────────
export const trackVisit = async (page) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // "2026-03-12"
    const sessionKey = 'bohra_visited_' + today;

    // Only count once per session per day
    const alreadyCounted = sessionStorage.getItem(sessionKey);

    // Always log individual page hit
    await addDoc(collection(db, 'pageHits'), {
      page,
      timestamp: serverTimestamp(),
      date: today,
    });

    // Increment unique daily visitor count only once per session
    if (!alreadyCounted) {
      sessionStorage.setItem(sessionKey, '1');
      const visitorRef = doc(db, 'analytics', 'visitors');
      await setDoc(visitorRef, {
        total: increment(1),
        [`daily.${today}`]: increment(1),
        lastUpdated: serverTimestamp(),
      }, { merge: true });
    }

    // Page-specific counter
    const pageKey = page.replace(/\//g, '_').replace(/^_/, '') || 'home';
    const pageRef = doc(db, 'analytics', 'pages');
    await setDoc(pageRef, {
      [pageKey]: increment(1),
      lastUpdated: serverTimestamp(),
    }, { merge: true });

  } catch (e) {
    console.warn('Analytics tracking failed (non-critical):', e.message);
  }
};

// ── Track product view ────────────────────────────────────────
export const trackProductView = async (productId, productName, category) => {
  try {
    const productRef = doc(db, 'analytics', 'productViews');
    await setDoc(productRef, {
      [`${productId}.views`]: increment(1),
      [`${productId}.name`]: productName,
      [`${productId}.category`]: category,
      lastUpdated: serverTimestamp(),
    }, { merge: true });
  } catch (e) {
    console.warn('Product view tracking failed:', e.message);
  }
};

// ── Fetch all analytics for admin dashboard ───────────────────
export const fetchAnalytics = async () => {
  try {
    const [visitorSnap, pageSnap, productViewSnap, pageHitsSnap] = await Promise.all([
      getDoc(doc(db, 'analytics', 'visitors')),
      getDoc(doc(db, 'analytics', 'pages')),
      getDoc(doc(db, 'analytics', 'productViews')),
      getDocs(query(collection(db, 'pageHits'), orderBy('timestamp', 'desc'), limit(200))),
    ]);

    const visitors = visitorSnap.exists() ? visitorSnap.data() : {};
    const pages    = pageSnap.exists()    ? pageSnap.data()    : {};
    const pvData   = productViewSnap.exists() ? productViewSnap.data() : {};

    // Build daily visitors chart (last 14 days)
    const today = new Date();
    const dailyChart = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      dailyChart.push({
        date: key,
        label: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        visitors: visitors.daily?.[key] || 0,
      });
    }

    // Today's visitor count
    const todayKey = today.toISOString().split('T')[0];
    const todayCount = visitors.daily?.[todayKey] || 0;

    // Page hits from last 200 records
    const pageHits = {};
    pageHitsSnap.docs.forEach(d => {
      const pg = d.data().page || '/';
      pageHits[pg] = (pageHits[pg] || 0) + 1;
    });

    // Top pages
    const topPages = Object.entries(pageHits)
      .map(([page, hits]) => ({ page, hits }))
      .sort((a, b) => b.hits - a.hits)
      .slice(0, 8);

    // Product views
    const productViews = Object.entries(pvData)
      .filter(([k]) => k !== 'lastUpdated')
      .map(([id, data]) => ({
        id,
        name: data.name || id,
        category: data.category || '',
        views: data.views || 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    return {
      totalVisitors: visitors.total || 0,
      todayVisitors: todayCount,
      dailyChart,
      topPages,
      productViews,
      pageBreakdown: pages,
    };
  } catch (e) {
    console.error('Failed to fetch analytics:', e);
    return {
      totalVisitors: 0, todayVisitors: 0,
      dailyChart: [], topPages: [], productViews: [], pageBreakdown: {},
    };
  }
};