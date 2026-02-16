const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// @route   POST /api/products
// @desc    Create a new product from Admin Dashboard
router.post('/', async (req, res) => {
    try {
        const { name, price, stock, threshold, description, image, ingredients, howToUse } = req.body;

        const newProduct = new Product({
            name,
            price: Number(price),
            stock: Number(stock),
            threshold: Number(threshold),
            description,
            image, // Path like /products/oil.png
            ingredients,
            howToUse
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        console.error("Product Creation Error:", err.message);
        res.status(500).json({ message: "Failed to create product" });
    }
});

// @route   GET /api/products
// @desc    Fetch all products for Admin Dashboard and Storefront
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Error fetching products" });
    }
});

// @route   GET /api/products/similar/:id
// @desc    Fetch similar products (random selection excluding current)
router.get('/similar/:id', async (req, res) => {
    try {
        const currentProductId = req.params.id;
        // Simple "similar" logic: fetch 3 random products that are NOT the current one
        const similarProducts = await Product.aggregate([
            { $match: { _id: { $ne: new mongoose.Types.ObjectId(currentProductId) } } },
            { $sample: { size: 3 } }
        ]);
        res.json(similarProducts);
    } catch (err) {
        res.status(500).json({ message: "Error fetching similar products" });
    }
});

// @route   GET /api/products/:id
// @desc    Fetch single product details
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: "Error fetching product details" });
    }
});

// @route   PUT /api/products/:id
// @desc    Update product details or manual restock
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: "Update failed" });
    }
});

module.exports = router;