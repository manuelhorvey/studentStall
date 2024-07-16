const express = require('express');
const Category = require('../models/category'); // Importing the Category model
const { verifyToken } = require('./tokenValidation.js');
const router = express.Router();

// Create Category
router.post('/', verifyToken, async (req, res) => {
  const { name } = req.body;

  // Validate category name
  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  try {
    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    // Create a new category
    const newCategory = new Category({ name });
    await newCategory.save();

    res.status(201).json(newCategory); // Respond with the created category
  } catch (error) {
    console.error('Failed to create category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Get all categories
router.get('/getall', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories); // Respond with all categories
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;
