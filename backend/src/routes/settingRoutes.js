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
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE site settings (Admin Only)
router.put('/', async (req, res) => {
    try {
        const updatedSettings = await Settings.findOneAndUpdate(
            {},
            req.body,
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json(updatedSettings);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;