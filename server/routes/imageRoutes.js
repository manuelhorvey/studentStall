const express = require('express');
const router = express.Router();
const fs = require('fs');
const Product = require('../models/product');
const Image = require('../models/imagE');


router.get('/:productId', async (req, res) => {
  const productId = req.params.productId;

  try {
    const images = await Image.find({ product: productId });
    res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Route to fetch products with images for a specific category
router.get('/products/:categoryName', async (req, res) => {
  const { categoryName } = req.params;

  try {
    // Find the category by name
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Find products for the category
    const products = await Product.find({ category: category._id });

    res.status(200).json({ category: categoryName, products });
  } catch (error) {
    console.error(`Failed to fetch products for category ${categoryName}:`, error);
    res.status(500).json({ error: `Failed to fetch products for category ${categoryName}` });
  }
});

// Route to get images for a specific product
router.get('/:productId/images', async (req, res) => {
  const { productId } = req.params;

  try {
    // Find images for the specified product
    const images = await Image.find({ product: productId });

    res.status(200).json(images);
  } catch (error) {
    console.error(`Failed to fetch images for product ${productId}:`, error);
    res.status(500).json({ error: `Failed to fetch images for product ${productId}` });
  }
});

// Route to delete an image
router.delete('/:imageId', async (req, res) => {
  const imageId = req.params.imageId;

  try {
    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete image file (assuming you stored the file path in url field)
    fs.unlinkSync(image.url);

    // Delete image document
    await image.remove();

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

module.exports = router;
