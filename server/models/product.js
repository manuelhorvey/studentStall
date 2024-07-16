const mongoose = require('mongoose');

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  negotiable: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Unique index on product name and category
productSchema.index({ name: 1, category: 1 }, { unique: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;
