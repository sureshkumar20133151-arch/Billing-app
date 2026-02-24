"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppContext, Product } from '@/lib/AppContext';

export default function OwnerDashboard() {
    const { products, addProduct, updateProduct, deleteProduct } = useAppContext();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    // New product form directly
    const [newProductName, setNewProductName] = useState('');
    const [newPurchaseRate, setNewPurchaseRate] = useState('');
    const [newProfitAmount, setNewProfitAmount] = useState('');

    const handleSimulateUpload = () => {
        setIsUploading(true);
        // Simulate image parsing delay
        setTimeout(() => {
            // Mock generated products from OCR
            addProduct({
                name: "Aashirvaad Atta 5kg",
                purchaseRate: 210,
                profitAmount: 40,
                imageUrl: "https://via.placeholder.com/150",
            });
            addProduct({
                name: "Tata Salt 1kg",
                purchaseRate: 18,
                profitAmount: 5,
                imageUrl: "https://via.placeholder.com/150",
            });
            setIsUploading(false);
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000);
        }, 2000);
    };

    const handleManualAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProductName || !newPurchaseRate || !newProfitAmount) return;

        addProduct({
            name: newProductName,
            purchaseRate: Number(newPurchaseRate),
            profitAmount: Number(newProfitAmount),
        });

        setNewProductName('');
        setNewPurchaseRate('');
        setNewProfitAmount('');
    };

    return (
        <div className="min-h-screen p-6 max-w-6xl mx-auto animate-fade-in relative z-10">

            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <Link href="/" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 mb-2 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-emerald-400">Owner Dashboard</h1>
                    <p className="text-slate-400 mt-1">Manage purchase rates and set your profit margins.</p>
                </div>

                <div className="glass-panel px-4 py-2 flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <span className="text-purple-400 font-bold">O</span>
                    </div>
                    <span className="font-semibold text-white">Admin View</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Upload & Add */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Invoice Uploader */}
                    <div className="glass-panel p-6">
                        <h2 className="text-xl font-bold mb-4 text-white flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Upload Invoice
                        </h2>
                        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isUploading ? 'border-purple-500 bg-purple-500/10' : 'border-slate-600 hover:border-emerald-400 hover:bg-emerald-400/5'}`}>

                            {isUploading ? (
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mb-4"></div>
                                    <p className="text-purple-300">Extracting products using AI...</p>
                                </div>
                            ) : uploadSuccess ? (
                                <div className="flex flex-col items-center text-emerald-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <p className="font-semibold">Invoice Scanned Successfully!</p>
                                </div>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <p className="text-slate-300 mb-4 text-sm">Snap a photo of the bill to auto-extract purchase rates.</p>
                                    <button onClick={handleSimulateUpload} className="glass-button w-full text-sm">
                                        Simulate Upload
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Manual Add */}
                    <div className="glass-panel p-6 delay-100">
                        <h2 className="text-xl font-bold mb-4 text-white">Manual Entry</h2>
                        <form onSubmit={handleManualAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Product Name</label>
                                <input required type="text" className="glass-input" placeholder="e.g. Rice 25kg" value={newProductName} onChange={e => setNewProductName(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Purchase Rate</label>
                                    <input required type="number" min="0" step="0.01" className="glass-input text-amber-300" placeholder="₹ 0.00" value={newPurchaseRate} onChange={e => setNewPurchaseRate(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">+ Profit</label>
                                    <input required type="number" min="0" step="0.01" className="glass-input text-emerald-300" placeholder="₹ 0.00" value={newProfitAmount} onChange={e => setNewProfitAmount(e.target.value)} />
                                </div>
                            </div>
                            <div className="pt-2 border-t border-slate-700/50 flex justify-between items-center px-1">
                                <span className="text-sm text-slate-400">Calculated Sales Rate:</span>
                                <span className="text-lg font-bold text-white">
                                    ₹ {(Number(newPurchaseRate) || 0) + (Number(newProfitAmount) || 0)}
                                </span>
                            </div>
                            <button type="submit" className="glass-button w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30">
                                Add Product
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Pricing Table */}
                <div className="lg:col-span-2 glass-panel p-6 delay-200">
                    <h2 className="text-2xl font-bold mb-6 text-white flex justify-between items-center">
                        Pricing Configuration
                        <span className="text-sm font-normal text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full">{products.length} Items</span>
                    </h2>

                    <div className="overflow-x-auto">
                        {products.length === 0 ? (
                            <div className="text-center py-16 text-slate-400 bg-slate-800/20 rounded-xl border border-dashed border-slate-700">
                                <p>No products added yet.</p>
                                <p className="text-sm mt-2">Upload an invoice or add items manually.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-700/50 text-slate-400 text-sm">
                                        <th className="pb-3 px-4 font-medium">Product Name</th>
                                        <th className="pb-3 px-4 font-medium min-w-[120px]">Purchase ₹</th>
                                        <th className="pb-3 px-4 font-medium min-w-[120px]">+ Profit ₹</th>
                                        <th className="pb-3 px-4 font-medium text-emerald-400 min-w-[120px]">Sales Rate ₹</th>
                                        <th className="pb-3 px-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p) => (
                                        <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group">
                                            <td className="py-4 px-4 font-medium text-white">{p.name}</td>
                                            <td className="py-4 px-4">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={p.purchaseRate}
                                                    onChange={(e) => updateProduct(p.id, { purchaseRate: Number(e.target.value) })}
                                                    className="glass-input py-1 px-2 w-[100px] text-amber-300"
                                                />
                                            </td>
                                            <td className="py-4 px-4">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={p.profitAmount}
                                                    onChange={(e) => updateProduct(p.id, { profitAmount: Number(e.target.value) })}
                                                    className="glass-input py-1 px-2 w-[80px] text-emerald-300 border-emerald-500/30 focus:border-emerald-500"
                                                />
                                            </td>
                                            <td className="py-4 px-4 font-bold text-lg text-emerald-400">
                                                {p.salesRate}
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <button
                                                    onClick={() => deleteProduct(p.id)}
                                                    className="text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-2"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
