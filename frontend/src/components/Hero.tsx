"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, Heart, PlayCircle } from "lucide-react";

export default function Hero() {
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
    };

    const fadeUp = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 70, damping: 15 } },
    };

    return (
        // Increased pt-32 to pt-40 on mobile to force it down away from the Navbar
        <section className="relative w-full h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-40 sm:pt-24 pb-8 overflow-hidden">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">

                {/* Left Column: Typography with added top margin */}
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col items-center lg:items-start text-center lg:text-left mt-8 lg:mt-0">

                    <motion.div variants={fadeUp} className="mb-5 flex items-center space-x-2 bg-white/60 backdrop-blur-md border border-white/80 px-4 py-1.5 rounded-full shadow-sm">
                        <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="w-3 h-3 text-accent fill-accent" />)}
                        </div>
                        <span className="font-sans text-[10px] md:text-xs font-bold text-primary tracking-wide">Trusted by 5,000+ Women</span>
                    </motion.div>

                    <motion.h1 variants={fadeUp} className="font-serif text-[2.5rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-4 lg:mb-6">
                        Grow the Hair <br className="hidden sm:block" />
                        You've Always <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-accent inline-block mt-1 sm:mt-0">Dreamed Of.</span>
                    </motion.h1>

                    <motion.p variants={fadeUp} className="font-sans text-sm sm:text-base md:text-lg text-primary/80 max-w-md mx-auto lg:mx-0 mb-6 lg:mb-8 leading-relaxed font-medium">
                        No harsh chemicals. Just pure, dermatologist-approved botanicals that nourish your scalp and awaken your roots.
                    </motion.p>

                    <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto px-2 sm:px-0">
                        <Link href="/collection" className="w-full sm:w-auto">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full px-6 py-3.5 bg-primary text-white font-sans text-xs sm:text-sm font-bold uppercase tracking-widest rounded-full shadow-xl transition-all flex items-center justify-center space-x-2">
                                <Heart className="w-4 h-4" />
                                <span>Start Journey</span>
                            </motion.button>
                        </Link>
                        <Link href="/raw-ingredients" className="w-full sm:w-auto">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full px-6 py-3.5 bg-white/80 backdrop-blur-md border border-primary/20 text-primary font-sans text-xs sm:text-sm font-bold uppercase tracking-widest rounded-full hover:bg-white transition-all flex items-center justify-center space-x-2">
                                <PlayCircle className="w-4 h-4 text-accent" />
                                <span>Real Results</span>
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Right Column: Controlled Image Container */}
                {/* Adjusted mobile height to h-[260px] to make room for the text above it */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.2, type: "spring" }} className="relative w-full h-[260px] sm:h-[400px] lg:h-[600px] flex items-center justify-center mt-2 lg:mt-0">
                    <div className="absolute inset-6 sm:inset-10 bg-accent/20 rounded-full blur-2xl lg:blur-3xl transform -rotate-6 opacity-60" />

                    <div className="relative w-full h-full rounded-[2rem] md:rounded-[3rem] drop-shadow-2xl">
                        <Image src="/hero-image.png" alt="Healthy Natural Hair" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain object-center" priority />
                    </div>

                    <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-0 left-0 sm:bottom-10 sm:left-[-5%] bg-white/95 backdrop-blur-xl border border-gray-100 p-2.5 sm:p-4 rounded-xl shadow-xl flex items-center space-x-2 scale-[0.80] sm:scale-100 origin-bottom-left">
                        <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <ShieldCheck className="w-3 h-3 sm:w-5 sm:h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="font-sans text-[8px] sm:text-[10px] uppercase tracking-widest text-gray-500 font-bold">100% Natural</p>
                            <p className="font-serif text-[11px] sm:text-sm font-bold text-primary">Safe & Effective</p>
                        </div>
                    </motion.div>
                </motion.div>

            </div>
        </section>
    );
}