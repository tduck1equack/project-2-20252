'use client';

import { useState } from 'react';
import { useProducts, useStockLevels } from '@/hooks/use-inventory';
import { Package, Search, CheckCircle, XCircle } from 'lucide-react';

export default function ProductsPage() {
    const [search, setSearch] = useState('');
    const { data: products, isLoading } = useProducts(search);

    // To check stock availability, we fetch all stocks or check specific?
    // Optimization: fetch global stock (Option A simplified). 
    // Ideally backend adds "totalStock" to ProductDto, but for now we query `useStockLevels`.
    // Actually `useStockLevels` returns ARRAY of stocks.
    // If we want "Is Available", we need sum of quantities.
    const { data: stocks } = useStockLevels(); // Fetches all stocks for user tenant

    const getAvailability = (variantId: string) => {
        if (!stocks) return 'unknown';
        const total = stocks
            .filter(s => s.productVariantId === variantId)
            .reduce((acc, s) => acc + s.quantity, 0);
        return total > 0 ? 'in-stock' : 'out-of-stock';
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[rgb(var(--foreground))]">Our Products</h1>
                <p className="text-[rgb(var(--muted))] mt-1">Browse our tailored selection</p>
            </div>

            {/* Filter */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted))]" />
                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[rgb(var(--primary))] glass-card"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isLoading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="glass-card p-4 h-64 animate-pulse bg-[rgb(var(--muted))]/5 rounded-xl"></div>
                    ))
                ) : products?.map(product => (
                    <div key={product.id} className="glass-card p-0 overflow-hidden flex flex-col h-full group">
                        {/* Image Mockup */}
                        <div className="h-40 bg-[rgb(var(--muted))]/10 flex items-center justify-center group-hover:bg-[rgb(var(--primary))]/5 transition-colors">
                            <Package className="w-12 h-12 text-[rgb(var(--muted))] group-hover:text-[rgb(var(--primary))] transition-colors" />
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <p className="text-sm text-[rgb(var(--muted))] mt-1 line-clamp-2 flex-1">
                                {product.description || 'No description available.'}
                            </p>

                            <div className="mt-4 pt-4 border-t border-[rgb(var(--border))] space-y-2">
                                {/* Variants List */}
                                {product.variants.map(variant => {
                                    const status = getAvailability(variant.id);
                                    return (
                                        <div key={variant.id} className="flex justify-between items-center text-sm">
                                            <span className="font-medium">{variant.name.replace(`${product.name} - `, '')}</span>
                                            <div className="flex items-center gap-1.5">
                                                {status === 'in-stock' ? (
                                                    <>
                                                        <CheckCircle className="w-3.5 h-3.5 text-[rgb(var(--success))]" />
                                                        <span className="text-[rgb(var(--success))] text-xs">In Stock</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="w-3.5 h-3.5 text-[rgb(var(--error))]" />
                                                        <span className="text-[rgb(var(--muted))] text-xs">Out</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!isLoading && products?.length === 0 && (
                <div className="text-center py-12 text-[rgb(var(--muted))]">
                    No products found matching "{search}"
                </div>
            )}
        </div>
    );
}
