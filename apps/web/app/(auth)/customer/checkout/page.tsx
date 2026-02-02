'use client';

import { useState } from 'react';
import { useCartStore } from '@/stores/cart-store';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const [items, totalPrice, clearCart] = useCartStore((s) => [s.items, s.totalPrice, s.clearCart]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [order, setOrder] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPaying, setIsPaying] = useState(false);

    // If empty and not completed, redirect
    if (items.length === 0 && !order) {
        return (
            <div className="p-8 text-center">
                Redirecting...
                {/* Logic to redirect handled via useEffect ideally, but for MVP this is OK */}
            </div>
        );
    }

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            const payload = {
                items: items.map(i => ({
                    productVariantId: i.productVariantId,
                    quantity: i.quantity
                }))
            };

            const res = await api.post('/sales/orders', payload);
            setOrder(res.data);
            clearCart();
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to place order');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePayment = async () => {
        setIsPaying(true);
        try {
            const res = await api.post<{ url: string }>('/payment/create_url', { order });
            window.location.href = res.data.url;
        } catch (err) {
            console.error(err);
            setIsPaying(false);
            setError('Failed to initiate payment');
        }
    };

    if (order) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 animate-fade-in">
                <div className="w-24 h-24 bg-[rgb(var(--success))]/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-[rgb(var(--success))]" />
                </div>
                <h1 className="text-3xl font-bold">Order Confirmed!</h1>
                <p className="text-[rgb(var(--muted))] text-center max-w-md">
                    Thank you for your purchase. Your order code is <span className="font-mono font-bold">{order.code}</span>.
                </p>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                    <button
                        onClick={handlePayment}
                        disabled={isPaying}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                        {isPaying ? <Loader2 className="animate-spin" /> : 'Pay with VNPay'}
                    </button>
                    <Link href="/customer/orders" className="btn-secondary w-full text-center">
                        View Order Details
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            <h1 className="text-3xl font-bold">Checkout</h1>

            <div className="glass-card p-8 space-y-6">
                <h2 className="text-xl font-semibold">Review Order</h2>

                <div className="space-y-4 border-b border-[rgb(var(--border))] pb-6">
                    {items.map(item => (
                        <div key={item.productVariantId} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-3">
                                <span className="bg-[rgb(var(--muted))]/10 px-2 py-1 rounded text-xs font-mono">{item.quantity}x</span>
                                <span>{item.name}</span>
                            </div>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>${totalPrice().toFixed(2)}</span>
                </div>

                {error && (
                    <div className="bg-[rgb(var(--error))]/10 text-[rgb(var(--error))] p-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full btn-primary h-12 text-lg flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        'Place Order'
                    )}
                </button>
            </div>
        </div>
    );
}
