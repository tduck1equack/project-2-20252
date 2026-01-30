'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { useLogout } from '@/hooks/use-auth';
import { AuthGuard } from '@/components/auth-guard';
import { ShoppingBag, Package, User, LogOut, Home } from 'lucide-react';

const navItems = [
    { href: '/customer', label: 'Dashboard', icon: Home },
    { href: '/customer/products', label: 'Products', icon: Package },
    { href: '/customer/orders', label: 'My Orders', icon: ShoppingBag },
    { href: '/customer/profile', label: 'Profile', icon: User },
];

export default function CustomerLayout({ children }: { children: ReactNode }) {
    const { user } = useAuthStore();
    const logoutMutation = useLogout();

    return (
        <AuthGuard allowedRoles={['CUSTOMER']}>
            <div className="min-h-screen bg-[rgb(var(--background))]">
                {/* Top Navigation */}
                <nav className="sticky top-0 z-50 glass-card border-b border-[rgb(var(--border))]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <Link href="/customer" className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--accent))] flex items-center justify-center">
                                    <ShoppingBag className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-semibold text-lg">Store</span>
                            </Link>

                            {/* Navigation Links */}
                            <div className="hidden md:flex items-center gap-6">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center gap-2 text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition-colors"
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </Link>
                                ))}
                            </div>

                            {/* User Menu */}
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-[rgb(var(--muted))]">
                                    {user?.name || user?.email}
                                </span>
                                <button
                                    onClick={() => logoutMutation.mutate()}
                                    disabled={logoutMutation.isPending}
                                    className="p-2 rounded-lg hover:bg-[rgb(var(--surface-elevated))] transition-colors cursor-pointer"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5 text-[rgb(var(--muted))]" />
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}
