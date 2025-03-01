const express = require('express');
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.post('/add', addToCart);
router.get('/', getCart);
router.post('/remove', removeFromCart);

module.exports = router;