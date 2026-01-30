'use client';

import { useAuthStore } from '@/stores/auth-store';
import { Package, Truck, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

export default function EmployeeDashboard() {
    const { user } = useAuthStore();

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[rgb(var(--foreground))]">
                    Employee Dashboard
                </h1>
                <p className="text-[rgb(var(--muted))] mt-1">
                    Welcome, {user?.name || 'Employee'}. Manage stock levels and movements.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-card p-6 stat-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[rgb(var(--muted))]">Total SKUs</p>
                            <p className="text-2xl font-bold mt-1">1,234</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-[rgb(var(--primary))]/10 flex items-center justify-center">
                            <Package className="w-6 h-6 text-[rgb(var(--primary))]" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 stat-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[rgb(var(--muted))]">Pending Movements</p>
                            <p className="text-2xl font-bold mt-1">12</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-[rgb(var(--accent))]/10 flex items-center justify-center">
                            <Truck className="w-6 h-6 text-[rgb(var(--accent))]" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 stat-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[rgb(var(--muted))]">Low Stock Alerts</p>
                            <p className="text-2xl font-bold mt-1 text-[rgb(var(--warning))]">5</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-[rgb(var(--warning))]/10 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-[rgb(var(--warning))]" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 stat-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[rgb(var(--muted))]">Today's Inbound</p>
                            <p className="text-2xl font-bold mt-1">+156</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-[rgb(var(--success))]/10 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-[rgb(var(--success))]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Movements */}
            <div className="glass-card p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Stock Movements</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[rgb(var(--border))]">
                                <th className="text-left py-3 px-4 text-sm font-medium text-[rgb(var(--muted))]">Code</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-[rgb(var(--muted))]">Type</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-[rgb(var(--muted))]">Product</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-[rgb(var(--muted))]">Qty</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-[rgb(var(--muted))]">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { code: 'MOV-2024-001', type: 'INBOUND', product: 'Industrial Gears', qty: 100, status: 'COMPLETED' },
                                { code: 'MOV-2024-002', type: 'OUTBOUND', product: 'Ball Bearings', qty: -50, status: 'COMPLETED' },
                                { code: 'MOV-2024-003', type: 'TRANSFER', product: 'Steel Bolts', qty: 200, status: 'DRAFT' },
                            ].map((mov) => (
                                <tr key={mov.code} className="border-b border-[rgb(var(--border))] last:border-0">
                                    <td className="py-3 px-4 text-sm font-mono">{mov.code}</td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${mov.type === 'INBOUND' ? 'bg-[rgb(var(--success))]/10 text-[rgb(var(--success))]' :
                                                mov.type === 'OUTBOUND' ? 'bg-[rgb(var(--error))]/10 text-[rgb(var(--error))]' :
                                                    'bg-[rgb(var(--accent))]/10 text-[rgb(var(--accent))]'
                                            }`}>
                                            {mov.type === 'INBOUND' ? <TrendingUp className="w-3 h-3" /> : mov.type === 'OUTBOUND' ? <TrendingDown className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
                                            {mov.type}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm">{mov.product}</td>
                                    <td className="py-3 px-4 text-sm font-mono">{mov.qty > 0 ? `+${mov.qty}` : mov.qty}</td>
                                    <td className="py-3 px-4">
                                        <span className={`text-xs px-2 py-1 rounded-full ${mov.status === 'COMPLETED' ? 'bg-[rgb(var(--success))]/10 text-[rgb(var(--success))]' :
                                                'bg-[rgb(var(--warning))]/10 text-[rgb(var(--warning))]'
                                            }`}>
                                            {mov.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
