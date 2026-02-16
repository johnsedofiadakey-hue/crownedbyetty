const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    storeName: { type: String, default: "Crowned By Etty" },
    logoUrl: { type: String, default: "/logo.png" },
    primaryColor: { type: String, default: "#1A3614" },
    accentColor: { type: String, default: "#D4AF37" },
    instagramUrl: String,
    whatsappNumber: String,
    facebookUrl: String,
    tiktokUrl: String,
    snapchatUrl: String,
    contactEmail: String,
    supportPhone: String
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);

const seedDate = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/hair-ecommerce');
        console.log('Connected to MongoDB');

        await Settings.deleteMany({});

        await Settings.create({
            storeName: "Crowned By Etty (Seeded)",
            logoUrl: "/uploads/logo-seeded.png", // We'll mock this path or use the generated image path if we can move it
            instagramUrl: "https://instagram.com/seeded",
            whatsappNumber: "123456789",
            facebookUrl: "https://facebook.com/seeded",
            tiktokUrl: "https://tiktok.com/@seeded",
            snapchatUrl: "https://snapchat.com/add/seeded"
        });

        console.log('Settings seeded');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDate();
