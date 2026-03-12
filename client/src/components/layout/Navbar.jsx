import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, LayoutDashboard, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/');
    setUserMenu(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products?category=men', label: 'Men' },
    { to: '/products?category=women', label: 'Women' },
    { to: '/products?category=accessories', label: 'Accessories' },
    { to: '/products', label: 'All Products' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-navy-900/98 backdrop-blur-md shadow-2xl' : 'bg-navy-900'
      }`}
    >
      {/* Top bar */}
      <div className="bg-gold-500 py-1 text-center">
        <p className="text-navy-900 text-xs font-body font-bold tracking-widest uppercase">
          ✦ Free delivery on orders above ₹2000 within city ✦ Call: +91 98765 43210 ✦
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border-2 border-gold-400 flex items-center justify-center overflow-hidden" style={{background:'#f5f0e0'}}>
              <img src="/logo.png" alt="Bohra Collection Logo" className="w-full h-full object-contain" style={{padding:'1px'}} />
            </div>
            <div>
              <div className="text-gold-400 font-serif font-bold text-lg leading-none">Bohra Collection</div>
              <div className="text-cream-300 text-xs font-arabic tracking-wider">٧٨٦</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) =>
                  `nav-link text-cream-200 hover:text-gold-400 ${isActive ? 'text-gold-400 border-b border-gold-400' : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/products')} className="text-cream-300 hover:text-gold-400 transition-colors p-2">
              <Search size={18} />
            </button>

            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 text-cream-200 hover:text-gold-400 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-navy-900 font-bold text-sm">
                    {user.displayName?.[0] || user.email[0].toUpperCase()}
                  </div>
                  <span className="hidden md:block text-xs font-body">{user.displayName?.split(' ')[0] || 'User'}</span>
                </button>
                <AnimatePresence>
                  {userMenu && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-navy-800 border border-gold-600/30 shadow-2xl">
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-3 text-gold-400 hover:bg-navy-700 text-sm font-body border-b border-navy-700">
                          <LayoutDashboard size={14} /> Admin Dashboard
                        </Link>
                      )}
                      <div className="px-4 py-2 text-cream-400 text-xs border-b border-navy-700 font-body">{user.email}</div>
                      <button onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-3 text-cream-300 hover:bg-navy-700 text-sm font-body">
                        <LogOut size={14} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="btn-gold text-xs py-2 px-4 hidden md:flex">Login</Link>
            )}

            {/* Mobile menu */}
            <button onClick={() => setOpen(!open)} className="md:hidden text-cream-200 hover:text-gold-400 p-2">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-navy-900 border-t border-navy-700 overflow-hidden">
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map(({ to, label }) => (
                <NavLink key={to} to={to} onClick={() => setOpen(false)}
                  className="py-3 px-4 text-cream-200 hover:text-gold-400 hover:bg-navy-800 font-body text-sm uppercase tracking-widest transition-colors">
                  {label}
                </NavLink>
              ))}
              {!user && (
                <Link to="/login" onClick={() => setOpen(false)} className="btn-gold text-center mt-4">Login / Register</Link>
              )}
              {isAdmin && (
                <Link to="/admin" onClick={() => setOpen(false)} className="btn-outline text-cream-200 border-gold-500 text-center mt-2">Admin Panel</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
