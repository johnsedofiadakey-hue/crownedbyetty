"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { X, Heart, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface WishlistDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
    const { items, removeItem } = useWishlistStore();
    const { addItem } = useCartStore();

    const handleAddToCart = (item: any) => {
        addItem({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1
        });
        removeItem(item.id);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* OVERLAY */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* DRAWER */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-[100dvh] w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <Heart className="w-6 h-6 text-primary fill-accent/20" />
                                <h2 className="font-serif text-2xl font-bold text-primary">Wishlist</h2>
                                <span className="bg-accent/10 text-accent text-xs font-bold px-2.5 py-0.5 rounded-full">
                                    {items.length}
                                </span>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                                        <Heart className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <p className="font-sans text-gray-500 font-medium">Your wishlist is empty.</p>
                                    <button onClick={onClose} className="text-accent font-bold uppercase tracking-widest text-sm underline">
                                        Explore Collection
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div layout key={item.id} className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                        <div className="w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-serif text-lg font-bold text-primary leading-tight">{item.name}</h3>
                                                <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-end mt-2">
                                                <p className="font-sans font-black text-primary">GH₵ {item.price}</p>
                                                <button
                                                    onClick={() => handleAddToCart(item)}
                                                    className="bg-primary text-white p-2 rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide"
                                                >
                                                    <ShoppingBag size={14} /> Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}