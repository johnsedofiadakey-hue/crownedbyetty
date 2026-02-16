"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, removeItem, updateQuantity, getTotal } = useCartStore();

    const total = getTotal();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* 1. DARK SEMI-TRANSPARENT OVERLAY */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* 2. THE SLIDING DRAWER */}
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
                                <ShoppingBag className="w-6 h-6 text-primary" />
                                <h2 className="font-serif text-2xl font-bold text-primary">Your Cart</h2>
                                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                    {items.length}
                                </span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        {/* Scrollable Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                                        <ShoppingBag className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <p className="font-sans text-gray-500 font-medium">Your cart is feeling a bit light.</p>
                                    <button
                                        onClick={onClose}
                                        className="text-accent font-bold uppercase tracking-widest text-sm underline"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
                                    >
                                        {/* Vivid Image */}
                                        <div className="w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>

                                        {/* Item Details */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-serif text-lg font-bold text-primary leading-tight">{item.name}</h3>
                                                <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-end mt-2">
                                                <div className="flex items-center bg-gray-50 rounded-lg px-2 py-1 gap-4 border border-gray-100">
                                                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="text-primary p-1"><Minus className="w-3 h-3" /></button>
                                                    <span className="font-sans font-bold text-sm w-4 text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-primary p-1"><Plus className="w-3 h-3" /></button>
                                                </div>
                                                <p className="font-sans font-black text-primary">GH₵ {item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Sticky Footer Checkout Button */}
                        {items.length > 0 && (
                            <div className="p-6 bg-white border-t border-gray-100 space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-sans text-gray-500 font-medium">Estimated Total</span>
                                    <span className="font-sans text-2xl font-black text-primary">GH₵ {total}</span>
                                </div>
                                <Link href="/checkout" onClick={onClose}>
                                    <button className="w-full bg-primary text-white font-sans font-bold uppercase tracking-widest py-4 rounded-xl shadow-lg hover:bg-emerald-800 transition-all flex items-center justify-center gap-3 group">
                                        <span>Proceed to Checkout</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                                <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">
                                    Secure Checkout with Paystack & WhatsApp
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}