'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Package, DollarSign, AlertTriangle, Loader2 } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export default function ReportsPage() {
    const { data: velocity, isLoading: loadingVelocity } = useQuery({
        queryKey: ['reports', 'stock-velocity'],
        queryFn: async () => {
            const res = await api.get('/reports/stock-velocity?limit=10');
            return res.data || res;
        }
    });

    const { data: sales, isLoading: loadingSales } = useQuery({
        queryKey: ['reports', 'sales-summary'],
        queryFn: async () => {
            const res = await api.get('/reports/sales-summary?days=30');
            return res.data || res;
        }
    });

    const { data: stockSummary, isLoading: loadingStock } = useQuery({
        queryKey: ['reports', 'stock-summary'],
        queryFn: async () => {
            const res = await api.get('/reports/stock-summary');
            return res.data || res;
        }
    });

    const isLoading = loadingVelocity || loadingSales || loadingStock;

    const orderStatusData = sales?.ordersByStatus
        ? Object.entries(sales.ordersByStatus).map(([name, value]) => ({ name, value }))
        : [];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[rgb(var(--foreground))]">Reports & Analytics</h1>
                <p className="text-[rgb(var(--muted))] mt-1">Business insights at a glance</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[rgb(var(--success))]/10 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-[rgb(var(--success))]" />
                        </div>
                        <div>
                            <p className="text-sm text-[rgb(var(--muted))]">Total Revenue</p>
                            <p className="text-2xl font-bold">${sales?.totalRevenue?.toFixed(2) || '0.00'}</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[rgb(var(--primary))]/10 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-[rgb(var(--primary))]" />
                        </div>
                        <div>
                            <p className="text-sm text-[rgb(var(--muted))]">Total Orders</p>
                            <p className="text-2xl font-bold">{sales?.totalOrders || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                            <Package className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-[rgb(var(--muted))]">Stock Value</p>
                            <p className="text-2xl font-bold">${stockSummary?.totalValue?.toFixed(2) || '0.00'}</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div>
                            <p className="text-sm text-[rgb(var(--muted))]">Low Stock Items</p>
                            <p className="text-2xl font-bold">{stockSummary?.lowStockCount || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {isLoading && (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[rgb(var(--muted))]" />
                </div>
            )}

            {!isLoading && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Revenue Trend */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-semibold mb-4">Revenue Trend (30 Days)</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={sales?.revenueByDay || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="date" tick={{ fill: 'rgb(var(--muted))' }} fontSize={12} />
                                    <YAxis tick={{ fill: 'rgb(var(--muted))' }} fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgb(var(--background))',
                                            border: '1px solid rgb(var(--border))',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Order Status Distribution */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-semibold mb-4">Order Status Distribution</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={orderStatusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        {orderStatusData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Stock Velocity */}
                    <div className="glass-card p-6 lg:col-span-2">
                        <h3 className="text-lg font-semibold mb-4">Top Moved Products</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={velocity || []} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis type="number" tick={{ fill: 'rgb(var(--muted))' }} fontSize={12} />
                                    <YAxis type="category" dataKey="name" width={150} tick={{ fill: 'rgb(var(--muted))' }} fontSize={11} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgb(var(--background))',
                                            border: '1px solid rgb(var(--border))',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Bar dataKey="totalQuantity" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
