const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');
const Category = require('../models/category');
const Product = require('../models/product');
const Image = require('../models/imagE');

const router = express.Router();

// Create a new product
router.post('/additem', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, description, price, category: categoryName, negotiable, user: userId, images } = req.body;

    // Ensure category exists
    const category = await Category.findOne({ name: categoryName }).session(session);
    if (!category) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Ensure user exists
    const user = await User.findById(userId).session(session);
    if (!user) {
      return res.status(400).json({ message: 'Invalid user' });
    }

    // Create product
    const product = new Product({
      name,
      description,
      price,
      category: category._id,
      negotiable,
      user: user._id,
    });
    await product.save({ session });

    // Create images
    const imageDocs = images.map(imageUrl => ({
      url: imageUrl,
      product: product._id,
    }));
    const createdImages = await Image.insertMany(imageDocs, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ product, images: createdImages });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
});


// Get products with optional search and pagination
router.get('/items', async (req, res) => {
  try {
    const { search, page = 1, limit = 6 } = req.query;
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const totalItems = await Product.countDocuments(query).exec();
    const products = await Product.find(query)
      .populate('category')
      .populate('user')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .exec();

    res.status(200).json({ items: products, totalItems });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});


// Get a single product
router.get('/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId)
      .populate('category')
      .populate('user', 'name')
      .exec();

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error retrieving product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Get products by category name
router.get('/category/:categoryName', async (req, res) => {
  const categoryName = req.params.categoryName;
  const { search = '', page = 1, limit = 6 } = req.query;

  try {
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    const query = { category: category._id };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const totalItems = await Product.countDocuments(query).exec();

    const products = await Product.find(query)
      .populate('category')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .exec();

    res.status(200).json({ items: products, totalItems });
  } catch (err) {
    console.error('Error fetching products by category:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});




module.exports = router;
