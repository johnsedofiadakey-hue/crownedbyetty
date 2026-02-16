const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');

// GET all reviews (for /reviews page)
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find({ isVisible: true })
            .populate('product', 'name image')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET reviews for a specific product
router.get('/product/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId, isVisible: true })
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new review
router.post('/', async (req, res) => {
    const { productId, user, rating, comment } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const review = new Review({
            product: productId,
            user,
            rating,
            comment
        });

        const newReview = await review.save();
        res.status(201).json(newReview);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
