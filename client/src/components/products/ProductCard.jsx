import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Phone, Mail } from 'lucide-react';

const CONTACT = {
  phone: '+919876543210',
  email: 'info@bohracollection.com',
};

export default function ProductCard({ product, index = 0 }) {
  const [imgError, setImgError] = useState(false);

  const waMessage = encodeURIComponent(
    `Hi! I'm interested in *${product.name}* (₹${product.price.toLocaleString('en-IN')}). Please share more details.`
  );
  const emailSubject = encodeURIComponent(`Inquiry: ${product.name}`);
  const emailBody = encodeURIComponent(`Hello,\n\nI am interested in ${product.name} priced at ₹${product.price}.\nPlease provide more details.\n\nThank you`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="product-card"
    >
      {/* Image */}
      <Link to={`/products/${product.id}`} className="block relative overflow-hidden aspect-[3/4]">
        {!imgError ? (
          <img
            src={product.images?.[0]}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-cream-100 flex flex-col items-center justify-center text-cream-400">
            <div className="text-5xl mb-2">👗</div>
            <span className="text-xs font-body">Bohra Collection</span>
          </div>
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/20 transition-all duration-500" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.featured && (
            <span className="bg-gold-500 text-navy-900 text-xs font-body font-bold px-2 py-0.5 uppercase tracking-wider">Featured</span>
          )}
          {!product.inStock && (
            <span className="bg-navy-800/90 text-cream-300 text-xs font-body px-2 py-0.5 uppercase tracking-wider">Out of Stock</span>
          )}
        </div>

        {/* Category badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-navy-900/80 text-gold-400 text-xs font-body px-2 py-0.5 capitalize">
            {product.category}
          </span>
        </div>

        {/* View button on hover */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <span className="bg-gold-500 text-navy-900 text-xs font-body font-bold px-4 py-2 flex items-center gap-2 uppercase tracking-wider">
            <Eye size={12} /> Quick View
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-serif font-semibold text-navy-900 text-base leading-tight hover:text-gold-700 transition-colors mb-1 line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-cream-600 text-xs font-body leading-relaxed line-clamp-2 mb-3">{product.description}</p>

        {/* Sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.sizes.slice(0, 4).map(s => (
              <span key={s} className="border border-cream-300 text-navy-700 text-xs font-body px-1.5 py-0.5">{s}</span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-cream-500 text-xs font-body py-0.5">+{product.sizes.length - 4}</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-serif text-xl font-bold text-navy-900">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.views > 0 && (
            <span className="text-cream-400 text-xs font-body flex items-center gap-1">
              <Eye size={10} /> {product.views}
            </span>
          )}
        </div>

        {/* Contact Buttons */}
        <div className="flex gap-2">
          <a
            href={`https://wa.me/${CONTACT.phone}?text=${waMessage}`}
            target="_blank" rel="noopener noreferrer"
            className="btn-whatsapp flex-1 justify-center py-2 text-xs"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Order
          </a>
          <a href={`tel:${CONTACT.phone}`}
            className="w-9 h-9 border border-navy-300 flex items-center justify-center text-navy-700 hover:bg-navy-800 hover:text-cream-100 hover:border-navy-800 transition-all duration-200">
            <Phone size={14} />
          </a>
          <a href={`mailto:${CONTACT.email}?subject=${emailSubject}&body=${emailBody}`}
            className="w-9 h-9 border border-navy-300 flex items-center justify-center text-navy-700 hover:bg-navy-800 hover:text-cream-100 hover:border-navy-800 transition-all duration-200">
            <Mail size={14} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
