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

    // Ensure that the category exists
    const category = await Category.findOne({ name: categoryName }).session(session);
    if (!category) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Ensure that the user exists
    const user = await User.findById(userId).session(session);
    if (!user) {
      return res.status(400).json({ message: 'Invalid user' });
    }

    // Create the product
    const product = new Product({
      name,
      description,
      price,
      category: category._id,
      negotiable,
      user: user._id,
    });
    await product.save({ session });

    // Create associated images
    const imageDocs = images.map(imageUrl => ({
      url: imageUrl,
      product: product._id,
    }));
    const createdImages = await Image.insertMany(imageDocs, { session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ product, images: createdImages });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
});


router.get('/items', async (req, res) => {
  try {
    const products = await Product.find().populate('category').populate('user').exec();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

//get a single product
router.get('/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    // Find the product by its ID and populate the category and user fields
    const product = await Product.findById(productId)
      .populate('category')
      .populate('user', 'name') // Populate user field with 'name' only
      .exec();

    // If product is found, return it
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


// Route to get products by category name
router.get('/category/:categoryName', async (req, res) => {
  const categoryName = req.params.categoryName;

  try {
    // Find the category by name
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    // Use the category's ID to find products
    const products = await Product.find({ category: category._id }).populate('category').exec();

    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products found for this category.' });
    }

    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports = router;
