import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-cream-200 bg-texture">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-full border-2 border-gold-400 flex items-center justify-center overflow-hidden" style={{background:'#f5f0e0'}}>
                <img src="/logo.png" alt="Bohra Collection Logo" className="w-full h-full object-contain" style={{padding:'2px'}} />
              </div>
              <div>
                <div className="text-gold-400 font-serif font-bold text-lg">Bohra Collection</div>
                <div className="text-cream-400 text-sm font-arabic">٧٨٦</div>
              </div>
            </div>
            <p className="text-cream-400 text-sm font-body leading-relaxed">
              Premium Islamic & traditional clothing for the discerning Bohra community. Crafted with love, tradition, and excellence.
            </p>
            <div className="flex gap-4 mt-5">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 border border-cream-600 flex items-center justify-center hover:border-gold-400 hover:text-gold-400 transition-colors">
                <Instagram size={14} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 border border-cream-600 flex items-center justify-center hover:border-gold-400 hover:text-gold-400 transition-colors">
                <Facebook size={14} />
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 border border-cream-600 flex items-center justify-center hover:border-gold-400 hover:text-gold-400 transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-gold-400 font-semibold text-lg mb-5">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/products?category=men', label: "Men's Collection" },
                { to: '/products?category=women', label: "Women's Collection" },
                { to: '/products?category=accessories', label: 'Accessories' },
                { to: '/products', label: 'All Products' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-cream-400 hover:text-gold-400 transition-colors text-sm font-body flex items-center gap-2">
                    <span className="text-gold-600 text-xs">›</span> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Delivery Info */}
          <div>
            <h3 className="font-serif text-gold-400 font-semibold text-lg mb-5">Delivery Info</h3>
            <div className="space-y-3 text-sm font-body text-cream-400">
              <div className="border-l-2 border-gold-600 pl-3">
                <p className="text-cream-200 font-semibold">Small Orders</p>
                <p>Delivery within local city area only</p>
              </div>
              <div className="border-l-2 border-gold-400 pl-3">
                <p className="text-cream-200 font-semibold">Large Orders (₹2000+)</p>
                <p>Pan-India delivery available</p>
              </div>
              <div className="border-l-2 border-green-500 pl-3">
                <p className="text-cream-200 font-semibold">Free Local Delivery</p>
                <p>On all orders above ₹2000</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-gold-400 font-semibold text-lg mb-5">Contact Us</h3>
            <div className="space-y-3">
              <a href="tel:+919876543210" className="flex items-center gap-3 text-cream-400 hover:text-gold-400 transition-colors group">
                <Phone size={15} className="text-gold-500 group-hover:text-gold-400 shrink-0" />
                <span className="text-sm font-body">+91 98765 43210</span>
              </a>
              <a href="mailto:info@bohracollection.com" className="flex items-center gap-3 text-cream-400 hover:text-gold-400 transition-colors group">
                <Mail size={15} className="text-gold-500 group-hover:text-gold-400 shrink-0" />
                <span className="text-sm font-body">info@bohracollection.com</span>
              </a>
              <div className="flex items-start gap-3 text-cream-400">
                <MapPin size={15} className="text-gold-500 shrink-0 mt-0.5" />
                <span className="text-sm font-body">Bohri Mohalla, Mumbai<br />Maharashtra, India</span>
              </div>
              <a href="https://wa.me/919876543210?text=Hi! I'm interested in Bohra Collection products."
                target="_blank" rel="noopener noreferrer"
                className="btn-whatsapp inline-flex mt-2 text-xs">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-navy-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-cream-500 text-xs font-body text-center">
            © 2025 Bohra Collection. All rights reserved. ٧٨٦
          </p>
          <p className="text-cream-600 text-xs font-body">
            Built with ❤️ for the Bohra Community
          </p>
        </div>
      </div>
    </footer>
  );
}
