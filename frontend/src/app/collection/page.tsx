"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ProductCard } from "@/components/ProductGrid";
import { Loader2, Search } from "lucide-react";

export default function Collection() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products`);
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter((p: any) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.tagline && p.tagline.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <main className="min-h-screen bg-[#FDFBF7]">
            <Navbar />

            <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-accent mb-2 block">The Royal Archive</span>
                    <h1 className="font-serif text-5xl md:text-6xl font-black text-primary mb-6">The Collection</h1>
                    <p className="font-sans text-gray-500 max-w-xl mx-auto">
                        Explore our complete range of small-batch, handcrafted organic formulations designed to restore your crown's natural glory.
                    </p>
                </div>

                {/* Search / Filter */}
                <div className="flex justify-center mb-12">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search the collection..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 rounded-full bg-white border border-gray-100 shadow-sm outline-none focus:border-primary transition-all font-sans text-sm"
                        />
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="min-h-[40vh] flex items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary/20" />
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map((product: any, index: number) => (
                            <ProductCard key={product._id || product.id} product={product} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="font-serif text-xl text-gray-400">No treasures found matching your search.</p>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
