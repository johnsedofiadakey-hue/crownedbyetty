const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// GET current site settings
router.get('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({}); // Create default if none exists
        }

        // Transform for frontend (Nested Social Links)
        const formattedSettings = {
            ...settings.toObject(),
            socialLinks: {
                instagram: settings.instagramUrl || "",
                whatsapp: settings.whatsappNumber || "",
                facebook: settings.facebookUrl || "",
                tiktok: settings.tiktokUrl || "",
                snapchat: settings.snapchatUrl || ""
            }
        };

        res.json(formattedSettings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE site settings (Admin Only)
router.put('/', async (req, res) => {
    try {
        const { socialLinks, ...otherSettings } = req.body;

        // Flatten socialLinks back to model fields
        const updateData = {
            ...otherSettings,
            instagramUrl: socialLinks?.instagram,
            whatsappNumber: socialLinks?.whatsapp,
            facebookUrl: socialLinks?.facebook,
            tiktokUrl: socialLinks?.tiktok,
            snapchatUrl: socialLinks?.snapchat
        };

        const updatedSettings = await Settings.findOneAndUpdate({}, updateData, { new: true, upsert: true });

        // Return formatted response
        const formattedResponse = {
            ...updatedSettings.toObject(),
            socialLinks: {
                instagram: updatedSettings.instagramUrl,
                whatsapp: updatedSettings.whatsappNumber,
                facebook: updatedSettings.facebookUrl,
                tiktok: updatedSettings.tiktokUrl,
                snapchat: updatedSettings.snapchatUrl
            }
        };

        res.json(formattedResponse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;