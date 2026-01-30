'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { useLogout } from '@/hooks/use-auth';
import { AuthGuard } from '@/components/auth-guard';
import { Package, Truck, BarChart3, LogOut, Home, Boxes } from 'lucide-react';

const navItems = [
    { href: '/employee', label: 'Dashboard', icon: Home },
    { href: '/employee/stock', label: 'Stock Levels', icon: Package },
    { href: '/employee/movements', label: 'Movements', icon: Truck },
    { href: '/employee/batches', label: 'Batches', icon: Boxes },
];

export default function EmployeeLayout({ children }: { children: ReactNode }) {
    const { user } = useAuthStore();
    const logoutMutation = useLogout();

    return (
        <AuthGuard allowedRoles={['EMPLOYEE', 'ACCOUNTANT']}>
            <div className="flex min-h-screen bg-[rgb(var(--background))]">
                {/* Sidebar */}
                <aside className="w-64 glass-card border-r border-[rgb(var(--border))] p-4 flex flex-col">
                    {/* Logo */}
                    <Link href="/employee" className="flex items-center gap-3 mb-8 px-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--accent))] flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-lg block">ERP System</span>
                            <span className="text-xs text-[rgb(var(--muted))]">Employee Portal</span>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[rgb(var(--muted))] hover:bg-[rgb(var(--surface-elevated))] hover:text-[rgb(var(--foreground))] transition-colors"
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* User Section */}
                    <div className="border-t border-[rgb(var(--border))] pt-4 mt-4">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 rounded-full bg-[rgb(var(--surface-elevated))] flex items-center justify-center">
                                <span className="text-sm font-medium">
                                    {user?.name?.[0] || user?.email?.[0] || 'E'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user?.name || 'Employee'}</p>
                                <p className="text-xs text-[rgb(var(--muted))] truncate">{user?.email}</p>
                            </div>
                            <button
                                onClick={() => logoutMutation.mutate()}
                                disabled={logoutMutation.isPending}
                                className="p-2 rounded-lg hover:bg-[rgb(var(--surface-elevated))] transition-colors cursor-pointer"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4 text-[rgb(var(--muted))]" />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}
