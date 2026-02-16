"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, ShoppingBag, Users, MessageSquare,
    TrendingUp, Clock, CheckCircle2, Truck, ExternalLink,
    MoreVertical, Search, X, ShieldAlert, Trash2, Eye,
    Package, RotateCcw, Settings, Palette, Upload, Globe, Loader2, Plus
} from "lucide-react";
import { useAdminStore } from "@/store/adminStore";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const { isAuthenticated, setLogout } = useAdminStore();
    const router = useRouter();

    // --- State Management ---
    const [activeTab, setActiveTab] = useState("orders");
    const [orders, setOrders] = useState<any[]>([]);
    const [inventory, setInventory] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    // UI States
    const [isSaving, setIsSaving] = useState(false);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    // New Product Form State
    const [newProduct, setNewProduct] = useState({
        name: "", price: "", stock: "", threshold: "5",
        description: "", howToUse: "", ingredients: "", image: ""
    });

    // Global Brand Settings State
    const [brandSettings, setBrandSettings] = useState({
        storeName: "Crowned By Etty",
        logoUrl: "",
        themeColors: {
            primary: "#1A3614",
            accent: "#D4AF37"
        },
        socialLinks: {
            instagram: "https://instagram.com/crownedbyetty",
            whatsapp: "233540000000",
            tiktok: "",
            facebook: "",
            snapchat: ""
        }
    });

    useEffect(() => {
        if (!isAuthenticated) router.push("/admin/login");
        fetchDashboardData();
    }, [isAuthenticated]);

    const fetchDashboardData = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        try {
            // Fetch Settings
            const settingsRes = await fetch(`${apiUrl}/api/settings`);
            if (settingsRes.ok) {
                const data = await settingsRes.json();
                setBrandSettings(prev => ({
                    ...prev,
                    ...data,
                    themeColors: { ...prev.themeColors, ...data.themeColors },
                    socialLinks: { ...prev.socialLinks, ...data.socialLinks }
                }));
            }

            // Fetch Products (Inventory)
            const prodRes = await fetch(`${apiUrl}/api/products`);
            if (prodRes.ok) setInventory(await prodRes.json());

            // Fetch Orders
            const orderRes = await fetch(`${apiUrl}/api/orders`);
            if (orderRes.ok) setOrders(await orderRes.json());
        } catch (e) {
            console.error("Dashboard fetch error:", e);
        }
    };

    // --- Handlers ---
    const handleSaveGlobalSettings = async () => {
        setIsSaving(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        try {
            const response = await fetch(`${apiUrl}/api/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(brandSettings)
            });
            if (response.ok) {
                alert("Global Brand Settings Updated!");
                window.location.reload();
            }
        } catch (err) {
            alert("Error updating settings.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        try {
            const res = await fetch(`${apiUrl}/api/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            setNewProduct(prev => ({ ...prev, image: data.imagePath }));
        } catch (error) {
            console.error(error);
            alert("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        try {
            const res = await fetch(`${apiUrl}/api/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            });
            if (res.ok) {
                fetchDashboardData();
                setIsProductModalOpen(false);
                setNewProduct({ name: "", price: "", stock: "", threshold: "5", description: "", howToUse: "", ingredients: "", image: "" });
            }
        } catch (e) {
            alert("Failed to save product.");
        } finally {
            setIsSaving(false);
        }
    };

    const updateOrderStatus = async (id: string, newStatus: string) => {
        setOrders(orders.map((o: any) => o.id === id ? { ...o, status: newStatus } : o));
        setSelectedOrder(null);
        // Backend update logic would go here
    };

    if (!isAuthenticated) return null;

    return (
        <main className="min-h-screen bg-[#F8F9FA] flex flex-col lg:flex-row font-sans text-primary">

            {/* SIDEBAR (Desktop) / TOPBAR (Mobile) */}
            <nav className="w-full lg:w-64 bg-primary text-white p-6 flex lg:flex-col justify-between items-center lg:items-start lg:min-h-screen sticky top-0 z-50">
                <div className="flex flex-col">
                    <span className="font-serif text-xl font-bold tracking-widest uppercase text-white">CROWNED</span>
                    <span className="font-sans text-[8px] font-bold tracking-[0.4em] text-accent uppercase -mt-1 hidden lg:block">ADMIN CONSOLE</span>
                </div>

                <div className="hidden lg:flex flex-col gap-4 mt-12 w-full">
                    <NavBtn active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ShoppingBag size={18} />} label="Orders" />
                    <NavBtn active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} icon={<Package size={18} />} label="Inventory" />
                    <NavBtn active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} icon={<MessageSquare size={18} />} label="Review Lab" />
                    <NavBtn active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={18} />} label="Settings" />
                </div>

                <button onClick={setLogout} className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-accent transition-colors">Logout</button>
            </nav>

            {/* MOBILE BOTTOM NAVIGATION */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-around items-center p-4 z-50 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <MobileNavBtn active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ShoppingBag size={20} />} label="Orders" />
                <MobileNavBtn active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} icon={<Package size={20} />} label="Stock" />
                <MobileNavBtn active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} icon={<MessageSquare size={20} />} label="Reviews" />
                <MobileNavBtn active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={20} />} label="Settings" />
            </div>

            <section className="flex-1 p-4 md:p-8 lg:p-12 relative pb-32 lg:pb-12">

                {/* KPI HEADER */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    <StatCard label="Live Orders" value={orders.length.toString()} color="text-primary" />
                    <StatCard label="In Stock" value={inventory.length.toString()} color="text-emerald-600" />
                    <StatCard label="Low Stock" value={inventory.filter((p: any) => p.stock <= p.threshold).length.toString()} color="text-red-600" />
                    <StatCard label="Feedback" value="4.9/5.0" color="text-blue-600" />
                </div>

                <AnimatePresence mode="wait">
                    {/* TAB: ORDERS */}
                    {activeTab === "orders" && (
                        <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center">
                                    <h2 className="font-serif text-2xl font-bold text-primary">Live Orders</h2>
                                    <div className="bg-gray-100 p-2 rounded-lg flex items-center gap-2 px-3">
                                        <Search size={14} className="text-gray-400" />
                                        <input type="text" placeholder="Search Order ID..." className="bg-transparent text-xs outline-none w-32" />
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                            <tr>
                                                <th className="px-6 py-4">Ref</th>
                                                <th className="px-6 py-4">Customer</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-right">View</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {orders.map((order: any) => (
                                                <tr key={order.id || order._id} className="hover:bg-gray-50/20 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-primary">{order.orderId || order.id}</td>
                                                    <td className="px-6 py-4 text-gray-600">{order.customer?.name || order.customer}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{order.status}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button onClick={() => setSelectedOrder(order)} className="p-2 hover:bg-white border rounded-lg shadow-sm transition-all"><Eye size={16} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* TAB: INVENTORY */}
                    {activeTab === "inventory" && (
                        <motion.div key="inventory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="font-serif text-3xl font-bold text-primary">Product Inventory</h2>
                                <button
                                    onClick={() => setIsProductModalOpen(true)}
                                    className="bg-primary text-white px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-xl hover:bg-emerald-800 transition-all flex items-center gap-2"
                                >
                                    <Plus size={16} /> Add New Product
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {inventory.length === 0 ? (
                                    <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-[3rem]">
                                        <Package className="mx-auto text-gray-200 w-12 h-12 mb-4" />
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No products in database.</p>
                                    </div>
                                ) : (
                                    inventory.map((prod: any) => (
                                        <div key={prod._id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                                            {prod.stock <= prod.threshold && <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse" />}
                                            <div className="mb-4">
                                                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1">GH₵ {prod.price}</p>
                                                <h3 className="font-serif text-xl font-bold text-primary">{prod.name}</h3>
                                            </div>

                                            {/* Product Image Preview */}
                                            {prod.image && (
                                                <div className="w-full h-32 bg-gray-50 rounded-xl mb-4 overflow-hidden relative">
                                                    <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${prod.image}`} alt={prod.name} className="object-cover w-full h-full" />
                                                </div>
                                            )}

                                            <div className="flex items-end justify-between">
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available</p>
                                                    <p className={`text-4xl font-black ${prod.stock <= prod.threshold ? 'text-red-500' : 'text-primary'}`}>{prod.stock}</p>
                                                </div>
                                                <button className="p-3 bg-gray-50 rounded-2xl hover:bg-primary hover:text-white transition-all"><RotateCcw size={18} /></button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* TAB: SETTINGS */}
                    {activeTab === "settings" && (
                        <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8 max-w-4xl">
                            <div className="flex flex-col">
                                <h2 className="font-serif text-4xl font-bold text-primary">Master Brand Settings</h2>
                                <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest font-bold">Configure Global Identity</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700 flex items-center gap-2"><Palette size={14} /> Theme Palette</h3>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Primary Color</span>
                                            <div className="flex items-center gap-4">
                                                <input type="color" value={brandSettings.themeColors.primary} onChange={(e) => setBrandSettings({ ...brandSettings, themeColors: { ...brandSettings.themeColors, primary: e.target.value } })} className="w-12 h-12 rounded-xl border-none cursor-pointer" />
                                                <input type="text" value={brandSettings.themeColors.primary} className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-mono" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Accent Color</span>
                                            <div className="flex items-center gap-4">
                                                <input type="color" value={brandSettings.themeColors.accent} onChange={(e) => setBrandSettings({ ...brandSettings, themeColors: { ...brandSettings.themeColors, accent: e.target.value } })} className="w-12 h-12 rounded-xl border-none cursor-pointer" />
                                                <input type="text" value={brandSettings.themeColors.accent} className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-mono" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700 flex items-center gap-2"><Globe size={14} /> Presence</h3>
                                    <div className="space-y-5">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Brand Logo</span>
                                            <div className="flex items-center gap-4">
                                                <label className={`flex-1 bg-gray-50 border-2 border-dashed ${brandSettings.logoUrl ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'} rounded-xl px-4 py-4 cursor-pointer hover:bg-gray-100 transition-all flex items-center justify-center gap-2 group`}>
                                                    <input type="file" accept="image/*" onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;

                                                        const formData = new FormData();
                                                        formData.append('image', file);

                                                        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                                                        try {
                                                            const res = await fetch(`${apiUrl}/api/upload`, { method: 'POST', body: formData });
                                                            if (res.ok) {
                                                                const data = await res.json();
                                                                setBrandSettings(prev => ({ ...prev, logoUrl: data.imagePath }));
                                                            }
                                                        } catch (err) { console.error("Logo upload failed", err); }
                                                    }} className="hidden" />
                                                    <Upload className="text-gray-300 group-hover:text-primary transition-colors" size={20} />
                                                    <span className="text-xs font-bold text-gray-400 group-hover:text-primary">Upload Logo</span>
                                                </label>
                                                {brandSettings.logoUrl && (
                                                    <div className="relative group/logo">
                                                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                                            <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${brandSettings.logoUrl}`} alt="Logo" className="w-full h-full object-cover" />
                                                        </div>
                                                        <button
                                                            onClick={() => setBrandSettings(prev => ({ ...prev, logoUrl: "" }))}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover/logo:opacity-100 transition-opacity shadow-sm"
                                                            title="Remove Logo"
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-1"><span className="text-[10px] font-bold text-gray-400 uppercase">Store Name</span><input type="text" value={brandSettings.storeName} onChange={(e) => setBrandSettings({ ...brandSettings, storeName: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold" /></div>

                                        <div className="space-y-1"><span className="text-[10px] font-bold text-gray-400 uppercase">Instagram URL</span><input type="text" value={brandSettings.socialLinks.instagram} onChange={(e) => setBrandSettings({ ...brandSettings, socialLinks: { ...brandSettings.socialLinks, instagram: e.target.value } })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs" /></div>

                                        <div className="space-y-1"><span className="text-[10px] font-bold text-gray-400 uppercase">WhatsApp Admin</span><input type="text" value={brandSettings.socialLinks.whatsapp} onChange={(e) => setBrandSettings({ ...brandSettings, socialLinks: { ...brandSettings.socialLinks, whatsapp: e.target.value } })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs" /></div>

                                        <div className="space-y-1"><span className="text-[10px] font-bold text-gray-400 uppercase">Facebook URL</span><input type="text" value={brandSettings.socialLinks.facebook} onChange={(e) => setBrandSettings({ ...brandSettings, socialLinks: { ...brandSettings.socialLinks, facebook: e.target.value } })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs" /></div>

                                        <div className="space-y-1"><span className="text-[10px] font-bold text-gray-400 uppercase">TikTok URL</span><input type="text" value={brandSettings.socialLinks.tiktok} onChange={(e) => setBrandSettings({ ...brandSettings, socialLinks: { ...brandSettings.socialLinks, tiktok: e.target.value } })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs" /></div>

                                        <div className="space-y-1"><span className="text-[10px] font-bold text-gray-400 uppercase">Snapchat URL</span><input type="text" value={brandSettings.socialLinks.snapchat} onChange={(e) => setBrandSettings({ ...brandSettings, socialLinks: { ...brandSettings.socialLinks, snapchat: e.target.value } })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs" /></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button onClick={handleSaveGlobalSettings} disabled={isSaving} className="bg-primary text-white px-10 py-5 rounded-3xl font-bold text-[11px] uppercase tracking-widest shadow-2xl flex items-center gap-3 disabled:opacity-50">
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 size={18} />}
                                    <span>Sync Branding to Live Site</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* MODAL: ORDER UPDATE */}
                <AnimatePresence>
                    {selectedOrder && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-primary/60 backdrop-blur-md" />
                            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl">
                                <div className="flex justify-between items-start mb-10">
                                    <div><h3 className="font-serif text-3xl font-bold text-primary">Shipment Log</h3><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Ref: {selectedOrder.orderId || selectedOrder.id}</p></div>
                                    <button onClick={() => setSelectedOrder(null)} className="p-3 bg-gray-50 rounded-full hover:bg-gray-100"><X size={20} /></button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <StatusUpdateBtn label="Processing" active={selectedOrder.status === 'Processing'} onClick={() => updateOrderStatus(selectedOrder.id, 'Processing')} icon={<Clock size={16} />} />
                                    <StatusUpdateBtn label="In Transit" active={selectedOrder.status === 'In Transit'} onClick={() => updateOrderStatus(selectedOrder.id, 'In Transit')} icon={<Truck size={16} />} />
                                    <StatusUpdateBtn label="Delivered" active={selectedOrder.status === 'Delivered'} onClick={() => updateOrderStatus(selectedOrder.id, 'Delivered')} icon={<CheckCircle2 size={16} />} />
                                    <StatusUpdateBtn label="Problem" active={selectedOrder.status === 'Problem'} onClick={() => updateOrderStatus(selectedOrder.id, 'Problem')} icon={<ShieldAlert size={16} />} />
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* MODAL: ADD PRODUCT */}
                <AnimatePresence>
                    {isProductModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProductModalOpen(false)} className="absolute inset-0 bg-primary/60 backdrop-blur-md" />
                            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-start mb-8"><h3 className="font-serif text-3xl font-bold text-primary">New Product</h3><button onClick={() => setIsProductModalOpen(false)} className="p-2 bg-gray-50 rounded-full"><X /></button></div>
                                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-primary">
                                    <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</label><input required type="text" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm font-bold" placeholder="Raw Stimulating Oil" /></div>
                                    <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price (GH₵)</label><input required type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm font-bold" /></div>
                                    <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock</label><input required type="number" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm font-bold" /></div>
                                    <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alert Threshold</label><input type="number" value={newProduct.threshold} onChange={e => setNewProduct({ ...newProduct, threshold: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm font-bold" /></div>

                                    <div className="md:col-span-2 space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product Image</label>
                                        <div className="flex items-center gap-4">
                                            <label className={`flex-1 bg-gray-50 border-2 border-dashed ${newProduct.image ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'} rounded-xl px-4 py-6 cursor-pointer hover:bg-gray-100 transition-all flex flex-col items-center justify-center gap-2 group`}>
                                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                {uploading ? (
                                                    <Loader2 className="animate-spin text-gray-400" />
                                                ) : newProduct.image ? (
                                                    <>
                                                        <CheckCircle2 className="text-emerald-600" size={24} />
                                                        <span className="text-xs font-bold text-emerald-700">Image Uploaded</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="text-gray-300 group-hover:text-primary transition-colors" size={24} />
                                                        <span className="text-xs font-bold text-gray-400 group-hover:text-primary">Click to Upload</span>
                                                    </>
                                                )}
                                            </label>
                                            {newProduct.image && (
                                                <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden border border-gray-200">
                                                    <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${newProduct.image}`} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label><textarea value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm h-24" /></div>
                                    <div className="md:col-span-2"><button type="submit" disabled={isSaving || uploading} className="w-full bg-primary text-white py-5 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50">{isSaving ? <Loader2 className="animate-spin" /> : <CheckCircle2 />} Create Product</button></div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </section>
        </main>
    );
}

// --- Helper Components ---
function NavBtn({ icon, label, active, onClick }: any) {
    return <button onClick={onClick} className={`flex items-center gap-4 px-6 py-5 rounded-[1.5rem] transition-all text-xs font-bold w-full ${active ? 'bg-white text-primary shadow-2xl scale-105' : 'text-white/50 hover:text-white hover:bg-white/10'}`}>{icon} {label}</button>;
}
function StatCard({ label, value, color }: any) {
    return <div className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-gray-100"><p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">{label}</p><p className={`text-2xl font-black ${color}`}>{value}</p></div>;
}
function StatusUpdateBtn({ label, active, onClick, icon }: any) {
    return <button onClick={onClick} className={`flex flex-col items-center justify-center gap-4 p-8 rounded-[2.5rem] border-2 transition-all font-bold text-xs ${active ? 'border-primary bg-primary/5 text-primary' : 'border-gray-50 text-gray-400 hover:border-primary/20 hover:bg-gray-50'}`}>{icon} {label}</button>;
}

function MobileNavBtn({ icon, label, active, onClick }: any) {
    return (
        <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-primary scale-110' : 'text-gray-300'}`}>
            <div className={`p-2 rounded-xl ${active ? 'bg-primary/5' : 'bg-transparent'}`}>{icon}</div>
            <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
        </button>
    );
}