"use client";

import dynamic from "next/dynamic";
import { StatCard } from "@/components/ui/stat-card";
import { GlassCard } from "@/components/ui/glass-card";
import {
    ArrowRight,
    Package,
    TrendingUp,
    Clock,
    AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";
import { RevenueChart } from "@/components/analytics/revenue-chart";

// Dynamic import for 3D component (avoid SSR issues)
const Hero3D = dynamic(
    () => import("@/components/dashboard/hero-3d").then((mod) => mod.Hero3D),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-2xl animate-pulse" />
        ),
    }
);

// TODO: Fetch this from API instead of hardcoding
const recentActivity = [
    {
        id: 1,
        type: "movement",
        title: "Stock Receipt",
        description: "50 units added to Warehouse A",
        time: "2 min ago",
        icon: Package,
        color: "text-green-500",
    }
];

export default function AdminDashboard() {
    const { data: stats, isLoading } = useAdminAnalytics();

    if (isLoading) return <div>Loading Analytics...</div>;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard ({stats?.systemHealth?.uptime ? 'Online' : 'Loading'})</h1>
                <p className="text-[rgb(var(--muted))]">
                    Welcome back! Overview of {stats?.totalUsers || 0} users and {stats?.totalOrders || 0} orders.
                </p>
            </div>

            {/* 3D Hero + Quick Stats Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* 3D Visualization */}
                <div className="lg:col-span-2">
                    <RevenueChart />
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                    <StatCard
                        title="Total Orders"
                        value={stats?.totalOrders.toString() || "0"}
                        change={12.5}
                        changeLabel="vs last month"
                        icon="package"
                        delay={0}
                    />
                    <StatCard
                        title="Total Revenue"
                        value={`$${stats?.totalRevenue || 0}`}
                        change={22.1}
                        icon="dollar"
                        delay={200}
                    />
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
                <GlassCard>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">Recent Activity</h3>
                        <Link
                            href="/admin/activity"
                            className="text-sm text-primary-500 hover:text-primary-400 transition-colors cursor-pointer"
                        >
                            View all
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {stats?.recentActivity.map((activity, index) => (
                            <div
                                key={activity.id}
                                className="flex items-start gap-4 p-3 rounded-xl hover:bg-[rgb(var(--surface-elevated))] transition-colors cursor-pointer animate-slide-in-right"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div
                                    className={`p-2 rounded-lg bg-[rgb(var(--surface-elevated))] ${activity.color}`}
                                >
                                    <Package className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm">
                                        {activity.title}
                                    </p>
                                    <p className="text-[rgb(var(--muted))] text-xs truncate">
                                        {activity.description}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-[rgb(var(--muted))]">
                                    <Clock className="h-3 w-3" />
                                    {new Date(activity.time).toLocaleTimeString()}
                                </div>
                            </div>
                        ))}
                        {!stats?.recentActivity.length && <p className="text-sm text-muted">No recent activity.</p>}
                    </div>
                </GlassCard>

                {/* Quick Actions */}
                <GlassCard>
                    <h3 className="text-lg font-semibold mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            {
                                title: "New Stock Entry",
                                href: "/admin/inventory?action=new",
                                color: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
                            },
                            {
                                title: "Create Invoice",
                                href: "/admin/accounting?action=invoice",
                                color: "bg-primary-500/10 text-primary-500 hover:bg-primary-500/20",
                            },
                            {
                                title: "Add Product",
                                href: "/admin/inventory/products/new",
                                color: "bg-accent-500/10 text-accent-500 hover:bg-accent-500/20",
                            },
                            {
                                title: "View Reports",
                                href: "/admin/reports",
                                color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
                            },
                        ].map((action) => (
                            <Link
                                key={action.title}
                                href={action.href}
                                className={`p-4 rounded-xl text-center font-medium text-sm transition-all cursor-pointer ${action.color}`}
                            >
                                {action.title}
                            </Link>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
