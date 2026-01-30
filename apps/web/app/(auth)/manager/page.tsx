'use client';

import { useAuthStore } from '@/stores/auth-store';
import { Building2, Users, TrendingUp, Package, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ManagerDashboard() {
    const { user } = useAuthStore();

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[rgb(var(--foreground))]">
                    Manager Dashboard
                </h1>
                <p className="text-[rgb(var(--muted))] mt-1">
                    Welcome, {user?.name || 'Manager'}. Oversee warehouses, accounts, and operations.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-card p-6 stat-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[rgb(var(--muted))]">Total Warehouses</p>
                            <p className="text-2xl font-bold mt-1">5</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-[rgb(var(--primary))]/10 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-[rgb(var(--primary))]" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 stat-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[rgb(var(--muted))]">Active Employees</p>
                            <p className="text-2xl font-bold mt-1">24</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-[rgb(var(--accent))]/10 flex items-center justify-center">
                            <Users className="w-6 h-6 text-[rgb(var(--accent))]" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 stat-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[rgb(var(--muted))]">Monthly Revenue</p>
                            <p className="text-2xl font-bold mt-1">₫1.2B</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-[rgb(var(--success))]/10 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-[rgb(var(--success))]" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 stat-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[rgb(var(--muted))]">Total Products</p>
                            <p className="text-2xl font-bold mt-1">1,847</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-[rgb(var(--warning))]/10 flex items-center justify-center">
                            <Package className="w-6 h-6 text-[rgb(var(--warning))]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/manager/warehouses" className="glass-card p-6 stat-card group cursor-pointer">
                    <Building2 className="w-8 h-8 text-[rgb(var(--primary))] mb-3" />
                    <h3 className="text-lg font-semibold">Manage Warehouses</h3>
                    <p className="text-sm text-[rgb(var(--muted))] mt-1">
                        Add, edit, or view warehouse details
                    </p>
                </Link>

                <Link href="/manager/accounts" className="glass-card p-6 stat-card group cursor-pointer">
                    <Users className="w-8 h-8 text-[rgb(var(--accent))] mb-3" />
                    <h3 className="text-lg font-semibold">User Accounts</h3>
                    <p className="text-sm text-[rgb(var(--muted))] mt-1">
                        Manage employee access and roles
                    </p>
                </Link>

                <Link href="/manager/reports" className="glass-card p-6 stat-card group cursor-pointer">
                    <TrendingUp className="w-8 h-8 text-[rgb(var(--success))] mb-3" />
                    <h3 className="text-lg font-semibold">View Reports</h3>
                    <p className="text-sm text-[rgb(var(--muted))] mt-1">
                        Stock reports and analytics
                    </p>
                </Link>
            </div>

            {/* Recent Activity & Pending Approvals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold mb-4">Pending Approvals</h2>
                    <div className="space-y-3">
                        {[
                            { type: 'User', name: 'New employee registration', status: 'pending' },
                            { type: 'Warehouse', name: 'Stock adjustment request', status: 'pending' },
                            { type: 'Transfer', name: 'Large batch transfer', status: 'pending' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[rgb(var(--surface-elevated))]">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-[rgb(var(--warning))]" />
                                    <div>
                                        <p className="text-sm font-medium">{item.name}</p>
                                        <p className="text-xs text-[rgb(var(--muted))]">{item.type}</p>
                                    </div>
                                </div>
                                <button className="text-xs px-3 py-1 rounded-full bg-[rgb(var(--primary))] text-white hover:opacity-90 transition-opacity cursor-pointer">
                                    Review
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Completions</h2>
                    <div className="space-y-3">
                        {[
                            { action: 'Warehouse "Main Storage" updated', time: '1 hour ago' },
                            { action: 'Employee role changed to Manager', time: '3 hours ago' },
                            { action: 'Monthly report generated', time: 'Yesterday' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[rgb(var(--surface-elevated))]">
                                <CheckCircle className="w-5 h-5 text-[rgb(var(--success))]" />
                                <div className="flex-1">
                                    <p className="text-sm">{item.action}</p>
                                    <p className="text-xs text-[rgb(var(--muted))]">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
