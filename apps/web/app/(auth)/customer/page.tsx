'use client';

import { useAuthStore } from '@/stores/auth-store';
import { Package, ShoppingBag, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CustomerDashboard() {
    const { user } = useAuthStore();

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Header */}
            <div>
                <h1 className="text-3xl font-bold text-[rgb(var(--foreground))]">
                    Welcome back, {user?.name || 'Customer'}
                </h1>
                <p className="text-[rgb(var(--muted))] mt-1">
                    Browse products and manage your orders
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 stat-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[rgb(var(--muted))]">Active Orders</p>
                            <p className="text-2xl font-bold mt-1">3</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-[rgb(var(--primary))]/10 flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-[rgb(var(--primary))]" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 stat-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[rgb(var(--muted))]">Products Viewed</p>
                            <p className="text-2xl font-bold mt-1">24</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-[rgb(var(--accent))]/10 flex items-center justify-center">
                            <Package className="w-6 h-6 text-[rgb(var(--accent))]" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 stat-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[rgb(var(--muted))]">Last Order</p>
                            <p className="text-2xl font-bold mt-1">2 days ago</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-[rgb(var(--success))]/10 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-[rgb(var(--success))]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/customer/products" className="glass-card p-6 stat-card group cursor-pointer">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Browse Products</h3>
                            <p className="text-sm text-[rgb(var(--muted))] mt-1">
                                Explore our catalog of products
                            </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-[rgb(var(--muted))] group-hover:text-[rgb(var(--primary))] transition-colors" />
                    </div>
                </Link>

                <Link href="/customer/orders" className="glass-card p-6 stat-card group cursor-pointer">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">View Orders</h3>
                            <p className="text-sm text-[rgb(var(--muted))] mt-1">
                                Track your order status
                            </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-[rgb(var(--muted))] group-hover:text-[rgb(var(--primary))] transition-colors" />
                    </div>
                </Link>
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {[
                        { action: 'Order #1234 shipped', time: '2 hours ago' },
                        { action: 'Viewed Product: Industrial Gears', time: '5 hours ago' },
                        { action: 'Order #1233 delivered', time: '2 days ago' },
                    ].map((activity, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-[rgb(var(--border))] last:border-0">
                            <span className="text-sm">{activity.action}</span>
                            <span className="text-xs text-[rgb(var(--muted))]">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
