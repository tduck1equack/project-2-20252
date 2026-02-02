'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useLogout } from '@/hooks/use-auth';
import { AuthGuard } from '@/components/auth-guard';
import { ShoppingBag, Package, User, LogOut, Home, ShoppingCart } from 'lucide-react';
import { GlobalToolbar } from '@/components/global-toolbar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCartStore } from '@/stores/cart-store';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export default function CustomerLayout({ children }: { children: ReactNode }) {
    const { user } = useAuthStore();
    const logoutMutation = useLogout();
    const cartItemCount = useCartStore((state) => state.items.length);
    const pathname = usePathname();
    const t = useTranslations();

    const navItems = [
        { href: '/customer', label: t('nav.dashboard'), icon: Home },
        { href: '/customer/products', label: t('nav.products'), icon: Package },
        { href: '/customer/orders', label: t('nav.orders'), icon: ShoppingBag },
        { href: '/customer/profile', label: t('settings.profile'), icon: User },
    ];

    return (
        <AuthGuard allowedRoles={['CUSTOMER']}>
            <div className="min-h-screen bg-background">
                {/* Top Navigation */}
                <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <Link href="/customer" className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                    <ShoppingBag className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-semibold text-lg">Store</span>
                            </Link>

                            {/* Navigation Links */}
                            <div className="hidden md:flex items-center gap-6">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-2 text-sm transition-colors cursor-pointer",
                                                isActive
                                                    ? "text-primary font-medium"
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            <item.icon className="w-4 h-4" />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Right Side: Cart + Theme + Language + User */}
                            <div className="flex items-center gap-2">
                                {/* Cart */}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            asChild
                                            className="relative cursor-pointer"
                                        >
                                            <Link href="/customer/cart">
                                                <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                                                {cartItemCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center">
                                                        {cartItemCount}
                                                    </span>
                                                )}
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Shopping Cart</p>
                                    </TooltipContent>
                                </Tooltip>

                                {/* Theme Toggle + Language */}
                                <GlobalToolbar />

                                <div className="w-px h-6 bg-border" />

                                {/* User Menu */}
                                <span className="text-sm text-muted-foreground hidden sm:inline">
                                    {user?.name || user?.email}
                                </span>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => logoutMutation.mutate()}
                                            disabled={logoutMutation.isPending}
                                            className="cursor-pointer"
                                        >
                                            <LogOut className="w-5 h-5 text-muted-foreground" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('nav.logout')}</p>
                                    </TooltipContent>
                                </Tooltip>
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
