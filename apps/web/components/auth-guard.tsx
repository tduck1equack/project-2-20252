'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, getPortalPath } from '@/stores/auth-store';
import { useProfile, useAutoRefresh } from '@/hooks/use-auth';
import { ReactNode } from 'react';

interface AuthGuardProps {
    children: ReactNode;
    allowedRoles?: string[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
    const router = useRouter();
    const { isAuthenticated, user, accessToken } = useAuthStore();
    const { isLoading, isError } = useProfile();

    // Auto-refresh tokens
    useAutoRefresh();

    useEffect(() => {
        // Not authenticated - redirect to login
        if (!accessToken) {
            router.replace('/login');
            return;
        }

        // If profile fetch failed, clear and redirect
        if (isError) {
            useAuthStore.getState().clearAuth();
            router.replace('/login');
            return;
        }

        // Check role access
        if (user && allowedRoles && !allowedRoles.includes(user.role)) {
            // Redirect to their correct portal
            router.replace(getPortalPath(user.role));
        }
    }, [accessToken, isError, user, allowedRoles, router]);

    // Show loading while checking auth
    if (!isAuthenticated || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--background))]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-[rgb(var(--primary))] border-t-transparent animate-spin" />
                    <p className="text-[rgb(var(--muted))]">Loading...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
