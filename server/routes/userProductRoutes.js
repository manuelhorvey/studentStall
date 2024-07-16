const express = require('express');
const { verifyToken } = require('./tokenValidation.js');
const Product = require('../models/product.js');
const Image = require('../models/imagE.js');

const router = express.Router();

// Get products added by the current user
router.get('/', verifyToken, async (req, res) => {
  try {
    const { userId } = req.query;

    // Find products added by the current user
    const products = await Product.find({ user: userId }).populate('category');

    res.status(200).json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});


//fetch a product added by the user
router.get('/:productId', async (req, res) => {
  const productId = req.params.productId;
  const userId = req.query.userId;

  try {
    const product = await Product.findOne({ _id: productId, user: userId }).populate('category');
    if (!product) {
      return res.status(404).json({ error: 'Product not found or not added by the user' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(`Failed to fetch product ${productId} added by user ${userId}:`, error);
    res.status(500).json({ error: `Failed to fetch product ${productId} added by user ${userId}` });
  }
});

// Update a product for a user
router.put('/:productId', verifyToken, async (req, res) => {
  const productId = req.params.productId;
  const { userId } = req.query;
  const updateData = req.body;

  try {
    const product = await Product.findOneAndUpdate(
      { _id: productId, user: userId },
      updateData,
      { new: true }
    ).populate('category');

    if (!product) {
      return res.status(404).json({ error: 'Product not found or not added by the user' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(`Failed to update product ${productId} added by user ${userId}:`, error);
    res.status(500).json({ error: `Failed to update product ${productId} added by user ${userId}` });
  }
});

// Delete a product and its associated images
router.delete('/:productId', async (req, res) => {
  const productId = req.params.productId;

  try {
    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete images related to the product
    await Image.deleteMany({ product: productId });

    // Delete the product itself
    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: 'Product and related images deleted successfully' });
  } catch (error) {
    console.error(`Failed to delete product ${productId} and related images:`, error);
    res.status(500).json({ error: `Failed to delete product ${productId} and related images` });
  }
});


module.exports = router;
