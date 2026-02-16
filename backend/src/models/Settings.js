const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    // Only one settings document should ever exist
    isSingleton: {
        type: String,
        default: 'crownedbyetty_settings',
        unique: true
    },
    storeName: {
        type: String,
        default: 'Crowned By Etty'
    },
    themeColors: {
        primary: { type: String, default: '#111827' },
        secondary: { type: String, default: '#f3f4f6' },
        accent: { type: String, default: '#d97706' }
    },
    socialLinks: {
        instagram: { type: String, default: '' },
        whatsapp: { type: String, default: '' },
        tiktok: { type: String, default: '' },
        facebook: { type: String, default: '' },
        snapchat: { type: String, default: '' }
    },
    pickupLocations: {
        locationA: {
            name: { type: String, default: 'Main Branch' },
            googleMapsLink: { type: String, default: '' }
        },
        locationB: {
            name: { type: String, default: 'Secondary Branch' },
            googleMapsLink: { type: String, default: '' }
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);