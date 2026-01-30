'use client';

import { useState } from 'react';
import { Package, Search, ShoppingCart, Eye, Star, Filter } from 'lucide-react';

// Mock product data
const products = [
    { id: '1', name: 'Industrial Gears Set', sku: 'GEAR-001', price: 1250000, category: 'Machinery', rating: 4.5, stock: 156, image: '🔧' },
    { id: '2', name: 'Steel Ball Bearings', sku: 'BEAR-002', price: 450000, category: 'Components', rating: 4.8, stock: 320, image: '⚙️' },
    { id: '3', name: 'Hydraulic Pump Unit', sku: 'PUMP-003', price: 8500000, category: 'Machinery', rating: 4.2, stock: 28, image: '🔩' },
    { id: '4', name: 'Stainless Steel Bolts (100pc)', sku: 'BOLT-004', price: 180000, category: 'Fasteners', rating: 4.9, stock: 1200, image: '🔩' },
    { id: '5', name: 'Electric Motor 3HP', sku: 'MOTR-005', price: 3200000, category: 'Electrical', rating: 4.6, stock: 45, image: '⚡' },
    { id: '6', name: 'Conveyor Belt 10m', sku: 'CONV-006', price: 5600000, category: 'Machinery', rating: 4.3, stock: 12, image: '🏭' },
];

const categories = ['All', 'Machinery', 'Components', 'Fasteners', 'Electrical'];

function formatPrice(price: number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

export default function ProductsPage() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');

    const filtered = products.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
        const matchCategory = category === 'All' || p.category === category;
        return matchSearch && matchCategory;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[rgb(var(--foreground))]">Product Catalog</h1>
                    <p className="text-[rgb(var(--muted))]">Browse and order products</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted))]" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-lg bg-[rgb(var(--surface-elevated))] border border-[rgb(var(--border))] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <Filter className="w-4 h-4 text-[rgb(var(--muted))]" />
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${category === cat
                                ? 'bg-[rgb(var(--primary))] text-white'
                                : 'bg-[rgb(var(--surface-elevated))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product) => (
                    <div key={product.id} className="glass-card p-6 stat-card">
                        {/* Product Image Placeholder */}
                        <div className="w-full h-32 rounded-lg bg-[rgb(var(--surface-elevated))] flex items-center justify-center text-4xl mb-4">
                            {product.image}
                        </div>

                        {/* Info */}
                        <div className="space-y-2">
                            <div className="flex items-start justify-between">
                                <h3 className="font-semibold text-[rgb(var(--foreground))]">{product.name}</h3>
                                <span className="flex items-center gap-1 text-xs text-[rgb(var(--warning))]">
                                    <Star className="w-3 h-3 fill-current" />
                                    {product.rating}
                                </span>
                            </div>
                            <p className="text-xs text-[rgb(var(--muted))]">SKU: {product.sku}</p>
                            <p className="text-lg font-bold text-[rgb(var(--primary))]">{formatPrice(product.price)}</p>
                            <div className="flex items-center justify-between pt-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 50
                                        ? 'bg-[rgb(var(--success))]/10 text-[rgb(var(--success))]'
                                        : product.stock > 10
                                            ? 'bg-[rgb(var(--warning))]/10 text-[rgb(var(--warning))]'
                                            : 'bg-[rgb(var(--error))]/10 text-[rgb(var(--error))]'
                                    }`}>
                                    {product.stock} in stock
                                </span>
                                <div className="flex gap-2">
                                    <button className="p-2 rounded-lg bg-[rgb(var(--surface-elevated))] hover:bg-[rgb(var(--border))] transition-colors cursor-pointer" title="View details">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 rounded-lg bg-[rgb(var(--primary))] text-white hover:opacity-90 transition-opacity cursor-pointer" title="Add to cart">
                                        <ShoppingCart className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filtered.length === 0 && (
                <div className="text-center py-12">
                    <Package className="w-12 h-12 mx-auto text-[rgb(var(--muted))] mb-4" />
                    <p className="text-[rgb(var(--muted))]">No products found</p>
                </div>
            )}
        </div>
    );
}
