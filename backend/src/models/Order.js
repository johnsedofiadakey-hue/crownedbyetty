const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true,
        required: true
    }, // E.g., ORD-HP-8492
    customerInfo: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String }
    },
    orderItems: [orderItemSchema],
    paymentMethod: {
        type: String,
        enum: ['Paystack-Momo', 'WhatsApp-Manual'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Verified', 'Failed'],
        default: 'Pending'
    },
    fulfillmentMethod: {
        type: String,
        enum: ['Pickup-Location-A', 'Pickup-Location-B', 'Yango-Delivery'],
        required: true
    },
    deliveryAddress: {
        type: String // Required if Yango-Delivery
    },
    yangoDetails: {
        driverName: { type: String },
        driverPhone: { type: String },
        carModel: { type: String },
        licensePlate: { type: String }
    },
    orderStatus: {
        type: String,
        enum: ['Received', 'Confirmed', 'Prepared', 'Available for Pickup', 'Out for Delivery', 'Completed'],
        default: 'Received'
    },
    totalAmount: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// Auto-generate unique Order ID before validation
orderSchema.pre('validate', function (next) {
    if (!this.orderId) {
        const randomNumbers = Math.floor(1000 + Math.random() * 9000);
        this.orderId = `ORD-CB-${randomNumbers}`; // CB for Crowned By Etty
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);