const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user.js');
const { sendVerificationEmail } = require('../utils/email.js');
const { verifyToken } = require('./tokenValidation.js');

const router = express.Router();

// User Registration Route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists. Please use a different email address.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken
    });
    await user.save();

    const link = `${process.env.FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(email, link); 

    return res.status(201).json({ message: 'User created successfully. Please check your email to verify your account.' });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: error.message });
  }
});


// Email Verification
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'No token provided' });
  }

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    if (user.verificationTokenExpiry && user.verificationTokenExpiry < Date.now()) {
      return res.status(400).json({ error: 'Verification token has expired' });
    }

    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;

    await user.save();

    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying email:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    if (!user.verified) {
      return res.status(403).json({ error: 'Please verify your email before logging in' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      message: 'Login successful',
      token,
      refreshToken
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ error: 'An error occurred while logging in' });
  }
});


router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const newToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      token: newToken
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    return res.status(403).json({ error: 'Invalid refresh token' });
  }
});


// User Logout
router.post('/signout', verifyToken, async (req, res) => {
  try {    
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error logging out:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// Fetch User Details
router.get('/user', verifyToken, async (req, res) => {
  try {
    const userId = req.userId; // Use extracted user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract email and name from user document
    const { email, name } = user;
    res.json({ email, name });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
