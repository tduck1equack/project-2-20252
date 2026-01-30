'use client';

import { useState } from 'react';
import { Boxes, Search, Calendar, AlertTriangle, Eye, Package } from 'lucide-react';

// Mock batch data
const batches = [
    { id: 'BATCH-001', product: 'Industrial Gears Set', lotNumber: 'LOT-2024-A01', quantity: 100, manufacturedDate: '2024-01-15', expiryDate: null, warehouse: 'Main Warehouse', status: 'ACTIVE' },
    { id: 'BATCH-002', product: 'Steel Ball Bearings', lotNumber: 'LOT-2024-B02', quantity: 200, manufacturedDate: '2024-01-10', expiryDate: null, warehouse: 'Main Warehouse', status: 'ACTIVE' },
    { id: 'BATCH-003', product: 'Lubricant Oil 5L', lotNumber: 'LOT-2024-C03', quantity: 50, manufacturedDate: '2023-06-01', expiryDate: '2025-06-01', warehouse: 'Storage B', status: 'ACTIVE' },
    { id: 'BATCH-004', product: 'Paint Thinner 1L', lotNumber: 'LOT-2024-D04', quantity: 30, manufacturedDate: '2023-12-15', expiryDate: '2024-06-15', warehouse: 'Storage B', status: 'EXPIRING_SOON' },
    { id: 'BATCH-005', product: 'Cleaning Solvent', lotNumber: 'LOT-2024-E05', quantity: 10, manufacturedDate: '2023-01-01', expiryDate: '2024-01-01', warehouse: 'Main Warehouse', status: 'EXPIRED' },
];

const statusConfig: Record<string, { color: string; label: string }> = {
    ACTIVE: { color: 'success', label: 'Active' },
    EXPIRING_SOON: { color: 'warning', label: 'Expiring Soon' },
    EXPIRED: { color: 'error', label: 'Expired' },
};

export default function BatchesPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filtered = batches.filter((b) => {
        const matchSearch = b.product.toLowerCase().includes(search.toLowerCase()) || b.lotNumber.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'All' || b.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const expiringCount = batches.filter((b) => b.status === 'EXPIRING_SOON' || b.status === 'EXPIRED').length;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[rgb(var(--foreground))]">Batch Tracking</h1>
                    <p className="text-[rgb(var(--muted))]">Manage lot numbers and expiry dates</p>
                </div>
                {expiringCount > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgb(var(--warning))]/10 text-[rgb(var(--warning))]">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">{expiringCount} batches need attention</span>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted))]" />
                    <input
                        type="text"
                        placeholder="Search by product or lot number..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-[rgb(var(--surface-elevated))] border border-[rgb(var(--border))] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                    />
                </div>
                <div className="flex gap-2">
                    {['All', 'ACTIVE', 'EXPIRING_SOON', 'EXPIRED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${statusFilter === status
                                ? 'bg-[rgb(var(--primary))] text-white'
                                : 'bg-[rgb(var(--surface-elevated))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]'
                                }`}
                        >
                            {status === 'All' ? 'All' : statusConfig[status]?.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Batches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((batch) => {
                    const config = statusConfig[batch.status];
                    if (!config) return null;

                    return (
                        <div key={batch.id} className="glass-card p-5 stat-card">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <span className="text-xs font-mono text-[rgb(var(--muted))]">{batch.id}</span>
                                    <h3 className="font-semibold text-[rgb(var(--foreground))]">{batch.product}</h3>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs bg-[rgb(var(--${config.color}))]/10 text-[rgb(var(--${config.color}))]`}>
                                    {config.label}
                                </span>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-[rgb(var(--muted))]">Lot Number</span>
                                    <span className="font-mono">{batch.lotNumber}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[rgb(var(--muted))]">Quantity</span>
                                    <span>{batch.quantity} units</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[rgb(var(--muted))]">Manufactured</span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {batch.manufacturedDate}
                                    </span>
                                </div>
                                {batch.expiryDate && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-[rgb(var(--muted))]">Expires</span>
                                        <span className={`flex items-center gap-1 ${batch.status !== 'ACTIVE' ? `text-[rgb(var(--${config.color}))]` : ''}`}>
                                            <Calendar className="w-3 h-3" />
                                            {batch.expiryDate}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <span className="text-[rgb(var(--muted))]">Warehouse</span>
                                    <span>{batch.warehouse}</span>
                                </div>
                            </div>

                            <div className="flex justify-end mt-4">
                                <button className="p-2 rounded-lg hover:bg-[rgb(var(--surface-elevated))] transition-colors cursor-pointer" title="View details">
                                    <Eye className="w-4 h-4 text-[rgb(var(--muted))]" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filtered.length === 0 && (
                <div className="text-center py-12">
                    <Boxes className="w-12 h-12 mx-auto text-[rgb(var(--muted))] mb-4" />
                    <p className="text-[rgb(var(--muted))]">No batches found</p>
                </div>
            )}
        </div>
    );
}
