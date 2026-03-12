import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const ADMIN_EMAIL    = 'admin@bohracollection.com';
const ADMIN_PASSWORD = 'Admin@786';
const USER_KEY       = 'bohra_current_user';
const USERS_DB_KEY   = 'bohra_users_db';
export const ADMIN_EMAILS = [ADMIN_EMAIL];

const getLocalUsers = () => {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '{}');
    if (!users[ADMIN_EMAIL]) {
      users[ADMIN_EMAIL] = { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, displayName: 'Admin', uid: 'admin-786' };
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    }
    return users;
  } catch { return {}; }
};
const saveLocalUsers = (u) => { try { localStorage.setItem(USERS_DB_KEY, JSON.stringify(u)); } catch {} };
const getPersistedUser = () => { try { const r = localStorage.getItem(USER_KEY); return r ? JSON.parse(r) : null; } catch { return null; } };
const persistUser = (u) => { try { u ? localStorage.setItem(USER_KEY, JSON.stringify(u)) : localStorage.removeItem(USER_KEY); } catch {} };

const doLocalLogin = async (email, password) => {
  const users = getLocalUsers();
  const found = users[email.toLowerCase().trim()];
  if (!found) throw { code: 'auth/user-not-found' };
  if (found.password !== password) throw { code: 'auth/wrong-password' };
  return { email: found.email, displayName: found.displayName, uid: found.uid, isLocal: true };
};

const doLocalSignup = async (email, password, name) => {
  const users = getLocalUsers();
  const key = email.toLowerCase().trim();
  if (users[key]) throw { code: 'auth/email-already-in-use' };
  if (password.length < 6) throw { code: 'auth/weak-password' };
  const u = { email: key, password, displayName: name, uid: 'local-' + Date.now() };
  users[key] = u; saveLocalUsers(users);
  return { email: u.email, displayName: u.displayName, uid: u.uid, isLocal: true };
};

let _auth = null, _google = null, _fbChecked = false, _fbOk = false;

const initFirebase = async () => {
  if (_fbChecked) return _fbOk;
  _fbChecked = true;
  try {
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY?.replace(/^["']|["']$/g, '').trim();
    if (!apiKey || apiKey.startsWith('YOUR') || apiKey === 'undefined') return (_fbOk = false);
    const fb = await import('../services/firebase.js');
    _auth = fb.auth; _google = fb.googleProvider;
    return (_fbOk = true);
  } catch { return (_fbOk = false); }
};

// Errors that should silently fall back to local auth
const FALLBACK_CODES = new Set([
  'auth/operation-not-allowed',
  'auth/configuration-not-found',
  'auth/invalid-api-key',
  'auth/network-request-failed',
  'auth/internal-error',
]);

const doFirebaseLogin = async (email, password) => {
  const { signInWithEmailAndPassword } = await import('firebase/auth');
  try {
    const r = await signInWithEmailAndPassword(_auth, email, password);
    return { email: r.user.email, displayName: r.user.displayName, uid: r.user.uid };
  } catch (err) {
    console.warn('Firebase login:', err.code);
    if (FALLBACK_CODES.has(err.code)) return doLocalLogin(email, password);
    // admin@bohracollection.com doesn't exist in Firebase → use local
    if (err.code === 'auth/invalid-credential' && email.toLowerCase().trim() === ADMIN_EMAIL) {
      return doLocalLogin(email, password);
    }
    throw err;
  }
};

const doFirebaseSignup = async (email, password, name) => {
  const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
  try {
    const r = await createUserWithEmailAndPassword(_auth, email, password);
    await updateProfile(r.user, { displayName: name }).catch(() => {});
    return { email: r.user.email, displayName: name, uid: r.user.uid };
  } catch (err) {
    console.warn('Firebase signup:', err.code);
    if (FALLBACK_CODES.has(err.code)) return doLocalSignup(email, password, name);
    throw err;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [fbMode, setFbMode]   = useState(false);

  useEffect(() => {
    let unsub;
    (async () => {
      const ok = await initFirebase();
      setFbMode(ok);
      if (ok) {
        const { onAuthStateChanged } = await import('firebase/auth');
        unsub = onAuthStateChanged(_auth, (u) => {
          if (u) {
            const sess = { email: u.email, displayName: u.displayName, uid: u.uid };
            setUser(sess); persistUser(sess);
          } else {
            const local = getPersistedUser();
            setUser(local?.isLocal ? local : null);
            if (!local?.isLocal) persistUser(null);
          }
          setLoading(false);
        });
      } else {
        setUser(getPersistedUser());
        setLoading(false);
      }
    })();
    return () => unsub?.();
  }, []);

  const setAndPersist = (u) => { setUser(u); persistUser(u); };

  const login = async (email, password) => {
    const ok = await initFirebase();
    const u = ok ? await doFirebaseLogin(email, password) : await doLocalLogin(email, password);
    setAndPersist(u); return u;
  };

  const signup = async (email, password, name) => {
    const ok = await initFirebase();
    const u = ok ? await doFirebaseSignup(email, password, name) : await doLocalSignup(email, password, name);
    setAndPersist(u); return u;
  };

  const loginWithGoogle = async () => {
    const ok = await initFirebase();
    if (!ok) throw { code: 'auth/google-not-configured' };
    const { signInWithPopup } = await import('firebase/auth');
    const r = await signInWithPopup(_auth, _google);
    const u = { email: r.user.email, displayName: r.user.displayName, uid: r.user.uid, photoURL: r.user.photoURL };
    setAndPersist(u); return u;
  };

  const logout = async () => {
    if (_fbOk && !user?.isLocal) {
      const { signOut } = await import('firebase/auth');
      await signOut(_auth).catch(() => {});
    }
    setAndPersist(null);
  };

  const isAdmin = !!user && ADMIN_EMAILS.includes(user.email?.toLowerCase());

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, logout, isAdmin, fbMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);