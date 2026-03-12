import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebase.js';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, increment, serverTimestamp, query, orderBy, onSnapshot
} from 'firebase/firestore';
import { trackProductView } from '../services/analyticsService.js';
import toast from 'react-hot-toast';

const ProductsContext = createContext(null);

const DEMO_PRODUCTS = [
  { id: '1', name: 'Classic White Kurta', category: 'men', price: 1299, description: 'Elegant white kurta crafted from premium cotton, perfect for daily wear and special occasions.', images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&q=80'], sizes: ['S','M','L','XL','XXL'], featured: true, views: 0, createdAt: new Date().toISOString(), inStock: true, deliveryNote: 'Available for local & outstation delivery' },
  { id: '2', name: 'Bohra Topi - Premium', category: 'accessories', price: 599, description: 'Traditional Bohra topi handcrafted with finest embroidered fabric.', images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&q=80'], sizes: ['One Size','S','M','L'], featured: true, views: 0, createdAt: new Date().toISOString(), inStock: true, deliveryNote: 'Lightweight - ships anywhere' },
  { id: '3', name: 'Silk Rida - Royal Blue', category: 'women', price: 3499, description: 'Luxurious silk rida in royal blue with gold zari border.', images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&q=80'], sizes: ['S','M','L','XL'], featured: true, views: 0, createdAt: new Date().toISOString(), inStock: true, deliveryNote: 'Free local delivery on orders above ₹2000' },
  { id: '4', name: 'Sherwani - Midnight Black', category: 'men', price: 5999, description: 'Majestic black sherwani with gold embroidery, perfect for weddings.', images: ['https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&q=80'], sizes: ['S','M','L','XL','XXL'], featured: false, views: 0, createdAt: new Date().toISOString(), inStock: true, deliveryNote: 'Pan-India delivery for orders above ₹3000' },
  { id: '5', name: 'Embroidered Rida - Cream', category: 'women', price: 2799, description: 'Classic cream rida with delicate hand embroidery.', images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b4ae4?w=500&q=80'], sizes: ['S','M','L','XL'], featured: true, views: 0, createdAt: new Date().toISOString(), inStock: true, deliveryNote: 'Available for local & outstation delivery' },
  { id: '6', name: 'Prayer Beads - Sandalwood', category: 'accessories', price: 299, description: 'Authentic sandalwood tasbih with 99 beads.', images: ['https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=500&q=80'], sizes: ['One Size'], featured: false, views: 0, createdAt: new Date().toISOString(), inStock: true, deliveryNote: 'Ships anywhere in India' },
  { id: '7', name: 'Bandhgala Suit - Navy', category: 'men', price: 4499, description: 'Premium navy bandhgala suit with subtle texture.', images: ['https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&q=80'], sizes: ['S','M','L','XL','XXL'], featured: false, views: 0, createdAt: new Date().toISOString(), inStock: false, deliveryNote: 'Currently out of stock' },
  { id: '8', name: 'Attar Collection - 3pc Set', category: 'accessories', price: 899, description: 'Exquisite collection of three traditional attars: Oud, Rose, and Amber.', images: ['https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=500&q=80'], sizes: ['Standard'], featured: true, views: 0, createdAt: new Date().toISOString(), inStock: true, deliveryNote: 'Ships anywhere in India' },
  { id: '9', name: 'Girls Rida - Pink Floral', category: 'women', price: 1599, description: 'Adorable pink floral rida for young girls.', images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&q=80'], sizes: ['2-4Y','4-6Y','6-8Y','8-10Y'], featured: false, views: 0, createdAt: new Date().toISOString(), inStock: true, deliveryNote: 'Free local delivery available' },
];

export function ProductsProvider({ children }) {
  const [products, setProducts]   = useState(DEMO_PRODUCTS);
  const [loading, setLoading]     = useState(true);
  const [usingFirestore, setUsingFirestore] = useState(false);

  useEffect(() => {
    let unsub;
    const init = async () => {
      try {
        // Try real-time Firestore listener
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        unsub = onSnapshot(q, (snap) => {
          if (!snap.empty) {
            const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setProducts(items);
            setUsingFirestore(true);
          } else {
            // Firestore connected but empty — seed demo products
            seedDemoProducts();
          }
          setLoading(false);
        }, (err) => {
          console.warn('Firestore snapshot error, using demo data:', err.message);
          setLoading(false);
        });
      } catch (e) {
        console.warn('Firestore unavailable, using demo data:', e.message);
        setLoading(false);
      }
    };
    init();
    return () => unsub?.();
  }, []);

  const seedDemoProducts = async () => {
    try {
      for (const p of DEMO_PRODUCTS) {
        const { id, ...data } = p;
        await addDoc(collection(db, 'products'), {
          ...data,
          createdAt: serverTimestamp(),
          views: 0,
        });
      }
    } catch (e) {
      console.warn('Could not seed products:', e.message);
    }
  };

  const addProduct = async (data) => {
    try {
      if (usingFirestore) {
        await addDoc(collection(db, 'products'), {
          ...data, createdAt: serverTimestamp(), views: 0,
        });
        // snapshot listener will update state automatically
      } else {
        setProducts(prev => [{ ...data, id: Date.now().toString(), createdAt: new Date().toISOString(), views: 0 }, ...prev]);
      }
      toast.success('Product added!');
    } catch (e) { toast.error('Failed to add product'); throw e; }
  };

  const updateProduct = async (id, updates) => {
    try {
      if (usingFirestore) {
        await updateDoc(doc(db, 'products', id), updates);
      } else {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      }
      toast.success('Product updated!');
    } catch (e) { toast.error('Failed to update'); throw e; }
  };

  const deleteProduct = async (id) => {
    try {
      if (usingFirestore) {
        await deleteDoc(doc(db, 'products', id));
      } else {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
      toast.success('Product deleted');
    } catch (e) { toast.error('Failed to delete'); throw e; }
  };

  const incrementViews = async (id) => {
    try {
      const product = products.find(p => p.id === id);
      if (!product) return;

      // Track in Firestore analytics
      await trackProductView(id, product.name, product.category);

      // Also increment on the product document itself
      if (usingFirestore) {
        await updateDoc(doc(db, 'products', id), { views: increment(1) });
      } else {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, views: (p.views || 0) + 1 } : p));
      }
    } catch (e) { /* silent — non-critical */ }
  };

  return (
    <ProductsContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct, incrementViews, usingFirestore }}>
      {children}
    </ProductsContext.Provider>
  );
}

export const useProducts = () => useContext(ProductsContext);