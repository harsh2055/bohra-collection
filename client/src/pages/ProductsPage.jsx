import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Search, Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import { useProducts } from '../context/ProductsContext';

const CATEGORIES = ['all', 'men', 'women', 'accessories'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

export default function ProductsPage() {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState('newest');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    if (cat === 'all') setSearchParams({});
    else setSearchParams({ category: cat });
  };

  const filtered = useMemo(() => {
    let items = [...products];
    if (category !== 'all') items = items.filter(p => p.category === category);
    if (search) items = items.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()));
    if (inStockOnly) items = items.filter(p => p.inStock !== false);
    items = items.filter(p => p.price <= maxPrice);
    if (sort === 'price-asc') items.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') items.sort((a, b) => b.price - a.price);
    else if (sort === 'popular') items.sort((a, b) => (b.views || 0) - (a.views || 0));
    else items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return items;
  }, [products, category, search, sort, maxPrice, inStockOnly]);

  const maxProductPrice = Math.max(...products.map(p => p.price), 10000);

  return (
    <>
      <Helmet>
        <title>{category === 'all' ? 'All Products' : `${category.charAt(0).toUpperCase() + category.slice(1)}'s Collection`} | Bohra Collection</title>
      </Helmet>

      {/* Page Header */}
      <div className="bg-navy-900 pt-24 pb-12 bg-texture">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-gold-400 font-arabic text-xl">٧٨٦</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream-100 mt-2 mb-3">
            {category === 'all' ? 'Our Collection' : `${category.charAt(0).toUpperCase() + category.slice(1)}'s Collection`}
          </h1>
          <div className="gold-divider" />
          <p className="text-cream-400 font-body mt-3">{filtered.length} products found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => handleCategoryChange(cat)}
              className={`whitespace-nowrap px-5 py-2 font-body text-sm uppercase tracking-widest transition-all duration-200 border ${
                category === cat
                  ? 'bg-navy-900 text-gold-400 border-navy-900'
                  : 'bg-white text-navy-700 border-cream-300 hover:border-navy-700'
              }`}>
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-400" />
            <input
              type="text" placeholder="Search products..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-cream-300 focus:border-gold-500 focus:outline-none font-body text-sm bg-white text-navy-800"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-400 hover:text-navy-700">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-3">
            {/* Sort */}
            <div className="relative">
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 border border-cream-300 focus:border-gold-500 focus:outline-none font-body text-sm bg-white text-navy-800 cursor-pointer">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-400 pointer-events-none" />
            </div>

            {/* Filter toggle */}
            <button onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center gap-2 px-4 py-3 border font-body text-sm uppercase tracking-wider transition-colors ${
                filterOpen ? 'bg-navy-900 text-gold-400 border-navy-900' : 'bg-white text-navy-700 border-cream-300 hover:border-navy-700'
              }`}>
              <SlidersHorizontal size={14} /> Filters
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8">
              <div className="bg-cream-50 border border-cream-200 p-6 grid md:grid-cols-2 gap-6">
                <div>
                  <label className="font-body text-sm font-bold text-navy-800 uppercase tracking-wider block mb-3">
                    Max Price: ₹{maxPrice.toLocaleString('en-IN')}
                  </label>
                  <input type="range" min={500} max={maxProductPrice} step={500}
                    value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-gold-500" />
                  <div className="flex justify-between text-xs text-cream-500 font-body mt-1">
                    <span>₹500</span><span>₹{maxProductPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="instock" checked={inStockOnly}
                    onChange={e => setInStockOnly(e.target.checked)}
                    className="accent-gold-500 w-4 h-4" />
                  <label htmlFor="instock" className="font-body text-sm text-navy-800 cursor-pointer">In Stock Only</label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-serif text-2xl text-navy-700 mb-2">No products found</h3>
            <p className="text-cream-500 font-body">Try adjusting your search or filters</p>
            <button onClick={() => { setSearch(''); setCategory('all'); setSearchParams({}); }}
              className="btn-outline mt-6">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </div>
    </>
  );
}
