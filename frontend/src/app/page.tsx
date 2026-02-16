"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <main ref={mainRef} className="relative bg-background min-h-[100dvh] selection:bg-accent/30 selection:text-primary">

      {/* GLOBAL MESH */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-80 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] md:w-[80vw] md:h-[80vw] bg-emerald-200/50 rounded-full blur-[80px] md:blur-[140px] mix-blend-multiply"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], rotate: [0, -10, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[110vw] h-[110vw] md:w-[90vw] md:h-[90vw] bg-amber-300/40 rounded-full blur-[80px] md:blur-[150px] mix-blend-multiply"
        />
      </div>

      <Navbar />

      {/* LAYER 1: THE PINNED HERO */}
      {/* Uses 100dvh to perfectly fit mobile screens without cutting off content */}
      <div className="relative z-10 h-[100dvh] w-full">
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="sticky top-0 h-[100dvh] w-full flex flex-col justify-center origin-top transform-gpu"
        >
          <Hero />
        </motion.div>
      </div>

      {/* LAYER 2: THE SLIDING SHEET */}
      <div className="relative z-20 w-full bg-background/95 backdrop-blur-3xl rounded-t-[2.5rem] md:rounded-t-[4rem] shadow-[0_-20px_50px_rgba(0,0,0,0.08)] border-t border-gray-100">
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-gray-200 rounded-full" />
        <ProductGrid />
        <WhyChooseUs />
        <div className="border-t border-gray-100 mt-10 md:mt-20">
          <Footer />
        </div>
      </div>

    </main>
  );
}