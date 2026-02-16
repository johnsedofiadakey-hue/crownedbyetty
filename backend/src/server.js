const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

// Database Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hair-ecommerce');
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

// --- Route Imports ---
// Ensure these files exist in your 'routes' folder
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const settingRoutes = require('./routes/settingRoutes');

// --- Route Mounting ---
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Serve static files
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Base Route for Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'active',
        message: 'Crowned By Etty API is running seamlessly.',
        timestamp: new Date().toISOString()
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// Initialize Server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server executing in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
});