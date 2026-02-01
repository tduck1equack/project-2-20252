'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useLogout } from '@/hooks/use-auth';
import { AuthGuard } from '@/components/auth-guard';
import { Package, Truck, BarChart3, LogOut, Home, Boxes } from 'lucide-react';
import { GlobalToolbar } from '@/components/global-toolbar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/employee', label: 'Dashboard', icon: Home },
    { href: '/employee/stock', label: 'Stock Levels', icon: Package },
    { href: '/employee/movements', label: 'Movements', icon: Truck },
    { href: '/employee/batches', label: 'Batches', icon: Boxes },
];

export default function EmployeeLayout({ children }: { children: ReactNode }) {
    const { user } = useAuthStore();
    const logoutMutation = useLogout();
    const pathname = usePathname();

    return (
        <AuthGuard allowedRoles={['EMPLOYEE', 'ACCOUNTANT']}>
            <div className="flex min-h-screen bg-background">
                {/* Sidebar */}
                <aside className="w-64 border-r border-border bg-card p-4 flex flex-col">
                    {/* Logo */}
                    <Link href="/employee" className="flex items-center gap-3 mb-8 px-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-lg block">ERP System</span>
                            <span className="text-xs text-muted-foreground">Employee Portal</span>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer",
                                        isActive
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    )}
                                >
                                    <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
                                    {item.label}
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Theme & Language */}
                    <div className="flex items-center justify-center py-3 border-t border-border">
                        <GlobalToolbar />
                    </div>

                    {/* User Section */}
                    <div className="border-t border-border pt-4 mt-2">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                                <span className="text-sm font-medium">
                                    {user?.name?.[0] || user?.email?.[0] || 'E'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user?.name || 'Employee'}</p>
                                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => logoutMutation.mutate()}
                                disabled={logoutMutation.isPending}
                                className="cursor-pointer"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4 text-muted-foreground" />
                            </Button>
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
