const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// @route   POST /api/orders
// @desc    Create new order and decrement inventory levels
// @access  Public
router.post('/', async (req, res) => {
    const {
        orderId,
        customer,
        items,
        totalAmount,
        fulfillmentMethod,
        paymentMethod
    } = req.body;

    try {
        // 1. Create the new Order record
        const newOrder = new Order({
            orderId,
            customer,
            items: items.map(item => ({
                productId: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount,
            fulfillmentMethod,
            paymentMethod,
            status: 'Processing',
            paymentStatus: paymentMethod.includes('Paystack') ? 'Pending' : 'Awaiting Confirmation'
        });

        const savedOrder = await newOrder.save();

        // 2. Atomic Inventory Update
        // We use bulkWrite for maximum performance and to ensure 
        // all inventory updates are sent to MongoDB in a single network request.
        const inventoryUpdates = items.map(item => ({
            updateOne: {
                filter: { _id: item.id },
                update: { $inc: { stock: -item.quantity } }
            }
        }));

        await Product.bulkWrite(inventoryUpdates);

        // 3. Response
        res.status(201).json({
            success: true,
            message: "Order placed and inventory updated successfully",
            order: savedOrder
        });

    } catch (err) {
        console.error("CRITICAL ORDER ERROR:", err.message);
        res.status(500).json({
            success: false,
            message: "Server Error: Could not process order or inventory update.",
            error: err.message
        });
    }
});

// @route   GET /api/orders/:orderId
// @desc    Get order details for the Tracking Page
// @access  Public
router.get('/:orderId', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId.toUpperCase() });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error fetching order" });
    }
});

module.exports = router;