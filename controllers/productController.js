const Product = require('../models/Product');
const axios = require('axios');

// Fetch all products from FakeStoreAPI
const getProducts = async (req, res) => {
    try {
        // Fetch products from FakeStoreAPI
        const response = await axios.get('https://fakestoreapi.com/products');
        const products = response.data;

        // Optional: Validate or filter products before saving
        const validProducts = products.filter(product => product.title && product.price);

        // Save products to the database
        await Product.insertMany(validProducts);

        res.status(200).json({ success: true, data: validProducts });
    } catch (error) {
        console.error('Error fetching or saving products:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch or save products', error: error.message });
    }
};

// Fetch a single product by ID from FakeStoreAPI
const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
        const product = response.data;

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error('Error fetching product by ID:', error.message);
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(500).json({ success: false, message: 'Failed to fetch product', error: error.message });
    }
};

module.exports = { getProducts, getProductById };