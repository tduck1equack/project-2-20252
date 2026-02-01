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
    Bell,
    Search,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlobalToolbar } from "@/components/global-toolbar";
import { Input } from "@/components/ui/input";

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
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
        >
            <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
            <span>{label}</span>
            {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
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

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-border lg:bg-card">
                <div className="flex h-full flex-col gap-y-5 px-6 py-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 px-2 cursor-pointer">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                            <Package className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <span className="text-lg font-bold">Project-2</span>
                            <span className="block text-xs text-muted-foreground">ERP System</span>
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

                    {/* Theme & Language */}
                    <div className="border-t border-border pt-4">
                        <GlobalToolbar className="justify-center" />
                    </div>

                    {/* Bottom section */}
                    <div className="space-y-2">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main content area */}
            <div className="lg:pl-72">
                {/* Top bar */}
                <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-lg px-4 lg:px-8">
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
                        <SheetContent side="left" className="w-72 bg-card p-0">
                            <div className="flex h-full flex-col gap-y-5 px-6 py-6">
                                <Link href="/" className="flex items-center gap-3 px-2 cursor-pointer">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
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
                                <div className="border-t border-border pt-4">
                                    <GlobalToolbar className="justify-center" />
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Search */}
                    <div className="flex-1 max-w-xl">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4"
                            />
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="relative cursor-pointer">
                            <Bell className="h-5 w-5 text-muted-foreground" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
                        </Button>
                        <Button variant="ghost" className="gap-3 cursor-pointer">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent" />
                            <span className="hidden sm:block text-sm font-medium">Admin</span>
                        </Button>
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
