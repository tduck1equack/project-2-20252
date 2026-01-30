'use client';

import { useState } from 'react';
import { ShoppingBag, Package, Truck, CheckCircle, Clock, Eye, Search } from 'lucide-react';

// Mock orders data
const orders = [
    {
        id: 'ORD-2024-001',
        date: '2024-01-28',
        items: 3,
        total: 5650000,
        status: 'DELIVERED',
        products: ['Industrial Gears Set', 'Steel Ball Bearings', 'Stainless Steel Bolts'],
    },
    {
        id: 'ORD-2024-002',
        date: '2024-01-30',
        items: 1,
        total: 8500000,
        status: 'SHIPPED',
        products: ['Hydraulic Pump Unit'],
    },
    {
        id: 'ORD-2024-003',
        date: '2024-01-31',
        items: 2,
        total: 3380000,
        status: 'PROCESSING',
        products: ['Electric Motor 3HP', 'Stainless Steel Bolts'],
    },
    {
        id: 'ORD-2024-004',
        date: '2024-01-31',
        items: 1,
        total: 5600000,
        status: 'PENDING',
        products: ['Conveyor Belt 10m'],
    },
];

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; label: string }> = {
    PENDING: { icon: Clock, color: 'warning', label: 'Pending' },
    PROCESSING: { icon: Package, color: 'accent', label: 'Processing' },
    SHIPPED: { icon: Truck, color: 'primary', label: 'Shipped' },
    DELIVERED: { icon: CheckCircle, color: 'success', label: 'Delivered' },
};

function formatPrice(price: number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

export default function OrdersPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filtered = orders.filter((o) => {
        const matchSearch = o.id.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'All' || o.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[rgb(var(--foreground))]">My Orders</h1>
                    <p className="text-[rgb(var(--muted))]">Track your order history</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted))]" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-lg bg-[rgb(var(--surface-elevated))] border border-[rgb(var(--border))] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] w-64"
                    />
                </div>
            </div>

            {/* Status Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['All', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${statusFilter === status
                            ? 'bg-[rgb(var(--primary))] text-white'
                            : 'bg-[rgb(var(--surface-elevated))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]'
                            }`}
                    >
                        {status === 'All' ? 'All Orders' : statusConfig[status]?.label || status}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {filtered.map((order) => {
                    const config = statusConfig[order.status];
                    if (!config) return null;
                    const StatusIcon = config.icon;

                    return (
                        <div key={order.id} className="glass-card p-6 stat-card">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                {/* Order Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-[rgb(var(--foreground))]">{order.id}</h3>
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[rgb(var(--${config.color}))]/10 text-[rgb(var(--${config.color}))]`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {config.label}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[rgb(var(--muted))]">
                                        {order.date} • {order.items} item{order.items > 1 ? 's' : ''}
                                    </p>
                                    <p className="text-xs text-[rgb(var(--muted))] mt-1 truncate max-w-md">
                                        {order.products.join(', ')}
                                    </p>
                                </div>

                                {/* Total & Actions */}
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-sm text-[rgb(var(--muted))]">Total</p>
                                        <p className="text-lg font-bold text-[rgb(var(--foreground))]">{formatPrice(order.total)}</p>
                                    </div>
                                    <button className="p-2 rounded-lg bg-[rgb(var(--surface-elevated))] hover:bg-[rgb(var(--border))] transition-colors cursor-pointer" title="View details">
                                        <Eye className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filtered.length === 0 && (
                <div className="text-center py-12">
                    <ShoppingBag className="w-12 h-12 mx-auto text-[rgb(var(--muted))] mb-4" />
                    <p className="text-[rgb(var(--muted))]">No orders found</p>
                </div>
            )}
        </div>
    );
}
