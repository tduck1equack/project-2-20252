'use client';

import { useState } from 'react';
import { Package, Search, AlertTriangle, TrendingUp, TrendingDown, Eye, Edit2 } from 'lucide-react';

// Mock stock data
const stockItems = [
    { id: '1', sku: 'GEAR-001', name: 'Industrial Gears Set', warehouse: 'Main Warehouse', quantity: 156, minStock: 50, maxStock: 500, lastUpdated: '2024-01-31' },
    { id: '2', sku: 'BEAR-002', name: 'Steel Ball Bearings', warehouse: 'Main Warehouse', quantity: 320, minStock: 100, maxStock: 800, lastUpdated: '2024-01-30' },
    { id: '3', sku: 'PUMP-003', name: 'Hydraulic Pump Unit', warehouse: 'Storage B', quantity: 28, minStock: 20, maxStock: 100, lastUpdated: '2024-01-29' },
    { id: '4', sku: 'BOLT-004', name: 'Stainless Steel Bolts', warehouse: 'Main Warehouse', quantity: 1200, minStock: 500, maxStock: 2000, lastUpdated: '2024-01-31' },
    { id: '5', sku: 'MOTR-005', name: 'Electric Motor 3HP', warehouse: 'Storage B', quantity: 12, minStock: 15, maxStock: 60, lastUpdated: '2024-01-28' },
    { id: '6', sku: 'CONV-006', name: 'Conveyor Belt 10m', warehouse: 'Main Warehouse', quantity: 8, minStock: 10, maxStock: 30, lastUpdated: '2024-01-27' },
];

function getStockStatus(qty: number, min: number, max: number) {
    if (qty <= min) return { label: 'Low Stock', color: 'error', icon: TrendingDown };
    if (qty >= max * 0.9) return { label: 'High Stock', color: 'warning', icon: TrendingUp };
    return { label: 'Normal', color: 'success', icon: Package };
}

export default function StockPage() {
    const [search, setSearch] = useState('');
    const [warehouse, setWarehouse] = useState('All');

    const warehouses = ['All', ...new Set(stockItems.map((s) => s.warehouse))];

    const filtered = stockItems.filter((s) => {
        const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.sku.toLowerCase().includes(search.toLowerCase());
        const matchWarehouse = warehouse === 'All' || s.warehouse === warehouse;
        return matchSearch && matchWarehouse;
    });

    const lowStock = stockItems.filter((s) => s.quantity <= s.minStock).length;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[rgb(var(--foreground))]">Stock Levels</h1>
                    <p className="text-[rgb(var(--muted))]">Monitor inventory across warehouses</p>
                </div>
                {lowStock > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgb(var(--error))]/10 text-[rgb(var(--error))]">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">{lowStock} items low on stock</span>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted))]" />
                    <input
                        type="text"
                        placeholder="Search by SKU or name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-[rgb(var(--surface-elevated))] border border-[rgb(var(--border))] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                    />
                </div>
                <select
                    value={warehouse}
                    onChange={(e) => setWarehouse(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-[rgb(var(--surface-elevated))] border border-[rgb(var(--border))] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] cursor-pointer"
                >
                    {warehouses.map((w) => (
                        <option key={w} value={w}>{w === 'All' ? 'All Warehouses' : w}</option>
                    ))}
                </select>
            </div>

            {/* Stock Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[rgb(var(--border))] bg-[rgb(var(--surface-elevated))]">
                                <th className="text-left py-3 px-4 text-sm font-medium text-[rgb(var(--muted))]">SKU</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-[rgb(var(--muted))]">Product</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-[rgb(var(--muted))]">Warehouse</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-[rgb(var(--muted))]">Quantity</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-[rgb(var(--muted))]">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-[rgb(var(--muted))]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((item) => {
                                const status = getStockStatus(item.quantity, item.minStock, item.maxStock);
                                const StatusIcon = status.icon;

                                return (
                                    <tr key={item.id} className="border-b border-[rgb(var(--border))] last:border-0 hover:bg-[rgb(var(--surface-elevated))]/50">
                                        <td className="py-3 px-4 text-sm font-mono">{item.sku}</td>
                                        <td className="py-3 px-4 text-sm">{item.name}</td>
                                        <td className="py-3 px-4 text-sm text-[rgb(var(--muted))]">{item.warehouse}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">{item.quantity}</span>
                                                <span className="text-xs text-[rgb(var(--muted))]">/ {item.maxStock}</span>
                                            </div>
                                            {/* Progress bar */}
                                            <div className="w-24 h-1 bg-[rgb(var(--border))] rounded-full mt-1">
                                                <div
                                                    className={`h-full rounded-full bg-[rgb(var(--${status.color}))]`}
                                                    style={{ width: `${Math.min((item.quantity / item.maxStock) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[rgb(var(--${status.color}))]/10 text-[rgb(var(--${status.color}))]`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex gap-2">
                                                <button className="p-1.5 rounded-lg hover:bg-[rgb(var(--surface-elevated))] transition-colors cursor-pointer" title="View">
                                                    <Eye className="w-4 h-4 text-[rgb(var(--muted))]" />
                                                </button>
                                                <button className="p-1.5 rounded-lg hover:bg-[rgb(var(--surface-elevated))] transition-colors cursor-pointer" title="Edit">
                                                    <Edit2 className="w-4 h-4 text-[rgb(var(--muted))]" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty State */}
            {filtered.length === 0 && (
                <div className="text-center py-12">
                    <Package className="w-12 h-12 mx-auto text-[rgb(var(--muted))] mb-4" />
                    <p className="text-[rgb(var(--muted))]">No stock items found</p>
                </div>
            )}
        </div>
    );
}
