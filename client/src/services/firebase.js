import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const raw = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Strip accidental surrounding quotes from any value (common .env mistake)
const strip = (v) => (typeof v === 'string' ? v.replace(/^["']|["']$/g, '').trim() : v);
const firebaseConfig = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, strip(v)]));

// Dev-mode config check
if (import.meta.env.DEV) {
  console.group('🔥 Firebase Config Check');
  Object.entries(firebaseConfig).forEach(([k, v]) => {
    if (!v || v.includes('YOUR_') || v === 'undefined') {
      console.warn(`  ❌ ${k}: MISSING or placeholder`);
    } else {
      console.log(`  ✅ ${k}: ${v.substring(0, 20)}...`);
    }
  });
  console.groupEnd();
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
export const db = getFirestore(app);
export default app;
