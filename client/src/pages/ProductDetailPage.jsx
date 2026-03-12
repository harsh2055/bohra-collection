import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Phone, Mail, ChevronLeft, Package, Truck, Eye, ChevronRight } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import ProductCard from '../components/products/ProductCard';

const PHONE = '+919876543210';
const EMAIL = 'info@bohracollection.com';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { products, incrementViews } = useProducts();
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [imgError, setImgError] = useState(false);

  const product = products.find(p => p.id === id);
  const related = products.filter(p => p.id !== id && p.category === product?.category).slice(0, 4);

  useEffect(() => {
    if (product) {
      incrementViews(product.id);
      setSelectedSize(product.sizes?.[0] || '');
    }
  }, [id]);

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-24">
      <div className="text-5xl mb-4">😕</div>
      <h2 className="font-serif text-2xl text-navy-800 mb-4">Product not found</h2>
      <Link to="/products" className="btn-gold">Back to Products</Link>
    </div>
  );

  const waMsg = encodeURIComponent(
    `Hi! I'm interested in *${product.name}*${selectedSize ? ` (Size: ${selectedSize})` : ''} - ₹${product.price.toLocaleString('en-IN')}.\nPlease confirm availability.`
  );
  const emailSubject = encodeURIComponent(`Order: ${product.name}`);
  const emailBody = encodeURIComponent(`Hello,\n\nI would like to order:\n\nProduct: ${product.name}\nPrice: ₹${product.price}${selectedSize ? `\nSize: ${selectedSize}` : ''}\n\nPlease confirm availability and delivery details.\n\nThank you`);

  return (
    <>
      <Helmet>
        <title>{product.name} | Bohra Collection</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="pt-24 min-h-screen bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm font-body text-cream-500 mb-8">
            <Link to="/" className="hover:text-gold-600 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/products" className="hover:text-gold-600 transition-colors">Products</Link>
            <ChevronRight size={12} />
            <Link to={`/products?category=${product.category}`} className="hover:text-gold-600 transition-colors capitalize">{product.category}</Link>
            <ChevronRight size={12} />
            <span className="text-navy-600 line-clamp-1">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative aspect-[3/4] bg-cream-100 overflow-hidden border border-cream-200">
                {!imgError ? (
                  <img src={product.images?.[activeImg]} alt={product.name}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl text-cream-400">👗</div>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-navy-900/50 flex items-center justify-center">
                    <span className="bg-navy-900 text-cream-200 font-body font-bold px-6 py-3 uppercase tracking-widest">Out of Stock</span>
                  </div>
                )}
                {product.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-gold-500 text-navy-900 text-xs font-body font-bold px-3 py-1 uppercase tracking-widest">Featured</span>
                  </div>
                )}
              </motion.div>
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 mt-3">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-16 h-16 border-2 overflow-hidden transition-all ${i === activeImg ? 'border-gold-500' : 'border-cream-200'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <div className="text-gold-600 text-xs font-body uppercase tracking-widest mb-2 capitalize">{product.category}</div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 mb-3">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="font-serif text-3xl font-bold text-navy-900">₹{product.price.toLocaleString('en-IN')}</span>
                {product.views > 0 && (
                  <span className="flex items-center gap-1 text-cream-500 text-sm font-body">
                    <Eye size={14} /> {product.views} views
                  </span>
                )}
              </div>
              <div className="w-12 h-0.5 bg-gold-500 mb-5" />
              <p className="text-navy-600 font-body leading-relaxed mb-6">{product.description}</p>

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <p className="font-body text-sm font-bold text-navy-800 uppercase tracking-wider mb-3">
                    Select Size: <span className="text-gold-600 font-normal normal-case tracking-normal">{selectedSize}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(s => (
                      <button key={s} onClick={() => setSelectedSize(s)}
                        className={`px-4 py-2 border font-body text-sm transition-all duration-200 ${
                          selectedSize === s ? 'bg-navy-900 text-gold-400 border-navy-900' : 'border-cream-300 text-navy-700 hover:border-navy-700'
                        }`}>{s}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery note */}
              <div className="bg-cream-100 border-l-4 border-gold-500 p-4 mb-6">
                <div className="flex items-center gap-2 text-navy-700 text-sm font-body">
                  <Truck size={16} className="text-gold-600 shrink-0" />
                  <span>{product.deliveryNote || 'Contact us for delivery details'}</span>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                <a href={`https://wa.me/${PHONE}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                  className="btn-whatsapp w-full justify-center py-4 text-sm">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Order via WhatsApp {selectedSize && `(Size: ${selectedSize})`}
                </a>
                <div className="grid grid-cols-2 gap-3">
                  <a href={`mailto:${EMAIL}?subject=${emailSubject}&body=${emailBody}`}
                    className="btn-outline flex items-center justify-center gap-2 py-3">
                    <Mail size={16} /> Email Order
                  </a>
                  <a href={`tel:${PHONE}`}
                    className="btn-outline flex items-center justify-center gap-2 py-3">
                    <Phone size={16} /> Call Us
                  </a>
                </div>
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-cream-200">
                {[
                  { icon: <Package size={14} />, text: 'Premium Packaging' },
                  { icon: <Truck size={14} />, text: 'Fast Delivery' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-navy-600 text-xs font-body">
                    <span className="text-gold-500">{item.icon}</span> {item.text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <section className="mt-20">
              <h2 className="font-serif text-2xl font-bold text-navy-900 mb-2">You May Also Like</h2>
              <div className="w-12 h-0.5 bg-gold-500 mb-8" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
