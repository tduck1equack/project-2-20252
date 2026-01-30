"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    glow?: "primary" | "accent" | "none";
}

export function GlassCard({
    children,
    className,
    hover = true,
    glow = "none",
}: GlassCardProps) {
    return (
        <div
            className={cn(
                "glass-card p-6 animate-fade-in",
                hover && "stat-card",
                glow === "primary" && "glow-primary",
                glow === "accent" && "glow-accent",
                className
            )}
        >
            {children}
        </div>
    );
}
