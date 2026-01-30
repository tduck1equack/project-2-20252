"use client";

import { cn } from "@/lib/utils";
import { GlassCard } from "./glass-card";
import {
    TrendingUp,
    TrendingDown,
    Minus,
    Package,
    FileText,
    BarChart3,
    Warehouse,
    DollarSign,
    Users,
    type LucideIcon,
} from "lucide-react";

export type StatIconType =
    | "package"
    | "file"
    | "chart"
    | "warehouse"
    | "dollar"
    | "users";

const iconMap: Record<StatIconType, LucideIcon> = {
    package: Package,
    file: FileText,
    chart: BarChart3,
    warehouse: Warehouse,
    dollar: DollarSign,
    users: Users,
};

interface StatCardProps {
    title: string;
    value: string | number;
    change?: number;
    changeLabel?: string;
    icon?: StatIconType;
    className?: string;
    delay?: number;
}

export function StatCard({
    title,
    value,
    change,
    changeLabel,
    icon = "chart",
    className,
    delay = 0,
}: StatCardProps) {
    const Icon = iconMap[icon];
    const isPositive = change && change > 0;
    const isNegative = change && change < 0;

    return (
        <GlassCard
            className={cn("relative overflow-hidden group", className)}
            hover
        >
            <div
                className="animate-slide-up"
                style={{ animationDelay: `${delay}ms` }}
            >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon */}
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-[rgb(var(--muted))]">
                        {title}
                    </span>
                    <div className="p-2 rounded-lg bg-primary-500/10 text-primary-500">
                        <Icon className="h-5 w-5" />
                    </div>
                </div>

                {/* Value */}
                <div className="text-3xl font-bold font-mono tracking-tight mb-2">
                    {value}
                </div>

                {/* Change indicator */}
                {change !== undefined && (
                    <div className="flex items-center gap-2">
                        {isPositive && (
                            <span className="flex items-center text-green-500 text-sm font-medium">
                                <TrendingUp className="h-4 w-4 mr-1" />
                                +{change}%
                            </span>
                        )}
                        {isNegative && (
                            <span className="flex items-center text-red-500 text-sm font-medium">
                                <TrendingDown className="h-4 w-4 mr-1" />
                                {change}%
                            </span>
                        )}
                        {!isPositive && !isNegative && (
                            <span className="flex items-center text-[rgb(var(--muted))] text-sm font-medium">
                                <Minus className="h-4 w-4 mr-1" />
                                0%
                            </span>
                        )}
                        {changeLabel && (
                            <span className="text-xs text-[rgb(var(--muted))]">
                                {changeLabel}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </GlassCard>
    );
}
