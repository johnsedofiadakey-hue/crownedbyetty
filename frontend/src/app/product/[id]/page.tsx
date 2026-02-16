"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { Star, ShoppingBag, CheckCircle2, Info, BookOpen, MessageSquare, Plus, Minus, ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ... imports

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = React.use(params);
    const { id } = resolvedParams;
    const { addItem } = useCartStore();
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
    const router = useRouter();

    // Data States
    const [product, setProduct] = useState<any>(null);
    const [similarProducts, setSimilarProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // UI States
    const [activeTab, setActiveTab] = useState("description");
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState("");

    // Review States
    const [reviews, setReviews] = useState<any[]>([]);
    const [newReview, setNewReview] = useState({ user: "", rating: 5, comment: "" });
    const [reviewSubmitting, setReviewSubmitting] = useState(false);

    // Fetch Product & Review Data
    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            try {
                // Fetch Main Product
                const res = await fetch(`${apiUrl}/api/products/${id}`);
                if (!res.ok) throw new Error("Product not found");
                const data = await res.json();
                setProduct(data);
                setSelectedImage(data.image);

                // Fetch Reviews
                const reviewsRes = await fetch(`${apiUrl}/api/reviews/product/${id}`);
                if (reviewsRes.ok) {
                    setReviews(await reviewsRes.json());
                }

                // Fetch Similar Products
                const similarRes = await fetch(`${apiUrl}/api/products/similar/${id}`);
                if (similarRes.ok) {
                    setSimilarProducts(await similarRes.json());
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProductData();
        }
    }, [id]);

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setReviewSubmitting(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

        try {
            const res = await fetch(`${apiUrl}/api/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...newReview, productId: product._id })
            });

            if (res.ok) {
                const savedReview = await res.json();
                setReviews([savedReview, ...reviews]);
                setNewReview({ user: "", rating: 5, comment: "" });
                alert("Thank you for your review!");
            }
        } catch (err) {
            console.error("Failed to submit review", err);
        } finally {
            setReviewSubmitting(false);
        }
    };

    // ... (rest of cart/wishlist handlers) ...
    const handleAddToCart = () => {
        if (!product) return;
        addItem({
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
        alert("Added to cart!");
    };

    const toggleWishlist = () => {
        if (!product) return;
        if (isInWishlist(product._id)) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist({
                id: product._id,
                name: product.name,
                price: product.price,
                image: product.image
            });
        }
    };

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
    if (error || !product) return <div className="min-h-screen bg-background flex flex-col items-center justify-center"><h1 className="text-2xl font-serif text-primary mb-4">Product Not Found</h1><button onClick={() => router.push('/')} className="text-sm underline text-gray-500">Return Home</button></div>;

    // Calculate Average Rating
    const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "5.0";

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

                    {/* LEFT: IMAGE GALLERY */}
                    <div className="space-y-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden bg-white shadow-xl border border-gray-100">
                            <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${selectedImage || product.image}`} alt={product.name} className="w-full h-full object-cover" />
                        </motion.div>
                    </div>

                    {/* RIGHT: PRODUCT INFO */}
                    <div className="flex flex-col">
                        <div className="mb-8 text-center lg:text-left">
                            <span className="font-sans text-xs font-black uppercase tracking-[0.2em] text-emerald-700 mb-2 block">{product.stock > 0 ? "In Stock" : "Sold Out"}</span>
                            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">{product.name}</h1>
                            <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
                                <div className="flex text-accent">
                                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`w-5 h-5 ${s <= Math.round(Number(avgRating)) ? 'fill-accent text-accent' : 'text-gray-200'}`} />)}
                                </div>
                                <span className="font-sans font-bold text-primary">{avgRating}</span>
                                <span className="text-gray-400 text-sm">({reviews.length} Reviews)</span>
                            </div>
                            <p className="font-sans text-3xl font-black text-primary">GH₵ {product.price}</p>
                        </div>

                        {/* TABS */}
                        <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[2rem] p-6 mb-8 shadow-sm">
                            <div className="flex border-b border-gray-100 mb-6 overflow-x-auto">
                                <TabBtn active={activeTab === 'description'} onClick={() => setActiveTab('description')} icon={<Info className="w-4 h-4" />} label="Description" />
                                <TabBtn active={activeTab === 'usage'} onClick={() => setActiveTab('usage')} icon={<BookOpen className="w-4 h-4" />} label="How to Use" />
                                <TabBtn active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} icon={<MessageSquare className="w-4 h-4" />} label={`Reviews (${reviews.length})`} />
                            </div>

                            <div className="min-h-[120px] font-sans text-gray-600 leading-relaxed">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'description' && (
                                        <motion.div key="desc" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                                            <p className="mb-4">{product.description}</p>
                                            {product.ingredients && <p className="text-xs font-bold text-emerald-800 bg-emerald-50 p-3 rounded-lg flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Ingredients: {product.ingredients}</p>}
                                        </motion.div>
                                    )}
                                    {activeTab === 'usage' && (
                                        <motion.div key="usage" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                                            <p>{product.howToUse || "Apply as needed."}</p>
                                        </motion.div>
                                    )}
                                    {activeTab === 'reviews' && (
                                        <motion.div key="rev" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

                                            {/* Review Form */}
                                            <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
                                                <h4 className="font-serif text-lg font-bold text-primary mb-4">Write a Review</h4>
                                                <div className="space-y-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Your Name"
                                                        required
                                                        value={newReview.user}
                                                        onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary text-sm font-sans"
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold uppercase text-gray-400">Rating:</span>
                                                        <div className="flex gap-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <button type="button" key={star} onClick={() => setNewReview({ ...newReview, rating: star })}>
                                                                    <Star className={`w-5 h-5 ${star <= newReview.rating ? 'fill-accent text-accent' : 'text-gray-300'}`} />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <textarea
                                                        placeholder="Share your experience..."
                                                        required
                                                        value={newReview.comment}
                                                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary text-sm font-sans min-h-[80px]"
                                                    />
                                                    <button
                                                        type="submit"
                                                        disabled={reviewSubmitting}
                                                        className="bg-primary text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-emerald-800 transition-colors disabled:opacity-50"
                                                    >
                                                        {reviewSubmitting ? "Submitting..." : "Submit Review"}
                                                    </button>
                                                </div>
                                            </form>

                                            {/* Reviews List */}
                                            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                                                {reviews.length > 0 ? reviews.map((review) => (
                                                    <div key={review._id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h5 className="font-bold text-primary text-sm">{review.user}</h5>
                                                            <div className="flex"><Star className="w-3 h-3 fill-accent text-accent" /><span className="text-xs ml-1 font-bold">{review.rating}.0</span></div>
                                                        </div>
                                                        <p className="text-sm text-gray-500 italic">"{review.comment}"</p>
                                                    </div>
                                                )) : (
                                                    <p className="italic text-gray-400 text-center py-4">No reviews yet. Be the first!</p>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* ADD TO CART */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center mt-auto">
                            <div className="flex items-center bg-gray-100 rounded-full px-4 py-3 gap-6 w-full sm:w-auto justify-between">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-primary hover:text-accent"><Minus className="w-5 h-5" /></button>
                                <span className="font-sans font-bold text-lg min-w-[20px] text-center">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="text-primary hover:text-accent"><Plus className="w-5 h-5" /></button>
                            </div>
                            <div className="flex gap-4 w-full sm:w-auto flex-1">
                                <button onClick={handleAddToCart} disabled={product.stock <= 0} className={`flex-1 text-white font-sans font-bold uppercase tracking-widest py-4 rounded-full shadow-lg transition-all flex items-center justify-center gap-3 ${product.stock > 0 ? 'bg-primary hover:bg-emerald-800' : 'bg-gray-300 cursor-not-allowed'}`}>
                                    <ShoppingBag className="w-5 h-5" />
                                    {product.stock > 0 ? `Add to Cart — GH₵ ${product.price * quantity}` : 'Out of Stock'}
                                </button>
                                <button onClick={toggleWishlist} className={`p-4 rounded-full border border-gray-100 shadow-sm transition-all hover:scale-105 ${isInWishlist(product._id) ? 'bg-red-50 border-red-100' : 'bg-white hover:bg-gray-50'}`}>
                                    <Heart className={`w-6 h-6 ${isInWishlist(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SIMILAR PRODUCTS */}
            {similarProducts.length > 0 && (
                <section className="py-20 bg-gray-50/50">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="font-serif text-3xl font-bold text-primary mb-10">You May Also Like</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {similarProducts.map((simProd: any) => (
                                <Link href={`/product/${simProd._id}`} key={simProd._id} className="group cursor-pointer">
                                    <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 transition-all hover:-translate-y-2 hover:shadow-lg">
                                        <div className="aspect-square bg-gray-50 rounded-[1.5rem] mb-4 overflow-hidden relative">
                                            <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${simProd.image}`} alt={simProd.name} className="w-full h-full object-cover" />
                                        </div>
                                        <h3 className="font-serif text-lg font-bold text-primary mb-1 group-hover:text-accent transition-colors">{simProd.name}</h3>
                                        <p className="font-sans text-xs font-black text-gray-400 uppercase tracking-widest">GH₵ {simProd.price}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </main>
    );
}

function TabBtn({ active, onClick, icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-4 font-sans text-xs font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${active ? 'border-accent text-primary' : 'border-transparent text-gray-400 hover:text-primary'}`}
        >
            {icon} {label}
        </button>
    );
}