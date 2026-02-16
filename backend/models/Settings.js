const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    // Brand Identity
    storeName: { type: String, default: "Crowned By Etty" },
    logoUrl: { type: String, default: "/logo.png" },

    // Theme Colors (Hex Codes)
    primaryColor: { type: String, default: "#1A3614" }, // Deep Emerald
    accentColor: { type: String, default: "#D4AF37" },  // Gold

    // Social Media
    instagramUrl: String,
    whatsappNumber: String,
    facebookUrl: String,
    tiktokUrl: String,
    snapchatUrl: String,

    // Contact Info
    contactEmail: String,
    supportPhone: String
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);