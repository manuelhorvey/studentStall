const mongoose = require('mongoose');

// Image Schema
const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  altText: { type: String },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
}, { timestamps: true });

const Image = mongoose.models.Image || mongoose.model('Image', imageSchema);

module.exports = Image;
