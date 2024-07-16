const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Enhanced email regex pattern
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: emailPattern },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  verificationToken: { type: String },
  reset_OTP: { type: Number },
  reset_OTP_expiry: { type: Date },
}, { timestamps: true });

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
}, { timestamps: true });


// Image Schema
const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  altText: { type: String },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
}, { timestamps: true });


// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  negotiable: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Unique index on product name and category
productSchema.index({ name: 1, category: 1 }, { unique: true });


const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Image = mongoose.models.Image || mongoose.model('Image', imageSchema);
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = {
  User,
  Category,
  Product,
  Image,
  Message
};
