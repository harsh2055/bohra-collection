import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ['men', 'women', 'accessories'] },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, trim: true },
  images: [{ type: String }],
  sizes: [{ type: String }],
  featured: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
  deliveryNote: { type: String },
  views: { type: Number, default: 0 },
  tags: [{ type: String }],
}, { timestamps: true });

productSchema.index({ category: 1, price: 1 });
productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
