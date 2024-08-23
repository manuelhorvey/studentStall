const mongoose = require('mongoose');

// Image Schema
const imageSchema = new mongoose.Schema({
  url: { 
    type: String, 
    required: true,
  },
  altText: { type: String, default: 'Image' },
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true,
    index: true
  },
}, { timestamps: true });

const Image = mongoose.models.Image || mongoose.model('Image', imageSchema);

module.exports = Image;
