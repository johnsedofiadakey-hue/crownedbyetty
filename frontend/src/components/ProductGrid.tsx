"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Leaf, Heart } from "lucide-react";
import Link from "next/link";
import { useWishlistStore } from "@/store/wishlistStore";

import { Loader2 } from "lucide-react";

export default function ProductGrid() {
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products`);
                if (res.ok) {
                    const data = await res.json();
                    // Take only the first 3-6 products for the homepage grid
                    setProducts(data.slice(0, 6));
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <section className="w-full py-20 md:py-32 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <div className="max-w-7xl mx-auto w-full">
                <div className="text-center mb-12 md:mb-20">
                    <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-sm border border-white">
                        <Leaf className="w-5 h-5 md:w-6 md:h-6 text-emerald-700" />
                    </motion.div>
                    <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-3 md:mb-4">Pure. Raw. Organic.</h2>
                    <p className="font-sans text-base md:text-lg text-primary/80 font-medium max-w-lg mx-auto">Zero chemicals. Just 100% natural ingredients straight from the earth to your crown.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary/20" />
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
                        {products.map((product: any, index) => (
                            <ProductCard key={product._id || product.id} product={product} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-400 font-sans">No products available yet. Check back soon!</p>
                    </div>
                )}

                <div className="mt-12 text-center">
                    <Link href="/collection">
                        <button className="px-8 py-3 bg-transparent border border-primary text-primary font-bold uppercase tracking-widest rounded-full hover:bg-primary hover:text-white transition-all text-xs">
                            View All Products
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

export function ProductCard({ product, index }: { product: any, index: number }) {
    const isMiddle = index === 1;
    const { items, addItem, removeItem, isInWishlist } = useWishlistStore();
    const inWishlist = isInWishlist(product.id);

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation
        if (inWishlist) {
            removeItem(product.id);
        } else {
            addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image
            });
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }} className={`relative group ${isMiddle ? 'lg:mt-12' : ''}`}>
            <Link href={`/product/${product.id}`}>
                <div className="relative rounded-[1.5rem] md:rounded-[2rem] p-3 md:p-4 bg-white shadow-lg border border-gray-100 overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">

                    {/* Floating Wishlist Button */}
                    <button
                        onClick={toggleWishlist}
                        className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:scale-110 transition-transform"
                    >
                        <Heart
                            className={`w-5 h-5 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                        />
                    </button>

                    <div className="relative h-[220px] sm:h-[250px] md:h-[280px] w-full rounded-[1rem] md:rounded-[1.5rem] overflow-hidden bg-gray-50 flex items-center justify-center">
                        <img src={product.image} alt={product.name} className="object-cover w-full h-full absolute inset-0 group-hover:scale-105 transition-transform duration-500 ease-out" />
                    </div>
                    <div className="mt-5 px-2 pb-2 text-center md:text-left flex flex-col items-center md:items-start">
                        <p className="font-sans text-[10px] md:text-xs font-extrabold uppercase tracking-[0.15em] text-emerald-700 mb-1.5">{product.tagline}</p>
                        <h3 className="font-serif text-lg md:text-xl font-bold text-primary mb-2 md:mb-3">{product.name}</h3>
                        <div className="w-full flex items-center justify-between mt-2 md:mt-4">
                            <span className="font-sans text-lg md:text-xl font-black text-primary">GH₵ {product.price}</span>
                            <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}