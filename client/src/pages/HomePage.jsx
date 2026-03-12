import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Truck, Shield, Phone, Star, Package, MapPin, Mail } from "lucide-react";
import ProductCard from '../components/products/ProductCard';
import { useProducts } from '../context/ProductsContext';

// ── Real Logo Image ────────────────────

function HeroSection() {
  return (
    <section className="relative min-h-screen bg-navy-900 overflow-hidden flex items-center">
      <div className="absolute inset-0 bg-texture opacity-50" />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 70% 50%, rgba(212,160,23,0.08) 0%, transparent 70%)'
      }} />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gold-700/20 translate-x-1/2" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-gold-600/20 translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block text-gold-400 font-arabic text-2xl tracking-widest mb-3">٧٨٦</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-5xl md:text-7xl font-bold text-cream-100 leading-tight mb-6">
              Premium<br />
              <span className="text-gradient-gold">Bohra</span><br />
              Collection
            </motion.h1>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="w-20 h-0.5 bg-gold-500 mb-6" />

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
              className="text-cream-300 font-body text-lg leading-relaxed mb-10 max-w-lg">
              Discover exquisite traditional and contemporary Islamic clothing. Handcrafted with precision — for the discerning Bohra family.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-gold flex items-center gap-2">
                Shop Collection <ChevronRight size={16} />
              </Link>
              <a href="https://wa.me/919876543210?text=Hi! I'd like to explore Bohra Collection."
                target="_blank" rel="noopener noreferrer"
                className="btn-whatsapp">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.7 }}
              className="flex gap-8 mt-12 pt-10 border-t border-navy-700">
              {[['500+', 'Products'], ['5000+', 'Happy Customers'], ['10+', 'Years of Trust']].map(([num, label]) => (
                <div key={label}>
                  <div className="text-gold-400 font-serif font-bold text-2xl">{num}</div>
                  <div className="text-cream-400 text-xs font-body uppercase tracking-wider">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Real Logo Display */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.3 }}
            className="hidden lg:flex justify-center items-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gold-500/10 blur-3xl" />
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[-20px] rounded-full border border-dashed border-gold-500/30" />
              <div className="relative shadow-2xl rounded-full overflow-hidden" style={{width:288, height:288, background:'#f5f0e0'}}>
                <img src="/logo.png" alt="Bohra Collection" className="w-full h-full object-contain" style={{padding:'6px'}} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gold-400/50 rounded-full flex items-center justify-center">
          <div className="w-1 h-3 bg-gold-400 rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}

function CategorySection() {
  const categories = [
    { id: 'men', title: "Men's", subtitle: 'Kurtas, Sherwanis, Topi', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80', color: 'from-navy-900/80' },
    { id: 'women', title: "Women's", subtitle: 'Ridas, Salwar, Abayas', img: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80', color: 'from-navy-800/80' },
    { id: 'accessories', title: 'Accessories', subtitle: 'Topi, Attar, Tasbih', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80', color: 'from-navy-900/80' },
  ];

  return (
    <section className="py-20 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-gold-600 font-body text-xs uppercase tracking-widest ornament">Our Collections</span>
          <h2 className="section-title mt-2">Shop by Category</h2>
          <div className="gold-divider" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }}>
              <Link to={`/products?category=${cat.id}`} className="relative block overflow-hidden h-80 group cursor-pointer">
                <img src={cat.img} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} to-transparent`} />
                <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/30 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-cream-100 font-serif text-2xl font-bold leading-tight">{cat.title}</h3>
                  <p className="text-gold-300 text-sm font-body mt-1">{cat.subtitle}</p>
                  <div className="flex items-center gap-2 mt-3 text-gold-400 text-xs font-body uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts({ products }) {
  const featured = products.filter(p => p.featured).slice(0, 4);
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-gold-600 font-body text-xs uppercase tracking-widest ornament">Handpicked for You</span>
          <h2 className="section-title mt-2">Featured Products</h2>
          <div className="gold-divider" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
        <div className="text-center mt-12">
          <Link to="/products" className="btn-outline">View All Products</Link>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="py-20 bg-navy-900 bg-texture relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(212,160,23,0.06) 0%, transparent 70%)' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span className="text-gold-400 font-body text-xs uppercase tracking-widest ornament">Our Story</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-cream-100 mt-3 mb-6 leading-tight">
              Rooted in Tradition,<br /><span className="text-gradient-gold">Crafted with Love</span>
            </h2>
            <div className="w-16 h-0.5 bg-gold-500 mb-6" />
            <p className="text-cream-300 font-body leading-relaxed mb-4">
              Bohra Collection was born from a deep reverence for the rich cultural heritage of the Dawoodi Bohra community. For over a decade, we have been curating the finest traditional attire — from the quintessential white kurta to the most elaborate wedding sherwanis.
            </p>
            <p className="text-cream-400 font-body leading-relaxed mb-8">
              Every piece in our collection is carefully selected for quality, authenticity, and elegance. We source fabrics from trusted weavers and employ skilled artisans who understand the nuances of Bohra craftsmanship.
            </p>
            <div className="grid grid-cols-3 gap-6 py-6 border-y border-navy-700">
              {[['Premium', 'Quality Fabrics'], ['Authentic', 'Traditional Design'], ['Community', 'Trusted Brand']].map(([h, s]) => (
                <div key={h} className="text-center">
                  <div className="text-gold-400 font-serif font-bold text-lg">{h}</div>
                  <div className="text-cream-500 text-xs font-body mt-1">{s}</div>
                </div>
              ))}
            </div>
            <Link to="/products" className="btn-gold inline-flex mt-8 items-center gap-2">
              Explore Collection <ChevronRight size={16} />
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
            <div className="relative">
              <div className="grid grid-cols-2 gap-3">
                {[
                  'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=300&q=80',
                  'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=300&q=80',
                  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&q=80',
                  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&q=80',
                ].map((src, i) => (
                  <div key={i} className={`overflow-hidden ${i === 0 ? 'col-span-2 h-52' : 'h-36'}`}>
                    <img src={src} alt="Bohra Collection" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
              <div className="absolute -bottom-4 -right-4 bg-gold-500 text-navy-900 p-5 text-center">
                <div className="font-serif text-2xl font-bold">10+</div>
                <div className="text-xs font-body font-bold uppercase tracking-wider">Years of<br/>Excellence</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function DeliverySection() {
  const rules = [
    { icon: <Package className="text-gold-500" size={24} />, title: 'Small Orders', sub: '(Under ₹2,000)', desc: 'Delivery available within our local city area. Pickup also available from our store.', color: 'border-gold-300' },
    { icon: <Truck className="text-green-400" size={24} />, title: 'Large Orders', sub: '(Above ₹2,000)', desc: 'Pan-India delivery available via courier. Free delivery within city limits.', color: 'border-green-400' },
    { icon: <Shield className="text-blue-400" size={24} />, title: 'Safe Packaging', sub: 'Always', desc: 'Premium packaging to ensure your garments arrive in perfect condition.', color: 'border-blue-400' },
  ];

  return (
    <section className="py-20 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-gold-600 font-body text-xs uppercase tracking-widest ornament">Shipping Policy</span>
          <h2 className="section-title mt-2">Delivery Information</h2>
          <div className="gold-divider" />
          <p className="text-navy-600 font-body mt-4 max-w-xl mx-auto">We want your shopping experience to be seamless. Here's everything you need to know about our delivery.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {rules.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`bg-white border-t-4 ${r.color} p-8 shadow-sm hover:shadow-xl transition-shadow duration-300`}>
              <div className="mb-4">{r.icon}</div>
              <h3 className="font-serif text-xl font-semibold text-navy-900">{r.title}</h3>
              <p className="text-gold-600 text-sm font-body mb-3">{r.sub}</p>
              <p className="text-navy-600 text-sm font-body leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="py-20 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-gold-600 font-body text-xs uppercase tracking-widest ornament">Get in Touch</span>
          <h2 className="section-title mt-2">Place Your Order</h2>
          <div className="gold-divider" />
          <p className="text-navy-600 font-body mt-4 max-w-xl mx-auto">
            We don't have a cart system — just reach out directly! We're happy to help you find the perfect piece.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-500"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
              title: 'WhatsApp', detail: '+91 98765 43210',
              action: 'https://wa.me/919876543210?text=Hi! I want to order from Bohra Collection.',
              label: 'Chat Now', bg: 'bg-green-50 hover:bg-green-100 border-green-200'
            },
            {
              icon: <Mail className="w-8 h-8 text-navy-600" />,
              title: 'Email Us', detail: 'info@bohracollection.com',
              action: 'mailto:info@bohracollection.com?subject=Order Inquiry',
              label: 'Send Email', bg: 'bg-navy-50 hover:bg-navy-100 border-navy-200'
            },
            {
              icon: <Phone className="w-8 h-8 text-gold-600" />,
              title: 'Call Us', detail: '+91 98765 43210',
              action: 'tel:+919876543210',
              label: 'Call Now', bg: 'bg-gold-50 hover:bg-gold-100 border-gold-200'
            },
          ].map((c, i) => (
            <motion.a key={i} href={c.action} target={c.action.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`border ${c.bg} p-8 text-center transition-all duration-300 block group`}>
              <div className="flex justify-center mb-4">{c.icon}</div>
              <h3 className="font-serif text-lg font-semibold text-navy-900 mb-1">{c.title}</h3>
              <p className="text-navy-500 text-sm font-body mb-4">{c.detail}</p>
              <span className="inline-block btn-gold text-xs py-2 px-4">{c.label}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const { products } = useProducts();
  return (
    <>
      <Helmet>
        <title>Bohra Collection | 786 - Premium Islamic Clothing</title>
        <meta name="description" content="Shop premium Islamic and traditional Bohra clothing. Men's kurtas, women's ridas, accessories and more." />
      </Helmet>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts products={products} />
      <AboutSection />
      <DeliverySection />
      <ContactSection />
    </>
  );
}
