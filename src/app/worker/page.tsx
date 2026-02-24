"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/lib/AppContext';

export default function WorkerView() {
    const { products } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products;
        return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm, products]);

    return (
        <div className="min-h-screen p-6 max-w-4xl mx-auto animate-fade-in relative z-10">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <Link href="/" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 mb-2 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">Sales Directory</h1>
                    <p className="text-slate-400 mt-1">Search for products to view the final sales rate.</p>
                </div>

                <div className="glass-panel px-4 py-2 flex items-center space-x-2 w-fit">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <span className="text-emerald-400 font-bold">W</span>
                    </div>
                    <span className="font-semibold text-white">Salesperson View</span>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </div>
                <input
                    type="text"
                    className="glass-input pl-11 py-4 text-lg border-emerald-500/30 focus:border-emerald-500 shadow-[0_4px_20px_rgba(16,185,129,0.05)] focus:shadow-[0_4px_20px_rgba(16,185,129,0.2)]"
                    placeholder="Search products by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
                <div className="glass-panel p-12 text-center flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="text-xl font-medium text-slate-300">No products found</h3>
                    {searchTerm ? (
                        <p className="text-slate-500 mt-2">Try adjusting your search term.</p>
                    ) : (
                        <p className="text-slate-500 mt-2">The owner hasn't added any items yet.</p>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProducts.map((p, index) => (
                        <div
                            key={p.id}
                            className={`glass-panel p-6 flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300 
                animate-fade-in`}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">{p.name}</h3>
                                <p className="text-xs text-slate-500">
                                    Last updated: {new Date(p.lastUpdated).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20 text-center">
                                <span className="block text-sm text-emerald-400 font-medium mb-1">Total Sales Rate</span>
                                <span className="text-3xl font-bold text-white">₹ {p.salesRate}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}
