"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    Menu,
    Package,
    FileText,
    BarChart3,
    Settings,
    Warehouse,
    Moon,
    Sun,
    Bell,
    Search,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const navItems = [
    { href: "/admin", icon: BarChart3, label: "Dashboard" },
    { href: "/admin/inventory", icon: Package, label: "Inventory" },
    { href: "/admin/accounting", icon: FileText, label: "Accounting" },
    { href: "/admin/warehouses", icon: Warehouse, label: "Warehouses" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
];

function NavLink({
    href,
    icon: Icon,
    label,
    isActive,
}: {
    href: string;
    icon: typeof BarChart3;
    label: string;
    isActive: boolean;
}) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer",
                isActive
                    ? "bg-primary-500/10 text-primary-500 shadow-sm"
                    : "text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] hover:bg-[rgb(var(--surface-elevated))]"
            )}
        >
            <Icon className={cn("h-5 w-5", isActive && "text-primary-500")} />
            <span>{label}</span>
            {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
            )}
        </Link>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Check system preference
        if (typeof window !== "undefined") {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setIsDark(prefersDark);
            document.documentElement.classList.toggle("dark", prefersDark);
        }
    }, []);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle("dark");
    };

    return (
        <div className="min-h-screen bg-[rgb(var(--background))]">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-[rgb(var(--border))] lg:bg-[rgb(var(--surface))]">
                <div className="flex h-full flex-col gap-y-5 px-6 py-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 px-2 cursor-pointer">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500">
                            <Package className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <span className="text-lg font-bold">Project-2</span>
                            <span className="block text-xs text-[rgb(var(--muted))]">ERP System</span>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex flex-1 flex-col gap-1 mt-6">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.href}
                                href={item.href}
                                icon={item.icon}
                                label={item.label}
                                isActive={pathname === item.href}
                            />
                        ))}
                    </nav>

                    {/* Bottom section */}
                    <div className="mt-auto space-y-2">
                        <button
                            onClick={toggleTheme}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[rgb(var(--muted))] transition-all hover:bg-[rgb(var(--surface-elevated))] hover:text-[rgb(var(--foreground))] cursor-pointer"
                        >
                            {isDark ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                            <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
                        </button>
                        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition-all hover:bg-red-500/10 cursor-pointer">
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content area */}
            <div className="lg:pl-72">
                {/* Top bar */}
                <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-[rgb(var(--border))] bg-[rgb(var(--background))]/80 backdrop-blur-lg px-4 lg:px-8">
                    {/* Mobile menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="lg:hidden"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-72 bg-[rgb(var(--surface))] p-0">
                            <div className="flex h-full flex-col gap-y-5 px-6 py-6">
                                <Link href="/" className="flex items-center gap-3 px-2 cursor-pointer">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500">
                                        <Package className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-lg font-bold">Project-2 ERP</span>
                                </Link>
                                <nav className="flex flex-1 flex-col gap-1 mt-4">
                                    {navItems.map((item) => (
                                        <NavLink
                                            key={item.href}
                                            href={item.href}
                                            icon={item.icon}
                                            label={item.label}
                                            isActive={pathname === item.href}
                                        />
                                    ))}
                                </nav>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Search */}
                    <div className="flex-1 max-w-xl">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--muted))]" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] py-2.5 pl-10 pr-4 text-sm placeholder:text-[rgb(var(--muted))] focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                            />
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        <button className="relative p-2 rounded-xl hover:bg-[rgb(var(--surface))] transition-colors cursor-pointer">
                            <Bell className="h-5 w-5 text-[rgb(var(--muted))]" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full" />
                        </button>
                        <button className="flex items-center gap-3 p-2 rounded-xl hover:bg-[rgb(var(--surface))] transition-colors cursor-pointer">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500" />
                            <span className="hidden sm:block text-sm font-medium">Admin</span>
                        </button>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
