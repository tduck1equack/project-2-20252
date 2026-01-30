'use client';

import { useState } from 'react';
import { Building2, Search, MapPin, Plus, Edit2, Eye, Package, Users } from 'lucide-react';

// Mock warehouse data
const warehouses = [
    { id: '1', name: 'Main Warehouse', code: 'WH-001', address: '123 Industrial Zone, District 7, Ho Chi Minh City', manager: 'Nguyen Van A', products: 847, employees: 12, status: 'ACTIVE' },
    { id: '2', name: 'Storage B', code: 'WH-002', address: '456 Logistics Park, Thu Duc, Ho Chi Minh City', manager: 'Tran Thi B', products: 523, employees: 8, status: 'ACTIVE' },
    { id: '3', name: 'Cold Storage', code: 'WH-003', address: '789 Food District, Binh Tan, Ho Chi Minh City', manager: 'Le Van C', products: 156, employees: 5, status: 'ACTIVE' },
    { id: '4', name: 'Backup Facility', code: 'WH-004', address: '321 Reserve Zone, Long An Province', manager: 'Unassigned', products: 0, employees: 0, status: 'INACTIVE' },
];

export default function WarehousesPage() {
    const [search, setSearch] = useState('');

    const filtered = warehouses.filter((w) =>
        w.name.toLowerCase().includes(search.toLowerCase()) || w.code.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[rgb(var(--foreground))]">Warehouses</h1>
                    <p className="text-[rgb(var(--muted))]">Manage warehouse locations</p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgb(var(--primary))] text-white font-medium hover:opacity-90 transition-opacity cursor-pointer">
                    <Plus className="w-4 h-4" />
                    Add Warehouse
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted))]" />
                <input
                    type="text"
                    placeholder="Search warehouses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-[rgb(var(--surface-elevated))] border border-[rgb(var(--border))] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                />
            </div>

            {/* Warehouses Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filtered.map((warehouse) => (
                    <div key={warehouse.id} className="glass-card p-6 stat-card">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${warehouse.status === 'ACTIVE'
                                        ? 'bg-[rgb(var(--primary))]/10'
                                        : 'bg-[rgb(var(--muted))]/10'
                                    }`}>
                                    <Building2 className={`w-6 h-6 ${warehouse.status === 'ACTIVE'
                                            ? 'text-[rgb(var(--primary))]'
                                            : 'text-[rgb(var(--muted))]'
                                        }`} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[rgb(var(--foreground))]">{warehouse.name}</h3>
                                    <span className="text-xs font-mono text-[rgb(var(--muted))]">{warehouse.code}</span>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${warehouse.status === 'ACTIVE'
                                    ? 'bg-[rgb(var(--success))]/10 text-[rgb(var(--success))]'
                                    : 'bg-[rgb(var(--muted))]/10 text-[rgb(var(--muted))]'
                                }`}>
                                {warehouse.status}
                            </span>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-[rgb(var(--muted))] mt-0.5 shrink-0" />
                                <span className="text-[rgb(var(--muted))]">{warehouse.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-[rgb(var(--muted))]" />
                                <span className="text-[rgb(var(--muted))]">Manager: {warehouse.manager}</span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-4 mt-4 pt-4 border-t border-[rgb(var(--border))]">
                            <div className="flex-1 text-center">
                                <div className="flex items-center justify-center gap-1 text-[rgb(var(--muted))]">
                                    <Package className="w-4 h-4" />
                                </div>
                                <p className="text-lg font-bold">{warehouse.products}</p>
                                <p className="text-xs text-[rgb(var(--muted))]">Products</p>
                            </div>
                            <div className="flex-1 text-center">
                                <div className="flex items-center justify-center gap-1 text-[rgb(var(--muted))]">
                                    <Users className="w-4 h-4" />
                                </div>
                                <p className="text-lg font-bold">{warehouse.employees}</p>
                                <p className="text-xs text-[rgb(var(--muted))]">Staff</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 mt-4">
                            <button className="p-2 rounded-lg hover:bg-[rgb(var(--surface-elevated))] transition-colors cursor-pointer" title="View">
                                <Eye className="w-4 h-4 text-[rgb(var(--muted))]" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-[rgb(var(--surface-elevated))] transition-colors cursor-pointer" title="Edit">
                                <Edit2 className="w-4 h-4 text-[rgb(var(--muted))]" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filtered.length === 0 && (
                <div className="text-center py-12">
                    <Building2 className="w-12 h-12 mx-auto text-[rgb(var(--muted))] mb-4" />
                    <p className="text-[rgb(var(--muted))]">No warehouses found</p>
                </div>
            )}
        </div>
    );
}
