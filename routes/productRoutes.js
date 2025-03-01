const express = require('express');
const { getProducts, getProductById } = require('../controllers/productController');

const router = express.Router();

// GET /api/products - Fetch all products
router.get('/', getProducts);

// GET /api/products/:id - Fetch a single product by ID
router.get('/:id', getProductById);

module.exports = router;