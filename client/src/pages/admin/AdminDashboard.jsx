import { useState, useEffect, useCallback, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Plus, Edit2, Trash2, Package, Users, Eye, TrendingUp,
  X, Check, AlertTriangle, BarChart2, RefreshCw, Wifi, WifiOff,
  Calendar, Globe, Upload, ImagePlus, Link as LinkIcon, Loader
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, CartesianGrid
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductsContext';
import { fetchAnalytics } from '../../services/analyticsService.js';
import toast from 'react-hot-toast';

const COLORS = ['#1a2744', '#d4a017', '#e8a000', '#4a7c59', '#8b5cf6'];
const EMPTY_FORM = { name: '', category: 'men', price: '', description: '', sizes: '', images: '', featured: false, inStock: true, deliveryNote: '' };

// ── Image Upload Component ────────────────────────────────────
function ImageUploader({ value, onChange }) {
  const fileInputRef = useRef(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [tab, setTab] = useState('upload'); // 'upload' | 'url'
  const [dragging, setDragging] = useState(false);

  // Parse existing images from comma-separated string
  useEffect(() => {
    if (value) {
      const imgs = value.split(',').map(s => s.trim()).filter(Boolean);
      // Separate data URLs from regular URLs for display
      setUploadedImages(imgs.filter(img => img.startsWith('data:')));
    }
  }, []);

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) { toast.error('Please select image files only'); return; }

    validFiles.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setUploadedImages(prev => {
          const newList = [...prev, dataUrl];
          // Merge with any URL-based images already in value
          const existing = value ? value.split(',').map(s => s.trim()).filter(s => s && !s.startsWith('data:')) : [];
          onChange([...existing, ...newList].join(', '));
          return newList;
        });
        toast.success(`${file.name} uploaded!`);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const addUrl = () => {
    if (!urlInput.trim()) return;
    try { new URL(urlInput); } catch { toast.error('Please enter a valid URL'); return; }
    const existing = value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];
    if (existing.includes(urlInput.trim())) { toast.error('URL already added'); return; }
    const newVal = [...existing, urlInput.trim()].join(', ');
    onChange(newVal);
    setUrlInput('');
    toast.success('Image URL added!');
  };

  const removeImage = (imgToRemove) => {
    const existing = value ? value.split(',').map(s => s.trim()).filter(s => s !== imgToRemove) : [];
    onChange(existing.join(', '));
    setUploadedImages(prev => prev.filter(img => img !== imgToRemove));
  };

  // All images to display (both uploaded and URL)
  const allImages = value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <div className="space-y-3">
      {/* Tab switcher */}
      <div className="flex gap-1 border-b border-cream-200">
        <button type="button" onClick={() => setTab('upload')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-body uppercase tracking-wider border-b-2 -mb-px transition-colors ${
            tab === 'upload' ? 'border-gold-500 text-gold-600 font-bold' : 'border-transparent text-navy-500 hover:text-navy-800'
          }`}>
          <Upload size={12} /> Upload from Device
        </button>
        <button type="button" onClick={() => setTab('url')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-body uppercase tracking-wider border-b-2 -mb-px transition-colors ${
            tab === 'url' ? 'border-gold-500 text-gold-600 font-bold' : 'border-transparent text-navy-500 hover:text-navy-800'
          }`}>
          <LinkIcon size={12} /> Add Image URL
        </button>
      </div>

      {/* Upload tab */}
      {tab === 'upload' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-sm p-6 text-center cursor-pointer transition-all duration-200 ${
            dragging ? 'border-gold-500 bg-gold-50' : 'border-cream-300 hover:border-gold-400 hover:bg-cream-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <ImagePlus size={28} className="mx-auto mb-2 text-cream-400" />
          <p className="text-sm font-body text-navy-600 font-semibold">Click to select or drag & drop images</p>
          <p className="text-xs font-body text-cream-400 mt-1">PNG, JPG, WEBP up to 5MB each • Multiple allowed</p>
          <button type="button"
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            className="mt-3 inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-navy-900 text-xs font-body font-bold px-4 py-2 uppercase tracking-wider transition-colors">
            <Upload size={12} /> Choose from Gallery
          </button>
        </div>
      )}

      {/* URL tab */}
      {tab === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addUrl())}
            placeholder="https://example.com/product-image.jpg"
            className="flex-1 px-3 py-2.5 border border-cream-300 focus:border-gold-500 focus:outline-none font-body text-sm text-navy-800"
          />
          <button type="button" onClick={addUrl}
            className="btn-gold px-4 py-2 flex items-center gap-1 text-xs whitespace-nowrap">
            <Plus size={12} /> Add URL
          </button>
        </div>
      )}

      {/* Image previews */}
      {allImages.length > 0 && (
        <div>
          <p className="text-xs font-body text-navy-600 uppercase tracking-wider mb-2 font-bold">
            {allImages.length} image{allImages.length > 1 ? 's' : ''} added
          </p>
          <div className="grid grid-cols-4 gap-2">
            {allImages.map((img, i) => (
              <div key={i} className="relative group aspect-square">
                <img src={img} alt={`Product ${i + 1}`}
                  className="w-full h-full object-cover border border-cream-200"
                  onError={(e) => { e.target.src = ''; e.target.parentElement.style.display = 'none'; }}
                />
                <button type="button" onClick={() => removeImage(img)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                  <X size={10} />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 bg-gold-500 text-navy-900 text-[9px] font-body font-bold px-1 py-0.5 uppercase">Main</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Stat Card ────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color, loading }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className={`bg-white border-t-4 ${color} p-6 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-cream-500 text-xs font-body uppercase tracking-widest">{label}</p>
          {loading
            ? <div className="h-8 w-20 bg-cream-200 animate-pulse mt-1 rounded" />
            : <p className="font-serif text-3xl font-bold text-navy-900 mt-1">{value}</p>
          }
          {sub && <p className="text-cream-500 text-xs font-body mt-1">{sub}</p>}
        </div>
        <div className="text-cream-300">{icon}</div>
      </div>
    </motion.div>
  );
}

// ── Product Form ─────────────────────────────────────────────
function ProductForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ? {
    ...initial,
    sizes: Array.isArray(initial.sizes) ? initial.sizes.join(', ') : initial.sizes || '',
    images: Array.isArray(initial.images) ? initial.images.join(', ') : initial.images || '',
  } : EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return toast.error('Name and price required');
    setSaving(true);
    try {
      await onSave({
        ...form,
        price: Number(form.price),
        sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
        images: form.images.split(',').map(s => s.trim()).filter(Boolean),
      });
    } finally { setSaving(false); }
  };

  const inp = "w-full px-3 py-2.5 border border-cream-300 focus:border-gold-500 focus:outline-none font-body text-sm text-navy-800";
  const lbl = "block font-body text-xs uppercase tracking-wider text-navy-600 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={lbl}>Product Name *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} required className={inp} placeholder="e.g. White Kurta" />
        </div>
        <div>
          <label className={lbl}>Category *</label>
          <select value={form.category} onChange={e => set('category', e.target.value)} className={inp}>
            {['men','women','accessories'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className={lbl}>Price (₹) *</label>
          <input type="number" value={form.price} onChange={e => set('price', e.target.value)} required min="0" className={inp} placeholder="1299" />
        </div>
        <div>
          <label className={lbl}>Sizes (comma-separated)</label>
          <input value={form.sizes} onChange={e => set('sizes', e.target.value)} className={inp} placeholder="S, M, L, XL" />
        </div>
      </div>
      <div>
        <label className={lbl}>Description</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} className={inp + ' resize-none'} placeholder="Product description..." />
      </div>

      {/* Image Upload Section */}
      <div>
        <label className={lbl + ' mb-2'}>
          Product Images
          <span className="normal-case ml-1 text-cream-400 font-normal">(upload from gallery or add URL)</span>
        </label>
        <ImageUploader
          value={form.images}
          onChange={(val) => set('images', val)}
        />
      </div>

      <div>
        <label className={lbl}>Delivery Note</label>
        <input value={form.deliveryNote} onChange={e => set('deliveryNote', e.target.value)} className={inp} placeholder="e.g. Free local delivery" />
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="accent-gold-500 w-4 h-4" />
          <span className="font-body text-sm text-navy-700">Featured</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.inStock} onChange={e => set('inStock', e.target.checked)} className="accent-gold-500 w-4 h-4" />
          <span className="font-body text-sm text-navy-700">In Stock</span>
        </label>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="btn-gold flex items-center gap-2 disabled:opacity-60">
          {saving ? <div className="spinner w-4 h-4 border-2" /> : <Check size={14} />}
          {initial ? 'Update Product' : 'Add Product'}
        </button>
        <button type="button" onClick={onCancel} className="btn-outline flex items-center gap-2">
          <X size={14} /> Cancel
        </button>
      </div>
    </form>
  );
}

// ── Main Dashboard ───────────────────────────────────────────
export default function AdminDashboard() {
  const { isAdmin, user } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct, usingFirestore } = useProducts();

  const [tab, setTab]               = useState('overview');
  const [showForm, setShowForm]     = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch]         = useState('');

  const [analytics, setAnalytics]   = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  if (!isAdmin) return <Navigate to="/" replace />;

  const loadAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const data = await fetchAnalytics();
      setAnalytics(data);
      setLastRefresh(new Date());
    } catch (e) {
      toast.error('Failed to load analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 60000);
    return () => clearInterval(interval);
  }, [loadAnalytics]);

  const totalViews   = products.reduce((s, p) => s + (p.views || 0), 0);
  const inStockCount = products.filter(p => p.inStock !== false).length;
  const featuredCount= products.filter(p => p.featured).length;
  const catData      = ['men','women','accessories'].map(c => ({
    name: c.charAt(0).toUpperCase()+c.slice(1),
    count: products.filter(p => p.category === c).length,
  }));
  const topProducts  = [...products].sort((a,b) => (b.views||0)-(a.views||0)).slice(0, 5);
  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.includes(search.toLowerCase())
  );

  const handleSave = async (data) => {
    if (editProduct) await updateProduct(editProduct.id, data);
    else await addProduct(data);
    setShowForm(false); setEditProduct(null);
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setDeleteConfirm(null);
  };

  const tabs = [
    { id: 'overview',  label: 'Overview',   icon: <BarChart2 size={15} /> },
    { id: 'visitors',  label: 'Visitors',   icon: <Users size={15} /> },
    { id: 'products',  label: 'Products',   icon: <Package size={15} /> },
    { id: 'analytics', label: 'Analytics',  icon: <TrendingUp size={15} /> },
  ];

  return (
    <>
      <Helmet><title>Admin Dashboard | Bohra Collection</title></Helmet>
      <div className="min-h-screen bg-cream-50 pt-20">

        <div className="bg-navy-900 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-3xl text-cream-100 font-bold">Admin Dashboard</h1>
                <p className="text-gold-400 text-sm font-body mt-1">Welcome, {user?.displayName || user?.email}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-1.5 text-xs font-body px-3 py-1.5 rounded-full ${usingFirestore ? 'bg-green-900/50 text-green-300' : 'bg-yellow-900/50 text-yellow-300'}`}>
                  {usingFirestore ? <Wifi size={12} /> : <WifiOff size={12} />}
                  {usingFirestore ? 'Live Firestore' : 'Demo Data'}
                </div>
                <div className="text-gold-400 font-arabic text-2xl">٧٨٦</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex gap-1 mb-8 border-b border-cream-200 overflow-x-auto">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-3 font-body text-sm uppercase tracking-wider transition-colors border-b-2 -mb-px whitespace-nowrap ${
                  tab === t.id ? 'border-gold-500 text-gold-600 font-bold' : 'border-transparent text-navy-500 hover:text-navy-800'
                }`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {tab === 'overview' && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard icon={<Package size={28}/>} label="Total Products" value={products.length} sub={`${inStockCount} in stock`} color="border-gold-500" />
                <StatCard icon={<Eye size={28}/>} label="Product Views" value={totalViews.toLocaleString()} sub="All time" color="border-navy-600" />
                <StatCard icon={<Users size={28}/>} label="Total Visitors" value={analytics?.totalVisitors?.toLocaleString() ?? '—'} sub={`${analytics?.todayVisitors || 0} today`} color="border-green-500" loading={analyticsLoading} />
                <StatCard icon={<TrendingUp size={28}/>} label="Featured" value={featuredCount} sub="Highlighted" color="border-blue-500" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 border border-cream-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-lg font-semibold text-navy-800">Daily Visitors (14 days)</h3>
                    <button onClick={loadAnalytics} className="text-cream-400 hover:text-gold-500 transition-colors">
                      <RefreshCw size={14} className={analyticsLoading ? 'animate-spin' : ''} />
                    </button>
                  </div>
                  {analyticsLoading ? (
                    <div className="h-48 flex items-center justify-center"><div className="spinner" /></div>
                  ) : (
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={analytics?.dailyChart || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3e4a8" />
                        <XAxis dataKey="label" tick={{ fontSize: 10, fontFamily: 'Lato' }} />
                        <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                        <Tooltip contentStyle={{ fontFamily: 'Lato', fontSize: 12 }} />
                        <Line type="monotone" dataKey="visitors" stroke="#d4a017" strokeWidth={2} dot={{ r: 3, fill: '#d4a017' }} name="Visitors" />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                  {lastRefresh && <p className="text-cream-400 text-xs font-body mt-2 text-right">Updated: {lastRefresh.toLocaleTimeString()}</p>}
                </div>
                <div className="bg-white p-6 border border-cream-200">
                  <h3 className="font-serif text-lg font-semibold text-navy-800 mb-4">Top Products by Views</h3>
                  {topProducts.length === 0 ? (
                    <p className="text-cream-400 text-sm font-body text-center py-8">No view data yet</p>
                  ) : (
                    <div className="space-y-3">
                      {topProducts.map((p, i) => (
                        <div key={p.id} className="flex items-center gap-3">
                          <span className="text-gold-500 font-serif font-bold text-sm w-5">{i+1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-sm text-navy-800 truncate">{p.name}</p>
                            <div className="h-1.5 bg-cream-100 mt-1 rounded-full">
                              <div className="h-full bg-gold-500 rounded-full transition-all duration-700"
                                style={{ width: `${topProducts[0]?.views ? Math.min(100, ((p.views||0)/(topProducts[0].views||1))*100) : 0}%` }} />
                            </div>
                          </div>
                          <span className="text-cream-500 text-xs font-body shrink-0 w-16 text-right">{(p.views||0).toLocaleString()} views</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VISITORS TAB */}
          {tab === 'visitors' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl font-semibold text-navy-800">Real-time Visitor Analytics</h2>
                <button onClick={loadAnalytics} disabled={analyticsLoading} className="btn-outline flex items-center gap-2 text-xs py-2">
                  <RefreshCw size={13} className={analyticsLoading ? 'animate-spin' : ''} /> Refresh
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard icon={<Users size={24}/>} label="Total Visitors" value={analytics?.totalVisitors?.toLocaleString() ?? '—'} color="border-gold-500" loading={analyticsLoading} />
                <StatCard icon={<Calendar size={24}/>} label="Today" value={analytics?.todayVisitors?.toLocaleString() ?? '—'} sub="unique sessions" color="border-green-500" loading={analyticsLoading} />
                <StatCard icon={<Globe size={24}/>} label="Pages Tracked" value={analytics?.topPages?.length ?? '—'} sub="unique pages" color="border-blue-500" loading={analyticsLoading} />
                <StatCard icon={<Eye size={24}/>} label="Product Views" value={totalViews.toLocaleString()} sub="all products" color="border-navy-600" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 border border-cream-200">
                  <h3 className="font-serif text-lg font-semibold text-navy-800 mb-4">Visitor Trend — Last 14 Days</h3>
                  {analyticsLoading ? (
                    <div className="h-48 flex items-center justify-center"><div className="spinner" /></div>
                  ) : (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={analytics?.dailyChart || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3e4a8" />
                        <XAxis dataKey="label" tick={{ fontSize: 10, fontFamily: 'Lato' }} />
                        <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                        <Tooltip contentStyle={{ fontFamily: 'Lato', fontSize: 12 }} />
                        <Bar dataKey="visitors" fill="#d4a017" name="Visitors" radius={[2,2,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div className="bg-white p-6 border border-cream-200">
                  <h3 className="font-serif text-lg font-semibold text-navy-800 mb-4">Most Visited Pages</h3>
                  {analyticsLoading ? (
                    <div className="h-48 flex items-center justify-center"><div className="spinner" /></div>
                  ) : !analytics?.topPages?.length ? (
                    <div className="h-48 flex flex-col items-center justify-center text-cream-400">
                      <Globe size={32} className="mb-2 opacity-30" />
                      <p className="text-sm font-body">No page data yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {analytics.topPages.map((p, i) => (
                        <div key={p.page} className="flex items-center gap-3">
                          <span className="text-gold-500 font-bold text-sm w-5 shrink-0">{i+1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-sm text-navy-700 truncate">{p.page || '/'}</p>
                            <div className="h-1.5 bg-cream-100 mt-0.5 rounded-full">
                              <div className="h-full bg-navy-600 rounded-full"
                                style={{ width: `${analytics.topPages[0]?.hits ? (p.hits/analytics.topPages[0].hits)*100 : 0}%` }} />
                            </div>
                          </div>
                          <span className="text-cream-500 text-xs font-body shrink-0">{p.hits}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {tab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div className="relative">
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search products..." className="pl-9 pr-4 py-2.5 border border-cream-300 focus:border-gold-500 focus:outline-none font-body text-sm w-64" />
                  <Package size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-400" />
                </div>
                <button onClick={() => { setEditProduct(null); setShowForm(true); }} className="btn-gold flex items-center gap-2">
                  <Plus size={16} /> Add Product
                </button>
              </div>

              <AnimatePresence>
                {showForm && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-6">
                    <div className="bg-white border border-gold-200 p-6">
                      <h3 className="font-serif text-xl font-semibold text-navy-800 mb-5">{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
                      <ProductForm initial={editProduct} onSave={handleSave} onCancel={() => { setShowForm(false); setEditProduct(null); }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="bg-white border border-cream-200 overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="bg-navy-900 text-cream-200">
                      {['Product','Category','Price','Status','Views','Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left font-body text-xs uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p, i) => (
                      <tr key={p.id} className={`border-t border-cream-100 hover:bg-cream-50 transition-colors ${i%2===0?'':'bg-cream-50/50'}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {p.images?.[0] && (
                              <img src={p.images[0]} alt="" className="w-10 h-10 object-cover border border-cream-200 shrink-0"
                                onError={(e) => e.target.style.display='none'} />
                            )}
                            <div>
                              <p className="font-body text-sm font-semibold text-navy-800 line-clamp-1">{p.name}</p>
                              {p.featured && <span className="text-gold-600 text-xs font-body">★ Featured</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><span className="bg-cream-100 text-navy-700 text-xs font-body px-2 py-1 capitalize">{p.category}</span></td>
                        <td className="px-4 py-3 font-body text-sm font-semibold text-navy-800">₹{p.price?.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3"><span className={`text-xs font-body font-semibold px-2 py-1 ${p.inStock!==false?'bg-green-50 text-green-700':'bg-red-50 text-red-600'}`}>{p.inStock!==false?'In Stock':'Out of Stock'}</span></td>
                        <td className="px-4 py-3 font-body text-sm font-bold text-gold-600">{(p.views||0).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => { setEditProduct(p); setShowForm(true); window.scrollTo({top:200,behavior:'smooth'}); }}
                              className="p-1.5 text-navy-600 hover:text-gold-600 hover:bg-cream-100 transition-colors rounded">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => setDeleteConfirm(p.id)}
                              className="p-1.5 text-navy-600 hover:text-red-600 hover:bg-red-50 transition-colors rounded">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredProducts.length === 0 && <div className="text-center py-12 text-cream-400 font-body">No products found</div>}
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {tab === 'analytics' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 border border-cream-200">
                <h3 className="font-serif text-lg font-semibold text-navy-800 mb-4">Products by Category</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={catData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                      label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                      {catData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white p-6 border border-cream-200">
                <h3 className="font-serif text-lg font-semibold text-navy-800 mb-4">Product Views (Real-time)</h3>
                {!analytics?.productViews?.length ? (
                  <div className="h-48 flex flex-col items-center justify-center text-cream-400">
                    <Eye size={32} className="mb-2 opacity-30" />
                    <p className="text-sm font-body">No product view data yet</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={analytics.productViews.slice(0,6)} layout="vertical">
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fontFamily: 'Lato' }} width={100} />
                      <Tooltip contentStyle={{ fontFamily: 'Lato', fontSize: 12 }} />
                      <Bar dataKey="views" fill="#d4a017" name="Views" radius={[0,2,2,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="bg-white p-6 border border-cream-200">
                <h3 className="font-serif text-lg font-semibold text-navy-800 mb-4">Price Distribution</h3>
                <div className="space-y-3">
                  {[
                    ['Under ₹1,000', products.filter(p=>p.price<1000).length],
                    ['₹1,000–₹3,000', products.filter(p=>p.price>=1000&&p.price<3000).length],
                    ['₹3,000–₹6,000', products.filter(p=>p.price>=3000&&p.price<6000).length],
                    ['₹6,000+', products.filter(p=>p.price>=6000).length],
                  ].map(([range, count]) => (
                    <div key={range} className="flex items-center gap-3">
                      <span className="text-xs font-body text-navy-600 w-36 shrink-0">{range}</span>
                      <div className="flex-1 h-4 bg-cream-100 rounded-full">
                        <div className="h-full bg-gold-500 rounded-full transition-all"
                          style={{ width: `${products.length?(count/products.length)*100:0}%` }} />
                      </div>
                      <span className="text-xs font-body text-cream-500 w-5 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 border border-cream-200">
                <h3 className="font-serif text-lg font-semibold text-navy-800 mb-4">Product View Leaderboard</h3>
                {!analytics?.productViews?.length ? (
                  <div className="text-center py-8 text-cream-400 text-sm font-body">No views tracked yet</div>
                ) : (
                  <div className="space-y-2">
                    {analytics.productViews.map((p, i) => (
                      <div key={p.id} className="flex items-center gap-3 py-2 border-b border-cream-100 last:border-0">
                        <span className={`font-serif font-bold text-sm w-6 ${i===0?'text-gold-500':i===1?'text-gray-400':i===2?'text-amber-700':'text-cream-400'}`}>#{i+1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm text-navy-800 truncate">{p.name}</p>
                          <span className="text-xs font-body bg-cream-100 text-navy-600 px-1.5 py-0.5 capitalize">{p.category}</span>
                        </div>
                        <span className="font-body text-sm font-bold text-gold-600 shrink-0">{p.views.toLocaleString()} views</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy-900/70 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white p-8 max-w-sm w-full shadow-2xl">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="font-serif text-xl font-semibold text-navy-900 mb-2">Delete Product?</h3>
                <p className="text-cream-500 font-body text-sm mb-6">This cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 font-body text-sm uppercase tracking-wider">Delete</button>
                  <button onClick={() => setDeleteConfirm(null)} className="flex-1 btn-outline py-3">Cancel</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}