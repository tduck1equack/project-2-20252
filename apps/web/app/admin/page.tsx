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

const recentActivity = [
    {
        id: 1,
        type: "movement",
        title: "Stock Receipt",
        description: "50 units added to Warehouse A",
        time: "2 min ago",
        icon: Package,
        color: "text-green-500",
    },
    {
        id: 2,
        type: "alert",
        title: "Low Stock Alert",
        description: "Product SKU-001 below threshold",
        time: "15 min ago",
        icon: AlertTriangle,
        color: "text-amber-500",
    },
    {
        id: 3,
        type: "invoice",
        title: "Invoice Published",
        description: "E-Invoice #INV-2024-001 sent",
        time: "1 hour ago",
        icon: TrendingUp,
        color: "text-primary-500",
    },
    {
        id: 4,
        type: "movement",
        title: "Stock Transfer",
        description: "20 units moved to Warehouse B",
        time: "3 hours ago",
        icon: Package,
        color: "text-blue-500",
    },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-[rgb(var(--muted))]">
                    Welcome back! Here&apos;s your inventory overview.
                </p>
            </div>

            {/* 3D Hero + Quick Stats Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* 3D Visualization */}
                <div className="lg:col-span-2">
                    <GlassCard className="h-[300px] lg:h-[350px] p-0 overflow-hidden relative">
                        <Hero3D className="w-full h-full" />
                        <div className="absolute bottom-6 left-6 right-6 z-20">
                            <h3 className="text-xl font-bold mb-2">
                                Warehouse Overview
                            </h3>
                            <p className="text-[rgb(var(--muted))] text-sm mb-4">
                                Real-time 3D visualization of your inventory
                            </p>
                            <Link
                                href="/admin/inventory"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
                            >
                                View Details
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </GlassCard>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                    <StatCard
                        title="Total Inventory"
                        value="12,847"
                        change={12.5}
                        changeLabel="vs last month"
                        icon="package"
                        delay={0}
                    />
                    <StatCard
                        title="Active Batches"
                        value="156"
                        change={-2.3}
                        changeLabel="3 expiring soon"
                        icon="warehouse"
                        delay={100}
                    />
                    <StatCard
                        title="Pending Invoices"
                        value="24"
                        change={8}
                        changeLabel="this week"
                        icon="file"
                        delay={200}
                    />
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Products"
                    value="347"
                    change={5.2}
                    icon="package"
                    delay={0}
                />
                <StatCard
                    title="Stock Movements"
                    value="1,247"
                    change={18.7}
                    changeLabel="this month"
                    icon="chart"
                    delay={100}
                />
                <StatCard
                    title="Revenue (VND)"
                    value="2.4B"
                    change={22.1}
                    icon="dollar"
                    delay={200}
                />
                <StatCard
                    title="Active Users"
                    value="12"
                    change={0}
                    icon="users"
                    delay={300}
                />
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
                        {recentActivity.map((activity, index) => (
                            <div
                                key={activity.id}
                                className="flex items-start gap-4 p-3 rounded-xl hover:bg-[rgb(var(--surface-elevated))] transition-colors cursor-pointer animate-slide-in-right"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div
                                    className={`p-2 rounded-lg bg-[rgb(var(--surface-elevated))] ${activity.color}`}
                                >
                                    <activity.icon className="h-4 w-4" />
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
                                    {activity.time}
                                </div>
                            </div>
                        ))}
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
