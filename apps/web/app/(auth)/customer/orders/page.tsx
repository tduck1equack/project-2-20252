'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Package, CheckCircle, Truck, XCircle, Loader2, Clock } from 'lucide-react';
import Link from 'next/link';

interface Order {
    id: string;
    code: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    items: { productVariant: { name: string }; quantity: number; unitPrice: number; totalPrice: number }[];
}

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    PENDING: { icon: <Clock className="w-4 h-4" />, color: 'text-yellow-500', label: 'Pending' },
    CONFIRMED: { icon: <CheckCircle className="w-4 h-4" />, color: 'text-blue-500', label: 'Confirmed' },
    SHIPPED: { icon: <Truck className="w-4 h-4" />, color: 'text-green-500', label: 'Shipped' },
    CANCELLED: { icon: <XCircle className="w-4 h-4" />, color: 'text-red-500', label: 'Cancelled' },
};

export default function CustomerOrdersPage() {
    const { data: orders, isLoading } = useQuery<Order[]>({
        queryKey: ['customer-orders'],
        queryFn: async () => {
            const res = await api.get('/sales/orders');
            return res.data || res;
        }
    });

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-[rgb(var(--foreground))]">My Orders</h1>
                    <p className="text-[rgb(var(--muted))] mt-1">Track your order history</p>
                </div>
                <Link href="/customer/products" className="btn-primary">
                    Continue Shopping
                </Link>
            </div>

            {isLoading && (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[rgb(var(--muted))]" />
                </div>
            )}

            {!isLoading && orders?.length === 0 && (
                <div className="glass-card p-12 text-center">
                    <Package className="w-16 h-16 mx-auto text-[rgb(var(--muted))] mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                    <p className="text-[rgb(var(--muted))] mb-6">Start shopping to see your orders here</p>
                    <Link href="/customer/products" className="btn-primary inline-block">
                        Browse Products
                    </Link>
                </div>
            )}

            {!isLoading && orders && orders.length > 0 && (
                <div className="space-y-4">
                    {orders.map(order => {
                        const status = statusConfig[order.status] || statusConfig.PENDING;
                        return (
                            <div key={order.id} className="glass-card p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono font-semibold">{order.code}</span>
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${status?.color || 'text-gray-500'} bg-current/10`}>
                                                {status?.icon}
                                                {status?.label || order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[rgb(var(--muted))] mt-1">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold">${Number(order.totalAmount).toFixed(2)}</p>
                                        <p className="text-sm text-[rgb(var(--muted))]">{order.items.length} item(s)</p>
                                    </div>
                                </div>

                                <div className="border-t border-[rgb(var(--border))] pt-4 space-y-2">
                                    {order.items.slice(0, 3).map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-[rgb(var(--muted))]">
                                                {item.quantity}x {item.productVariant.name}
                                            </span>
                                            <span>${Number(item.totalPrice).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    {order.items.length > 3 && (
                                        <p className="text-xs text-[rgb(var(--muted))]">
                                            +{order.items.length - 3} more items
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
