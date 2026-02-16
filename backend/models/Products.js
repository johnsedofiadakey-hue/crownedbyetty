const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    tagline: String,
    description: String,
    howToUse: String,
    ingredients: String,
    images: [String],
    category: { type: String, default: 'Hair Care' },
    stock: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);