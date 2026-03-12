import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ProductsProvider } from './context/ProductsContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { usePageTracking } from './hooks/useAnalytics.js';

const HomePage          = lazy(() => import('./pages/HomePage'));
const ProductsPage      = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const LoginPage         = lazy(() => import('./pages/LoginPage'));
const SignupPage        = lazy(() => import('./pages/SignupPage'));
const AdminDashboard    = lazy(() => import('./pages/admin/AdminDashboard'));

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50">
      <div className="text-center">
        <div className="spinner mx-auto mb-4" />
        <div className="text-gold-600 font-arabic text-2xl">٧٨٦</div>
      </div>
    </div>
  );
}

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } };
const trans = { duration: 0.3, ease: 'easeInOut' };

function Page({ children }) {
  return <motion.div {...fade} transition={trans}>{children}</motion.div>;
}

function WithLayout({ children }) {
  return <div className="min-h-screen flex flex-col"><Navbar /><main className="flex-1">{children}</main><Footer /></div>;
}

function WithNavOnly({ children }) {
  return <div className="min-h-screen flex flex-col"><Navbar /><main className="flex-1">{children}</main></div>;
}

// Inner component so hooks work inside Router context
function AppRoutes() {
  usePageTracking(); // ← tracks every page visit automatically
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<Loader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<WithLayout><Page><HomePage /></Page></WithLayout>} />
          <Route path="/products" element={<WithLayout><Page><ProductsPage /></Page></WithLayout>} />
          <Route path="/products/:id" element={<WithLayout><Page><ProductDetailPage /></Page></WithLayout>} />
          <Route path="/login"  element={<Page><LoginPage /></Page>} />
          <Route path="/signup" element={<Page><SignupPage /></Page>} />
          <Route path="/admin/*" element={<WithNavOnly><Page><AdminDashboard /></Page></WithNavOnly>} />
          <Route path="*" element={
            <WithLayout>
              <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24">
                <div className="text-gold-400 font-arabic text-4xl mb-4">٧٨٦</div>
                <h1 className="font-serif text-6xl font-bold text-navy-900 mb-4">404</h1>
                <p className="font-body text-cream-500 mb-8">This page doesn't exist</p>
                <a href="/" className="btn-gold">Return Home</a>
              </div>
            </WithLayout>
          } />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <AppRoutes />
      </ProductsProvider>
    </AuthProvider>
  );
}