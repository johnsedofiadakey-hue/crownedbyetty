"use client";

import React from "react";
import { motion } from "framer-motion";
import { Leaf, Award, ShieldCheck, Heart } from "lucide-react";

const features = [
    {
        icon: <Leaf className="w-8 h-8 text-emerald-600" />,
        title: "100% Organic",
        description: "Pure botanical ingredients sourced directly from sustainable farms."
    },
    {
        icon: <Award className="w-8 h-8 text-accent" />,
        title: "Royal Quality",
        description: "Hand-crafted in small batches to ensure premium potency."
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
        title: "Clinically Tested",
        description: "Safe, effective formulas backed by trichology research."
    },
    {
        icon: <Heart className="w-8 h-8 text-red-500" />,
        title: "Cruelty Free",
        description: "Ethical beauty that never tests on animals, ever."
    }
];

export default function WhyChooseUs() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="font-sans text-xs font-black uppercase tracking-[0.2em] text-emerald-700 mb-3 block">
                        The Crowned Standard
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary">
                        Why Choose Us?
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-[2rem] bg-gray-50 hover:bg-white hover:shadow-xl border border-transparent hover:border-gray-100 transition-all group"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="font-serif text-xl font-bold text-primary mb-3">
                                {feature.title}
                            </h3>
                            <p className="font-sans text-sm text-gray-500 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
