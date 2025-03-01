const User = require('../models/User');
const axios = require('axios');

// Add a product from FakeStoreAPI to the user's cart
const addToCart = async (req, res) => {
    const { productId } = req.body; // Use productId instead of id for clarity
    try {
        // Fetch the product from FakeStoreAPI
        const response = await axios.get(`https://fakestoreapi.com/products/${productId}`);
        const product = response.data;

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found in FakeStoreAPI' });
        }

        // Find the user
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if the product is already in the cart
        const isProductInCart = user.cart.some(item => item.id === product.id);
        if (isProductInCart) {
            return res.status(400).json({ success: false, message: 'Product already in cart' });
        }

        // Add the product to the cart
        user.cart.push(product);
        await user.save();

        res.status(200).json({ success: true, message: 'Product added to cart', cart: user.cart });
    } catch (error) {
        console.error('Error adding to cart:', error.message);
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ success: false, message: 'Product not found in FakeStoreAPI' });
        }
        res.status(500).json({ success: false, message: 'Failed to add product to cart', error: error.message });
    }
};

// Get the user's cart
const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, cart: user.cart });
    } catch (error) {
        console.error('Error fetching cart:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch cart', error: error.message });
    }
};

// Remove a product from the user's cart
const removeFromCart = async (req, res) => {
    const { productId } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Find the product in the cart
        const productIndex = user.cart.findIndex(item => item.id === productId);
        if (productIndex === -1) {
            return res.status(404).json({ success: false, message: 'Product not found in cart' });
        }

        // Remove the product from the cart
        user.cart.splice(productIndex, 1);
        await user.save();

        res.status(200).json({ success: true, message: 'Product removed from cart', cart: user.cart });
    } catch (error) {
        console.error('Error removing from cart:', error.message);
        res.status(500).json({ success: false, message: 'Failed to remove product from cart', error: error.message });
    }
};

module.exports = { addToCart, getCart, removeFromCart };