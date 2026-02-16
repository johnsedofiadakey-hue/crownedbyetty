"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Package, MapPin, Truck, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TrackOrder() {
    const [orderId, setOrderId] = useState("");
    const [loading, setLoading] = useState(false);
    const [orderStatus, setOrderStatus] = useState<any>(null);
    const [error, setError] = useState("");

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setOrderStatus(null);

        // Simulated API Call
        setTimeout(() => {
            // Mock Response Logic
            if (orderId.length > 5) {
                setOrderStatus({
                    id: orderId,
                    status: "In Transit",
                    estimatedDelivery: "Feb 28, 2026",
                    steps: [
                        { label: "Order Placed", date: "Feb 14", completed: true },
                        { label: "Processing", date: "Feb 15", completed: true },
                        { label: "In Transit", date: "Feb 16", completed: true },
                        { label: "Delivered", date: "Pending", completed: false },
                    ]
                });
            } else {
                setError("Order not found. Please check your ID and try again.");
            }
            setLoading(false);
        }, 1500);
    };

    return (
        <main className="min-h-screen bg-[#FDFBF7] flex flex-col">
            <Navbar />

            <div className="flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-20 max-w-3xl mx-auto w-full">

                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
                        <Package className="text-white w-8 h-8" />
                    </div>
                    <h1 className="font-serif text-4xl md:text-5xl font-black text-primary mb-4">Track Your Crown</h1>
                    <p className="font-sans text-gray-500 font-medium">Enter your Order ID to see exactly where your royal package is.</p>
                </div>

                <form onSubmit={handleTrack} className="w-full relative mb-12">
                    <div className="relative overflow-hidden rounded-full shadow-2xl shadow-primary/5 bg-white border border-gray-100 flex items-center p-2 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                        <Search className="ml-4 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            placeholder="Enter Order ID (e.g., CBE-8821)"
                            className="flex-1 px-4 py-3 outline-none font-sans text-primary placeholder-gray-300 font-bold"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading || !orderId}
                            className="bg-primary text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-emerald-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? "Locating..." : "Track"}
                        </button>
                    </div>
                    {error && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs font-bold mt-4 text-center flex items-center justify-center gap-2">
                            <AlertCircle size={14} /> {error}
                        </motion.p>
                    )}
                </form>

                {/* Status Result */}
                <AnimatePresence>
                    {orderStatus && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-gray-100"
                        >
                            <div className="flex justify-between items-start mb-8 border-b border-gray-50 pb-6">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                    <h3 className="font-serif text-2xl font-bold text-emerald-600 flex items-center gap-2">
                                        <Truck className="w-6 h-6" /> {orderStatus.status}
                                    </h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Expected Delivery</p>
                                    <p className="font-serif text-xl font-bold text-primary">{orderStatus.estimatedDelivery}</p>
                                </div>
                            </div>

                            <div className="space-y-8 relative">
                                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-100 -z-10" />
                                {orderStatus.steps.map((step: any, index: number) => (
                                    <div key={index} className="flex items-center gap-6">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${step.completed ? 'bg-primary text-white' : 'bg-gray-100 text-gray-300'}`}>
                                            {step.completed ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                                        </div>
                                        <div>
                                            <p className={`font-bold text-sm ${step.completed ? 'text-primary' : 'text-gray-400'}`}>{step.label}</p>
                                            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">{step.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            <Footer />
        </main>
    );
}