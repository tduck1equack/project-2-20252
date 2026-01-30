'use client';

import { useState } from 'react';
import { Truck, Search, TrendingUp, TrendingDown, ArrowRight, Plus, Eye, Calendar } from 'lucide-react';

// Mock movements data
const movements = [
    { id: 'MOV-2024-001', type: 'INBOUND', product: 'Industrial Gears Set', quantity: 100, from: 'Supplier A', to: 'Main Warehouse', date: '2024-01-31', status: 'COMPLETED' },
    { id: 'MOV-2024-002', type: 'OUTBOUND', product: 'Steel Ball Bearings', quantity: 50, from: 'Main Warehouse', to: 'Customer Order #1234', date: '2024-01-31', status: 'COMPLETED' },
    { id: 'MOV-2024-003', type: 'TRANSFER', product: 'Hydraulic Pump Unit', quantity: 10, from: 'Storage B', to: 'Main Warehouse', date: '2024-01-30', status: 'PENDING' },
    { id: 'MOV-2024-004', type: 'INBOUND', product: 'Electric Motor 3HP', quantity: 25, from: 'Supplier B', to: 'Storage B', date: '2024-01-30', status: 'DRAFT' },
    { id: 'MOV-2024-005', type: 'OUTBOUND', product: 'Conveyor Belt 10m', quantity: 2, from: 'Main Warehouse', to: 'Customer Order #1235', date: '2024-01-29', status: 'COMPLETED' },
];

const typeConfig = {
    INBOUND: { icon: TrendingUp, color: 'success', label: 'Inbound' },
    OUTBOUND: { icon: TrendingDown, color: 'error', label: 'Outbound' },
    TRANSFER: { icon: ArrowRight, color: 'accent', label: 'Transfer' },
};

const statusColors: Record<string, string> = {
    DRAFT: 'warning',
    PENDING: 'accent',
    COMPLETED: 'success',
};

export default function MovementsPage() {
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');

    const filtered = movements.filter((m) => {
        const matchSearch = m.id.toLowerCase().includes(search.toLowerCase()) || m.product.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === 'All' || m.type === typeFilter;
        return matchSearch && matchType;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[rgb(var(--foreground))]">Stock Movements</h1>
                    <p className="text-[rgb(var(--muted))]">Track inbound, outbound, and transfers</p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgb(var(--primary))] text-white font-medium hover:opacity-90 transition-opacity cursor-pointer">
                    <Plus className="w-4 h-4" />
                    New Movement
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted))]" />
                    <input
                        type="text"
                        placeholder="Search movements..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-[rgb(var(--surface-elevated))] border border-[rgb(var(--border))] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                    />
                </div>
                <div className="flex gap-2">
                    {['All', 'INBOUND', 'OUTBOUND', 'TRANSFER'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setTypeFilter(type)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${typeFilter === type
                                ? 'bg-[rgb(var(--primary))] text-white'
                                : 'bg-[rgb(var(--surface-elevated))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]'
                                }`}
                        >
                            {type === 'All' ? 'All' : typeConfig[type as keyof typeof typeConfig]?.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Movements List */}
            <div className="space-y-4">
                {filtered.map((mov) => {
                    const config = typeConfig[mov.type as keyof typeof typeConfig];
                    if (!config) return null;
                    const TypeIcon = config.icon;

                    return (
                        <div key={mov.id} className="glass-card p-4 stat-card">
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                {/* Type Icon */}
                                <div className={`w-10 h-10 rounded-lg bg-[rgb(var(--${config.color}))]/10 flex items-center justify-center shrink-0`}>
                                    <TypeIcon className={`w-5 h-5 text-[rgb(var(--${config.color}))]`} />
                                </div>

                                {/* Movement Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono text-sm">{mov.id}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs bg-[rgb(var(--${config.color}))]/10 text-[rgb(var(--${config.color}))]`}>
                                            {config.label}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs bg-[rgb(var(--${statusColors[mov.status]}))]/10 text-[rgb(var(--${statusColors[mov.status]}))]`}>
                                            {mov.status}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium truncate">{mov.product}</p>
                                    <p className="text-xs text-[rgb(var(--muted))] flex items-center gap-1">
                                        {mov.from} → {mov.to}
                                    </p>
                                </div>

                                {/* Quantity & Date */}
                                <div className="flex items-center gap-6 text-sm">
                                    <div className="text-right">
                                        <span className={`font-bold ${mov.type === 'INBOUND' ? 'text-[rgb(var(--success))]' : mov.type === 'OUTBOUND' ? 'text-[rgb(var(--error))]' : ''}`}>
                                            {mov.type === 'INBOUND' ? '+' : mov.type === 'OUTBOUND' ? '-' : ''}{mov.quantity}
                                        </span>
                                        <span className="text-[rgb(var(--muted))] ml-1">units</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[rgb(var(--muted))]">
                                        <Calendar className="w-3 h-3" />
                                        {mov.date}
                                    </div>
                                    <button className="p-2 rounded-lg hover:bg-[rgb(var(--surface-elevated))] transition-colors cursor-pointer" title="View details">
                                        <Eye className="w-4 h-4 text-[rgb(var(--muted))]" />
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
                    <Truck className="w-12 h-12 mx-auto text-[rgb(var(--muted))] mb-4" />
                    <p className="text-[rgb(var(--muted))]">No movements found</p>
                </div>
            )}
        </div>
    );
}
