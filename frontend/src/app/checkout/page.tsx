"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useCartStore } from "@/store/cartStore";
import { MapPin, Truck, Smartphone, CreditCard, ShieldCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const { items, getTotal, clearCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    // Checkout Form State
    const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
    const [fulfillment, setFulfillment] = useState("yango"); // 'yango', 'pickup-a', 'pickup-b'
    const [paymentMethod, setPaymentMethod] = useState("paystack"); // 'paystack', 'whatsapp'

    // Hydration fix for Zustand
    useEffect(() => setMounted(true), []);

    const totalAmount = getTotal();
    const deliveryFee = fulfillment === "yango" ? 30 : 0;
    const finalTotal = totalAmount + deliveryFee;

    // --- Core Checkout Logic ---
    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // 1. Generate unique Order ID
        const orderId = `ORD-CB-${Math.floor(1000 + Math.random() * 9000)}`;

        try {
            // 2. Save Order to MongoDB via Backend API
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId,
                    customer,
                    items,
                    totalAmount: finalTotal,
                    fulfillmentMethod: fulfillment,
                    paymentMethod: paymentMethod === 'whatsapp' ? 'WhatsApp-Manual' : 'Paystack-Momo'
                })
            });

            if (!response.ok) throw new Error("Could not save order to database.");

            if (paymentMethod === "whatsapp") {
                // 3a. Route to WhatsApp with formatted payload
                const cartSummary = items.map(item => `${item.quantity}x ${item.name} (GH₵${item.price})`).join("%0A");
                const fulfillmentText = fulfillment === "yango" ? `Yango Delivery to: ${customer.address}` : `Pickup at: ${fulfillment === "pickup-a" ? "Main Branch" : "Secondary Branch"}`;

                const whatsappPayload = `*New Order: ${orderId}*%0A%0A*Customer:* ${customer.name}%0A*Phone:* ${customer.phone}%0A%0A*Items:*%0A${cartSummary}%0A%0A*Subtotal:* GH₵${totalAmount}%0A*Delivery Fee:* GH₵${deliveryFee}%0A*Total:* GH₵${finalTotal}%0A%0A*Fulfillment:*%0A${fulfillmentText}%0A%0A*Payment:* Manual Momo Verification required.`;

                const whatsappNumber = "233540000000"; // Update with your real business number

                clearCart();
                window.open(`https://wa.me/${whatsappNumber}?text=${whatsappPayload}`, "_blank");
                router.push(`/track?id=${orderId}`);

            } else {
                // 3b. Process Paystack Order
                // In production, the backend returns a Paystack Access Code or Reference
                const orderData = await response.json();

                // For now, we simulate the success and clear the cart
                // You will later replace this with the Paystack Pop-up Trigger
                alert(`Order ${orderId} saved! Redirecting to Paystack...`);
                clearCart();
                router.push(`/track?id=${orderId}`);
            }

        } catch (error) {
            console.error("Checkout Error:", error);
            alert("Database Error: Ensure your backend server is running.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!mounted) return null;

    return (
        <main className="min-h-[100dvh] bg-background">
            <Navbar />

            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-2">Secure Checkout</h1>
                    <p className="font-sans text-gray-600">Complete your order securely.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* LEFT COLUMN: Form Inputs */}
                    <div className="lg:col-span-7 space-y-8">
                        <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">

                            {/* 1. Customer Details */}
                            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100">
                                <h2 className="font-serif text-2xl font-bold text-primary mb-6">Your Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block font-sans text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                                        <input required type="text" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all font-sans" placeholder="Ama Mensah" />
                                    </div>
                                    <div>
                                        <label className="block font-sans text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Phone Number</label>
                                        <input required type="tel" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all font-sans" placeholder="054 000 0000" />
                                    </div>
                                </div>
                            </div>

                            {/* 2. Fulfillment Method */}
                            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100">
                                <h2 className="font-serif text-2xl font-bold text-primary mb-6">Delivery Method</h2>
                                <div className="space-y-4">
                                    <label className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${fulfillment === 'yango' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-100 hover:border-emerald-200'}`}>
                                        <input type="radio" name="fulfillment" value="yango" checked={fulfillment === 'yango'} onChange={(e) => setFulfillment(e.target.value)} className="mt-1 mr-4 accent-emerald-600" />
                                        <div>
                                            <div className="flex items-center space-x-2"><Truck className="w-5 h-5 text-emerald-700" /> <span className="font-bold text-primary">Yango Delivery</span></div>
                                            <p className="text-sm text-gray-500 mt-1">We will book a ride to deliver straight to your door. Flat fee applied.</p>
                                            {fulfillment === 'yango' && (
                                                <input required type="text" value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} className="mt-4 w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-emerald-600 text-sm" placeholder="Enter full delivery address / GPS address" />
                                            )}
                                        </div>
                                    </label>

                                    <label className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${fulfillment === 'pickup-a' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-100 hover:border-emerald-200'}`}>
                                        <input type="radio" name="fulfillment" value="pickup-a" checked={fulfillment === 'pickup-a'} onChange={(e) => setFulfillment(e.target.value)} className="mt-1 mr-4 accent-emerald-600" />
                                        <div>
                                            <div className="flex items-center space-x-2"><MapPin className="w-5 h-5 text-emerald-700" /> <span className="font-bold text-primary">Pickup: Main Branch</span></div>
                                            <p className="text-sm text-gray-500 mt-1">Accra Central. Directions will be provided via tracking page.</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* 3. Payment Method */}
                            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100">
                                <h2 className="font-serif text-2xl font-bold text-primary mb-6">Payment Method</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all text-center ${paymentMethod === 'paystack' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-100 hover:border-emerald-200'}`}>
                                        <input type="radio" name="payment" value="paystack" checked={paymentMethod === 'paystack'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                                        <CreditCard className={`w-8 h-8 mb-3 ${paymentMethod === 'paystack' ? 'text-emerald-600' : 'text-gray-400'}`} />
                                        <span className="font-bold text-primary">Paystack (Momo/Card)</span>
                                        <span className="text-xs text-gray-500 mt-2 text-balance">Instant automated verification</span>
                                    </label>

                                    <label className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all text-center ${paymentMethod === 'whatsapp' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-100 hover:border-emerald-200'}`}>
                                        <input type="radio" name="payment" value="whatsapp" checked={paymentMethod === 'whatsapp'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                                        <Smartphone className={`w-8 h-8 mb-3 ${paymentMethod === 'whatsapp' ? 'text-emerald-600' : 'text-gray-400'}`} />
                                        <span className="font-bold text-primary">Order via WhatsApp</span>
                                        <span className="text-xs text-gray-500 mt-2 text-balance">Manual Momo transfer to Admin</span>
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT COLUMN: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-gray-100 sticky top-32">
                            <h2 className="font-serif text-2xl font-bold text-primary mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                                {items.length === 0 ? (
                                    <p className="text-gray-500 font-sans text-sm">Your cart is empty.</p>
                                ) : (
                                    items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-primary">{item.name}</p>
                                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="font-bold text-primary">GH₵ {item.price * item.quantity}</p>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="border-t border-gray-100 pt-6 space-y-3 font-sans">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>GH₵ {totalAmount}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span>GH₵ {deliveryFee}</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <span className="font-bold text-lg text-primary">Total</span>
                                    <span className="font-bold text-2xl text-emerald-700">GH₵ {finalTotal}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={items.length === 0 || isSubmitting}
                                className="w-full mt-8 py-4 bg-primary text-white font-sans font-bold uppercase tracking-widest rounded-xl shadow-lg hover:bg-emerald-800 hover:shadow-xl transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <ShieldCheck className="w-5 h-5" />
                                        <span>{paymentMethod === 'whatsapp' ? 'Proceed to WhatsApp' : 'Pay Securely'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}