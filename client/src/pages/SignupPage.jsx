import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup, loginWithGoogle, useFirebase } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setError('Passwords do not match.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    setError('');
    setLoading(true);
    try {
      await signup(email, password, name);
      toast.success('Account created! Welcome to Bohra Collection.');
      navigate('/');
    } catch (err) {
      const msgs = {
        'auth/email-already-in-use': 'This email is already registered. Try logging in instead.',
        'auth/invalid-email': 'Invalid email address.',
        'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
      };
      setError(msgs[err.code] || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Welcome to Bohra Collection!');
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/google-not-configured') {
        toast.error('Google login requires Firebase. Use email signup instead.');
      } else {
        toast.error('Google sign-up failed. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const inputCls = "w-full pl-9 pr-4 py-3 border border-cream-300 focus:border-gold-500 focus:outline-none font-body text-sm text-navy-800";

  return (
    <>
      <Helmet><title>Create Account | Bohra Collection</title></Helmet>
      <div className="min-h-screen bg-navy-900 bg-texture flex items-center justify-center px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex flex-col items-center gap-2">
              <div className="w-24 h-24 rounded-full border-2 border-gold-400 flex items-center justify-center overflow-hidden" style={{background:'#f5f0e0'}}>
                <img src="/logo.png" alt="Bohra Collection Logo" className="w-full h-full object-contain" style={{padding:'3px'}} />
              </div>
              <span className="text-gold-400 font-serif text-2xl font-bold">Bohra Collection</span>
            </Link>
            <p className="text-cream-400 font-body text-sm mt-2">Create your account</p>
          </div>

          <div className="bg-white shadow-2xl p-8">
            {!useFirebase && (
              <div className="bg-blue-50 border border-blue-200 p-3 mb-5 flex items-start gap-2">
                <Info size={15} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs font-body text-blue-700">
                  <strong>Demo Mode</strong> — Accounts are saved locally in your browser. Works perfectly for testing!
                </p>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 p-3 mb-5 text-sm font-body">
                <AlertCircle size={16} className="shrink-0 mt-0.5" /> {error}
              </div>
            )}

            <button onClick={handleGoogle} disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 border border-cream-300 py-3 hover:bg-cream-50 transition-colors mb-5 font-body text-sm text-navy-700 disabled:opacity-50 relative">
              {googleLoading ? <div className="spinner w-4 h-4 border-2" /> : (
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Sign up with Google
              {!useFirebase && <span className="absolute right-3 text-xs text-cream-400">(needs Firebase)</span>}
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-cream-200" />
              <span className="text-cream-400 text-xs font-body uppercase tracking-wider">or email</span>
              <div className="flex-1 h-px bg-cream-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-body text-xs uppercase tracking-wider text-navy-700 mb-2">Full Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-400" />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block font-body text-xs uppercase tracking-wider text-navy-700 mb-2">Email</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block font-body text-xs uppercase tracking-wider text-navy-700 mb-2">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-400" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="Min 6 characters" className={inputCls.replace('pr-4', 'pr-10')} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-400 hover:text-navy-600">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block font-body text-xs uppercase tracking-wider text-navy-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-400" />
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
                    placeholder="Re-enter password" className={inputCls} />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="btn-gold w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <><div className="spinner w-4 h-4 border-2" /> Creating...</> : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm font-body text-cream-500 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-gold-600 hover:text-gold-700 font-semibold">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
