const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    beforeImage: { type: String }, // URL to image
    afterImage: { type: String }, // URL to image
    isApproved: { type: Boolean, default: false } // Admin must approve before showing on frontend
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    howToUse: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    images: [{
        type: String, // Array of image URLs
        required: true
    }],
    category: {
        type: String,
        required: true,
        index: true // Indexed for faster "Similar Products" queries
    },
    tags: [{
        type: String
    }],
    inStock: {
        type: Boolean,
        default: true
    },
    stockCount: {
        type: Number,
        required: true,
        default: 0
    },
    reviews: [reviewSchema],
    averageRating: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Pre-save hook to calculate average rating automatically
productSchema.pre('save', function (next) {
    if (this.reviews && this.reviews.length > 0) {
        const approvedReviews = this.reviews.filter(r => r.isApproved);
        if (approvedReviews.length > 0) {
            const sum = approvedReviews.reduce((acc, item) => acc + item.rating, 0);
            this.averageRating = sum / approvedReviews.length;
        } else {
            this.averageRating = 0;
        }
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);