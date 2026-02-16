"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Leaf, ShieldCheck, Sparkles } from "lucide-react";

export default function RawIngredients() {
    return (
        <main className="min-h-screen bg-[#FDFBF7]">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000&auto=format&fit=crop"
                        alt="Nature's Secret"
                        className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FDFBF7]" />
                </div>

                <div className="relative z-10 text-center max-w-4xl px-6 mt-20">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <span className="font-sans text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-white/90 mb-6 block">The Crowned Philosophy</span>
                        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-none">
                            Nature's <br /> <span className="text-emerald-200">Untouched</span> Secret.
                        </h1>
                        <p className="font-sans text-white/90 text-lg md:text-2xl font-light max-w-2xl mx-auto leading-relaxed">
                            We believe the earth holds the cure. Our formulas are not made; they are discovered.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* The Story Section */}
            <section className="py-24 px-6 max-w-5xl mx-auto">
                <div className="flex flex-col gap-20">

                    {/* Chapter 1: The Origin */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                    >
                        <div className="order-2 md:order-1">
                            <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">Born from the Earth</h2>
                            <p className="font-sans text-gray-600 text-lg leading-loose mb-6">
                                In a world obsessed with synthetic shortcuts and chemical fillers, we took a different path. We went back to the source.
                                Our journey began with a simple question: <span className="italic text-primary font-serif">How did our ancestors maintain such luscious, resilient crowns without a laboratory?</span>
                            </p>
                            <p className="font-sans text-gray-600 text-lg leading-loose">
                                The answer lay in the soil. In the sun-drenched savannas and the lush rainforests where nature works in perfect harmony.
                                We realized that true potency doesn't come from a test tube—it comes from the life force of plants that have thrived for millennia.
                            </p>
                        </div>
                        <div className="order-1 md:order-2 relative h-[500px] rounded-[3rem] overflow-hidden shadow-xl">
                            <img src="https://images.unsplash.com/photo-1470058869958-2a77ade41c02?q=80&w=800&auto=format&fit=crop" alt="Botanical Origin" className="w-full h-full object-cover" />
                        </div>
                    </motion.div>

                    {/* Chapter 2: The Trade Secret */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                    >
                        <div className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-xl">
                            <img src="https://images.unsplash.com/photo-1615397349754-082807e5c54e?q=80&w=800&auto=format&fit=crop" alt="Secret Formulation" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Sparkles className="w-6 h-6 text-accent" />
                                <span className="font-sans text-xs font-bold uppercase tracking-widest text-accent">A Closely Guarded Secret</span>
                            </div>
                            <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">The Alchemy of Growth</h2>
                            <p className="font-sans text-gray-600 text-lg leading-loose mb-6">
                                Our specific blend of oils, butters, and herbs is a proprietary trade secret, honed over generations and perfected for the modern queen.
                                We prioritise raw, cold-pressed ingredients that retain 100% of their nutrients.
                            </p>
                            <p className="font-sans text-gray-600 text-lg leading-loose">
                                While others strip away natural goodness with heat and harsh processing, we protect it.
                                The result is a powerful synergy that wakes up dormant follicles, seals in hydration, and brings your hair back to life.
                                It’s not just haircare; it’s a restoration ritual.
                            </p>
                        </div>
                    </motion.div>

                    {/* Chapter 3: The Promise */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-primary rounded-[3rem] p-10 md:p-16 text-center text-white relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <Leaf className="w-12 h-12 text-emerald-300 mx-auto mb-6" />
                            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">Our Promise to Your Crown</h2>
                            <p className="font-sans text-emerald-100 text-lg md:text-xl leading-relaxed mb-10">
                                "We promise to never compromise on purity. If it doesn't come from the earth, it doesn't go in our bottles.
                                Experience the undeniable difference of nature's raw power."
                            </p>
                            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-emerald-300" />
                                    <span className="font-bold tracking-widest uppercase text-sm">No Sulfates</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-emerald-300" />
                                    <span className="font-bold tracking-widest uppercase text-sm">No Parabens</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-emerald-300" />
                                    <span className="font-bold tracking-widest uppercase text-sm">100% Cruelty-Free</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
