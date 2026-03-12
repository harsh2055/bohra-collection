import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ERROR_MSGS = {
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password. Try again.',
  'auth/invalid-email': 'Invalid email address.',
  'auth/too-many-requests': 'Too many attempts. Wait a moment and try again.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/network-request-failed': 'Network error. Check your connection.',
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, loginWithGoogle, fbMode } = useAuth();
  const navigate = useNavigate();

  const fillAdmin = () => {
    setEmail('admin@bohracollection.com');
    setPassword('Admin@786');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back! ✨');
      navigate('/');
    } catch (err) {
      setError(ERROR_MSGS[err.code] || err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Logged in with Google!');
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/google-not-configured') {
        toast.error('Google login needs Firebase. Use email/password instead.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        // user closed popup, no toast needed
      } else {
        toast.error('Google login failed. Try email/password instead.');
      }
    } finally {
      setGLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Login | Bohra Collection</title></Helmet>
      <div className="min-h-screen bg-navy-900 bg-texture flex items-center justify-center px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-4">

          {/* Logo */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex flex-col items-center gap-2">
              <div className="w-24 h-24 rounded-full border-2 border-gold-400 flex items-center justify-center overflow-hidden" style={{background:'#f5f0e0'}}>
                <img src="/logo.png" alt="Bohra Collection Logo" className="w-full h-full object-contain" style={{padding:'3px'}} />
              </div>
              <span className="text-gold-400 font-serif text-2xl font-bold">Bohra Collection</span>
            </Link>
            <p className="text-cream-400 font-body text-sm mt-1">Sign in to your account</p>
          </div>

          {/* Main card */}
          <div className="bg-white shadow-2xl p-8">
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 p-3 mb-5 text-sm font-body rounded-sm">
                <AlertCircle size={16} className="shrink-0 mt-0.5" /> {error}
              </motion.div>
            )}

            {/* Google button */}
            <button onClick={handleGoogle} disabled={gLoading}
              className="w-full flex items-center justify-center gap-3 border border-cream-300 py-3 hover:bg-cream-50 transition-colors mb-4 font-body text-sm text-navy-700 disabled:opacity-50">
              {gLoading
                ? <div className="spinner w-4 h-4 border-2" />
                : <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
              }
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-cream-200" />
              <span className="text-cream-400 text-xs font-body uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-cream-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-body text-xs uppercase tracking-wider text-navy-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-400 pointer-events-none" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="admin@bohracollection.com" autoComplete="email"
                    className="w-full pl-9 pr-4 py-3 border border-cream-300 focus:border-gold-500 focus:outline-none font-body text-sm text-navy-800" />
                </div>
              </div>
              <div>
                <label className="block font-body text-xs uppercase tracking-wider text-navy-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-400 pointer-events-none" />
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="••••••••" autoComplete="current-password"
                    className="w-full pl-9 pr-10 py-3 border border-cream-300 focus:border-gold-500 focus:outline-none font-body text-sm text-navy-800" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-400 hover:text-navy-600">
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="btn-gold w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60 mt-2">
                {loading ? <><div className="spinner w-4 h-4 border-2" /> Signing in...</> : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm font-body text-cream-500 mt-5">
              Don't have an account?{' '}
              <Link to="/signup" className="text-gold-600 hover:text-gold-700 font-semibold">Create one</Link>
            </p>
          </div>

          {/* Admin quick-access */}
          <div className="bg-navy-800 border border-gold-600/30 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-gold-400">
                <Zap size={14} />
                <span className="text-xs font-body font-bold uppercase tracking-wider">Admin Quick Access</span>
              </div>
              <span className="text-xs text-cream-500 font-body">Works offline too</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-body text-cream-300 mb-3">
              <div><span className="text-cream-500">Email:</span><br/><span className="text-gold-300">admin@bohracollection.com</span></div>
              <div><span className="text-cream-500">Password:</span><br/><span className="text-gold-300">Admin@786</span></div>
            </div>
            <button onClick={fillAdmin}
              className="w-full btn-gold py-2 text-xs flex items-center justify-center gap-2">
              <Zap size={12} /> Fill Admin Credentials & Sign In
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
