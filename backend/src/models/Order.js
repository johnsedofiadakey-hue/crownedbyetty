const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    customer: {
        name: String,
        phone: String,
        address: String
    },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        quantity: Number,
        price: Number
    }],
    totalAmount: Number,
    fulfillmentMethod: { type: String, enum: ['yango', 'pickup-a', 'pickup-b'] },
    status: { type: String, default: 'Processing', enum: ['Processing', 'In Transit', 'Delivered', 'Problem'] },
    paymentStatus: { type: String, default: 'Pending' },
    paymentMethod: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);