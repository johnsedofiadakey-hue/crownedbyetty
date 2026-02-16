"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Instagram, Smartphone, Facebook, ShieldCheck, MapPin, Mail } from "lucide-react";

export default function Footer() {
    const [mounted, setMounted] = useState(false);
    const [settings, setSettings] = useState({
        storeName: "Crowned By Etty",
        socialLinks: {
            instagram: "https://instagram.com/crownedbyetty",
            whatsapp: "233540000000",
            tiktok: "",
            facebook: "",
            snapchat: ""
        }
    });

    useEffect(() => {
        setMounted(true);
        // Fetch live settings to update social links
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/settings`);
                if (res.ok) {
                    const data = await res.json();
                    setSettings(prev => ({
                        ...prev,
                        ...data,
                        socialLinks: { ...prev.socialLinks, ...data.socialLinks }
                    }));
                }
            } catch (e) {
                console.log("Using default footer links.");
            }
        };
        fetchSettings();
    }, []);

    if (!mounted) return null;

    return (
        <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                    {/* Brand Identity */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/">
                            <div className="flex flex-col mb-6 cursor-pointer">
                                <span className="font-serif text-2xl font-black tracking-widest text-primary uppercase">
                                    Crowned
                                </span>
                                <span className="font-sans text-[9px] font-bold tracking-[0.4em] text-accent uppercase -mt-1">
                                    By Etty
                                </span>
                            </div>
                        </Link>
                        <p className="font-sans text-sm text-gray-500 leading-relaxed">
                            Luxurious, raw botanical hair growth solutions crafted for modern royalty. 100% Organic.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-serif text-lg font-bold text-primary mb-6">Explore</h4>
                        <ul className="space-y-4 font-sans text-sm text-gray-500 font-medium">
                            <li><Link href="/collection" className="hover:text-accent transition-colors">The Collection</Link></li>
                            <li><Link href="/raw-ingredients" className="hover:text-accent transition-colors">Our Ingredients</Link></li>
                            <li><Link href="/track" className="hover:text-accent transition-colors">Track Your Order</Link></li>
                        </ul>
                    </div>

                    {/* Contact Details */}
                    <div>
                        <h4 className="font-serif text-lg font-bold text-primary mb-6">Contact</h4>
                        <ul className="space-y-4 font-sans text-sm text-gray-500 font-medium">
                            <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-accent" /> support@crownedbyetty.com</li>
                            <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-accent" /> Accra, Ghana</li>
                        </ul>
                    </div>

                    {/* Social Links (Managed via Admin Settings) */}
                    <div>
                        <h4 className="font-serif text-lg font-bold text-primary mb-6">Connect</h4>
                        <div className="flex gap-4">
                            {settings.socialLinks.instagram && (
                                <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-primary hover:bg-emerald-600 hover:text-white transition-all transform hover:scale-110">
                                    <Instagram className="w-5 h-5" />
                                </a>
                            )}
                            {settings.socialLinks.whatsapp && (
                                <a href={`https://wa.me/${settings.socialLinks.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-primary hover:bg-emerald-600 hover:text-white transition-all transform hover:scale-110">
                                    <Smartphone className="w-5 h-5" />
                                </a>
                            )}
                            {settings.socialLinks.facebook && (
                                <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-primary hover:bg-emerald-600 hover:text-white transition-all transform hover:scale-110">
                                    <Facebook className="w-5 h-5" />
                                </a>
                            )}
                            {settings.socialLinks.tiktok && (
                                <a href={settings.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-primary hover:bg-emerald-600 hover:text-white transition-all transform hover:scale-110">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
                                </a>
                            )}
                            {settings.socialLinks.snapchat && (
                                <a href={settings.socialLinks.snapchat} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-primary hover:bg-emerald-600 hover:text-white transition-all transform hover:scale-110">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.65 19.14c-2.45-.6-3.8-1.57-4-3.56-.25-2.07.6-3.7 2.34-4.5 1.74-.8 2.05-2.13 1.96-3.32-.1-1.18-.7-2-2.3-1.63-.6-.82-.72-1.87-.27-2.7C9.36 1.45 10.92 1 12 1c1.08 0 2.64.45 3.63 2.43.44.83.33 1.88-.27 2.7-1.6-.37-2.2.45-2.3 1.63-.1 1.2.22 2.52 1.96 3.32 1.74.8 2.59 2.43 2.34 4.5-.2 1.99-1.55 2.96-4 3.56-.73.18-1 .6-1 1.34 0 .74.27 1.16 1 1.34 3 .73 4.45 2.29 4.63 4.18.06.63-.33 1.18-.94 1.33-1.4.35-3.07.67-5.05.67-1.98 0-3.65-.32-5.05-.67-.61-.15-1-.7-1-1.33.18-1.89 1.63-3.45 4.63-4.18.73-.18 1-.6 1-1.34 0-.74-.27-1.16-1-1.34z" /></svg>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar & Hidden Admin Portal */}
                <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-sans font-bold text-gray-400 uppercase tracking-widest">
                        © 2026 {settings.storeName}. All Rights Reserved.
                    </p>

                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-primary transition-all">Privacy Policy</Link>

                        {/* The Hidden Admin Entrance */}
                        <Link href="/admin/login" className="group flex items-center gap-1.5 text-[10px] font-bold text-gray-200 uppercase tracking-widest hover:text-accent transition-all">
                            <ShieldCheck className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span>Staff Portal</span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}