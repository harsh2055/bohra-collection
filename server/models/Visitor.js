import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  ip: String,
  userAgent: String,
  page: String,
  referrer: String,
  country: String,
  timestamp: { type: Date, default: Date.now },
});

visitorSchema.index({ timestamp: -1 });
visitorSchema.index({ page: 1 });

export default mongoose.model('Visitor', visitorSchema);
