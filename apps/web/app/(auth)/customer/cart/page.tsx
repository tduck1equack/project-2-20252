'use client';

import { useCartStore } from '@/stores/cart-store';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();
    const router = useRouter();

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 animate-fade-in">
                <div className="w-20 h-20 bg-[rgb(var(--muted))]/10 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-[rgb(var(--muted))]" />
                </div>
                <h2 className="text-xl font-semibold">Your cart is empty</h2>
                <p className="text-[rgb(var(--muted))]">Looks like you haven't added anything yet.</p>
                <Link href="/customer/products" className="btn-primary mt-4">
                    Brows Products
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <h1 className="text-3xl font-bold">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div key={item.productVariantId} className="glass-card p-4 flex items-center gap-4">
                            <div className="w-20 h-20 bg-[rgb(var(--muted))]/10 rounded-lg flex-shrink-0 flex items-center justify-center">
                                <ShoppingBag className="w-8 h-8 text-[rgb(var(--muted))]" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold truncate">{item.name}</h3>
                                <p className="text-sm text-[rgb(var(--muted))]">${item.price.toFixed(2)}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <select
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.productVariantId, Number(e.target.value))}
                                    className="bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded px-2 py-1 text-sm focus:outline-none"
                                >
                                    {[1, 2, 3, 4, 5, 10].map(num => (
                                        <option key={num} value={num}>{num}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => removeItem(item.productVariantId)}
                                    className="text-[rgb(var(--error))] hover:bg-[rgb(var(--error))]/10 p-2 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    <button onClick={clearCart} className="text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] underline">
                        Clear Cart
                    </button>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6 sticky top-24">
                        <h3 className="font-semibold text-lg mb-4">Order Summary</h3>

                        <div className="space-y-2 mb-6 text-sm">
                            <div className="flex justify-between">
                                <span className="text-[rgb(var(--muted))]">Subtotal</span>
                                <span>${totalPrice().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[rgb(var(--muted))]">Tax</span>
                                <span>$0.00</span>
                            </div>
                            <div className="pt-2 border-t border-[rgb(var(--border))] flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${totalPrice().toFixed(2)}</span>
                            </div>
                        </div>

                        <Link href="/customer/checkout" className="w-full btn-primary flex items-center justify-center gap-2">
                            Proceed to Checkout
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
