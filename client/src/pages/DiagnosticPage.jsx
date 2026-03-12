// ============================================================
// DIAGNOSTIC PAGE — visit /diagnostic to debug Firebase issues
// Remove this page before going to production
// ============================================================
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function DiagnosticPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const env = {
    VITE_FIREBASE_API_KEY:            import.meta.env.VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID:import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID:             import.meta.env.VITE_FIREBASE_APP_ID,
  };

  const checkValue = (v) => {
    if (!v || v === 'undefined') return { ok: false, issue: 'MISSING' };
    if (v.startsWith('"') || v.endsWith('"') || v.startsWith("'")) return { ok: false, issue: 'HAS QUOTES — remove them from .env' };
    if (v.startsWith('YOUR_') || v.startsWith('your_')) return { ok: false, issue: 'PLACEHOLDER — replace with real value' };
    return { ok: true, issue: null };
  };

  const testFirebase = async () => {
    setLoading(true);
    setResult('Testing...');
    try {
      const { auth } = await import('../services/firebase.js');
      // Try login with obviously wrong credentials — a proper 400/wrong-password means Firebase IS working
      await signInWithEmailAndPassword(auth, 'test-diagnostic@test.com', 'wrongpass123');
      setResult('✅ Firebase auth is fully working!');
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setResult('✅ Firebase auth is WORKING correctly!\n(Got expected "user not found" — means auth is connected)');
      } else if (err.code === 'auth/invalid-api-key') {
        setResult('❌ Invalid API Key — check VITE_FIREBASE_API_KEY in .env (no quotes!)');
      } else if (err.code === 'auth/operation-not-allowed') {
        setResult('❌ Email/Password sign-in is DISABLED in Firebase Console\n→ Go to Authentication → Sign-in method → Enable Email/Password');
      } else if (err.code === 'auth/configuration-not-found') {
        setResult('❌ Firebase project not found or wrong project ID');
      } else {
        setResult(`Error: ${err.code}\n${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">🔧 Firebase Diagnostic</h1>
        <p className="text-gray-500 text-sm mb-6">This page helps debug Firebase configuration issues.</p>

        {/* Env check */}
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">Environment Variables (.env)</h2>
          <div className="space-y-2">
            {Object.entries(env).map(([key, val]) => {
              const { ok, issue } = checkValue(val);
              return (
                <div key={key} className={`flex items-start gap-3 p-2 rounded text-sm font-mono ${ok ? 'bg-green-50' : 'bg-red-50'}`}>
                  <span className="text-lg">{ok ? '✅' : '❌'}</span>
                  <div>
                    <div className="font-semibold text-gray-700">{key}</div>
                    {ok
                      ? <div className="text-green-700">{val?.substring(0, 30)}{val?.length > 30 ? '...' : ''}</div>
                      : <div className="text-red-600">Value: "{val}" → {issue}</div>
                    }
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live test */}
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">Live Firebase Auth Test</h2>
          <button onClick={testFirebase} disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 mb-4 font-body text-sm">
            {loading ? 'Testing...' : 'Run Firebase Auth Test'}
          </button>
          {result && (
            <pre className={`text-sm p-4 rounded font-mono whitespace-pre-wrap ${result.startsWith('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {result}
            </pre>
          )}
        </div>

        {/* .env template */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="font-semibold text-gray-700 mb-3">Your .env should look like this</h2>
          <pre className="bg-gray-900 text-green-300 p-4 rounded text-xs overflow-x-auto">
{`# client/.env  (NO quotes around values!)

VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_ADMIN_EMAIL=admin@bohracollection.com`}
          </pre>
          <p className="text-xs text-gray-500 mt-3">⚠️ After changing .env, restart the dev server: Ctrl+C then <code className="bg-gray-100 px-1">npm run dev</code></p>
        </div>
      </div>
    </div>
  );
}
