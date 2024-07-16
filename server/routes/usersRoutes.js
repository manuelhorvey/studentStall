const express = require('express');
const User = require('../models/user');
const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ users }); 
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

module.exports = router;
