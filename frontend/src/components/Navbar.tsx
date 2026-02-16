import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, Search, Heart } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import CartDrawer from "./CartDrawer";
import WishlistDrawer from "./WishlistDrawer";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [wishlistOpen, setWishlistOpen] = useState(false);

    // Connect to stores
    const cartItems = useCartStore((state) => state.items);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const wishlistItems = useWishlistStore((state) => state.items);

    // ... items state
    const [logo, setLogo] = useState("");

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);

        // Fetch Logo & Branding
        const fetchBranding = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/settings`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.logoUrl) setLogo(data.logoUrl);
                }
            } catch (e) {
                console.error("Failed to fetch branding");
            }
        };
        fetchBranding();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = ["Collection", "Raw Ingredients", "Reviews"];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 80, damping: 20 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || mobileMenuOpen
                    ? "bg-white/95 backdrop-blur-md shadow-sm py-4 border-b border-gray-100"
                    : "bg-transparent py-6"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">

                    {/* Brand Identity */}
                    <Link href="/">
                        <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col relative z-20 cursor-pointer">
                            {logo ? (
                                <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${logo}`} alt="Crowned By Etty" className="h-10 md:h-12 w-auto object-contain" />
                            ) : (
                                <>
                                    <span className="font-serif text-xl md:text-2xl font-black tracking-widest text-primary uppercase">
                                        Crowned
                                    </span>
                                    <span className="font-sans text-[8px] md:text-[9px] font-bold tracking-[0.4em] text-accent uppercase -mt-1">
                                        By Etty
                                    </span>
                                </>
                            )}
                        </motion.div>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center space-x-10">
                        {navLinks.map((item) => (
                            <Link key={item} href={`/${item.toLowerCase().replace(" ", "-")}`}>
                                <motion.span
                                    whileHover={{ y: -2 }}
                                    className="font-sans text-xs font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors cursor-pointer"
                                >
                                    {item}
                                </motion.span>
                            </Link>
                        ))}
                    </div>

                    {/* Actions & Mobile Toggle */}
                    <div className="flex items-center space-x-4 relative z-20">
                        <motion.button whileHover={{ scale: 1.1 }} className="hidden sm:block text-primary hover:text-accent transition-colors">
                            <Search className="w-5 h-5 md:w-6 md:h-6" />
                        </motion.button>

                        {/* Wishlist Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setWishlistOpen(true)}
                            className="relative text-primary hover:text-accent transition-colors hidden sm:block"
                        >
                            <Heart className="w-5 h-5 md:w-6 md:h-6" />
                            {wishlistItems.length > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-md"
                                >
                                    {wishlistItems.length}
                                </motion.span>
                            )}
                        </motion.button>

                        {/* Open Cart Drawer on Click */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setCartOpen(true)}
                            className="relative text-primary hover:text-accent transition-colors"
                        >
                            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-md"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </motion.button>

                        {/* Mobile Menu Button */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden text-primary hover:text-accent transition-colors ml-2 focus:outline-none"
                        >
                            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown (Solid & Vivid) */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "100vh" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl overflow-hidden flex flex-col pt-4 px-6 border-t border-gray-100"
                        >
                            {navLinks.map((item, index) => (
                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="border-b border-gray-200 last:border-none"
                                >
                                    <Link href={`/${item.toLowerCase().replace(" ", "-")}`}>
                                        <span
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block py-5 text-xl font-serif font-bold text-primary hover:text-accent transition-colors"
                                        >
                                            {item}
                                        </span>
                                    </Link>
                                </motion.div>
                            ))}
                            {/* Mobile Wishlist Link */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="border-b border-gray-200 py-5 flex items-center justify-between"
                                onClick={() => { setMobileMenuOpen(false); setWishlistOpen(true); }}
                            >
                                <span className="text-xl font-serif font-bold text-primary">Wishlist</span>
                                <div className="flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-primary" />
                                    <span className="font-bold text-primary">{wishlistItems.length}</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Drawers */}
            <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
            <WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
        </>
    );
}