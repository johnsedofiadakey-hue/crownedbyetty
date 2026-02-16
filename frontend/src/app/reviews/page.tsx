"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star, MessageCircle, User } from "lucide-react";
import { motion } from "framer-motion";

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/reviews`);
                if (res.ok) {
                    const data = await res.json();
                    setReviews(data);
                }
            } catch (error) {
                console.error("Failed to fetch reviews", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    return (
        <main className="min-h-screen bg-[#FDFBF7]">
            <Navbar />

            <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-accent mb-2 block">Voices of Royalty</span>
                    <h1 className="font-serif text-5xl md:text-6xl font-black text-primary mb-6">Client Reviews</h1>
                    <p className="font-sans text-gray-500 max-w-xl mx-auto">
                        Real stories from our queens who have transformed their crowns with our natural formulations.
                    </p>
                </div>

                {/* Reviews Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reviews.map((review: any, index: number) => (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${star <= review.rating ? 'fill-accent text-accent' : 'text-gray-200'}`}
                                        />
                                    ))}
                                </div>
                                <p className="font-serif text-lg text-primary mb-6 leading-relaxed">
                                    "{review.comment}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                                        <User className="w-5 h-5 text-emerald-700" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-primary">{review.user}</p>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Verified Buyer</p>
                                    </div>
                                </div>
                                {review.product && (
                                    <div className="mt-6 pt-6 border-t border-gray-50 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden">
                                            <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${review.product.image}`} alt={review.product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-400">{review.product.name}</span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100">
                        <MessageCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <h3 className="font-serif text-xl font-bold text-primary mb-2">No Reviews Yet</h3>
                        <p className="text-gray-400 font-sans">Be the first to share your experience!</p>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
