"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Product = {
    id: string;
    name: string;
    purchaseRate: number;
    profitAmount: number;
    salesRate: number;
    imageUrl?: string;
    lastUpdated: string;
};

type AppContextType = {
    products: Product[];
    addProduct: (product: Omit<Product, 'id' | 'salesRate' | 'lastUpdated'>) => void;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('wholesale_products');
        if (saved) {
            try {
                setProducts(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse saved products", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever products change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('wholesale_products', JSON.stringify(products));
        }
    }, [products, isLoaded]);

    const addProduct = (productData: Omit<Product, 'id' | 'salesRate' | 'lastUpdated'>) => {
        const newProduct: Product = {
            ...productData,
            id: crypto.randomUUID(),
            salesRate: Number(productData.purchaseRate) + Number(productData.profitAmount),
            lastUpdated: new Date().toISOString(),
        };
        setProducts(prev => [newProduct, ...prev]);
    };

    const updateProduct = (id: string, updates: Partial<Product>) => {
        setProducts(prev => prev.map(p => {
            if (p.id === id) {
                const updated = { ...p, ...updates };
                // Recalculate sales rate if purchase rate or profit changes
                if ('purchaseRate' in updates || 'profitAmount' in updates) {
                    updated.salesRate = Number(updated.purchaseRate) + Number(updated.profitAmount);
                }
                updated.lastUpdated = new Date().toISOString();
                return updated;
            }
            return p;
        }));
    };

    const deleteProduct = (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    return (
        <AppContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}
