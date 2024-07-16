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
  reset_OTP_expiry: { type: Date }
}, { timestamps: true });

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
