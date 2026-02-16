"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store/adminStore";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const setLogin = useAdminStore((state) => state.setLogin);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulated Auth Logic (This will connect to your /api/auth/login later)
        setTimeout(() => {
            if (email === "admin@crownedbyetty.com" && password === "etty2026") {
                setLogin("mock-jwt-token-123");
                router.push("/admin/dashboard");
            } else {
                alert("Invalid credentials. Please try again.");
            }
            setIsLoading(false);
        }, 1500);
    };

    return (
        <main className="min-h-[100dvh] bg-[#FDFBF7] flex items-center justify-center p-6 relative overflow-hidden">

            {/* Background Decor - Matches the main site branding */}
            <div className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-emerald-100/40 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-amber-100/30 rounded-full blur-[120px] -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-12 relative"
            >
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                        <ShieldCheck className="text-white w-8 h-8" />
                    </div>
                    <h1 className="font-serif text-3xl font-bold text-primary">Admin Access</h1>
                    <p className="font-sans text-gray-400 text-sm mt-2 uppercase tracking-widest font-bold">Crowned By Etty</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="font-sans text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-2">Admin Email</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-12 py-4 outline-none focus:border-primary focus:bg-white transition-all font-sans"
                                placeholder=""
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <label className="font-sans text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                            <input
                                required
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-12 py-4 outline-none focus:border-primary focus:bg-white transition-all font-sans"
                                placeholder=""
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white font-sans font-bold uppercase tracking-widest py-5 rounded-2xl shadow-xl hover:bg-emerald-800 transition-all flex items-center justify-center gap-3 disabled:bg-gray-200 group"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Enter Dashboard</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">
                        Authorized Personnel Only
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-6 text-[10px] font-bold uppercase tracking-widest text-primary/40 hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <ArrowRight className="w-4 h-4 rotate-180" /> Back to Home
                    </button>
                </div>
            </motion.div>
        </main>
    );
}