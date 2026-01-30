'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore, User, getPortalPath } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterData {
    email: string;
    password: string;
    name?: string;
}

interface AuthResponse {
    accessToken: string;
    expiresIn: number;
}

// API functions
async function loginApi(credentials: LoginCredentials): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Login failed');
    }

    return res.json();
}

async function registerApi(data: RegisterData): Promise<User> {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Registration failed');
    }

    return res.json();
}

async function getProfileApi(accessToken: string): Promise<User> {
    const res = await fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch profile');
    }

    return res.json();
}

async function refreshTokenApi(): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error('Token refresh failed');
    }

    return res.json();
}

async function logoutApi(accessToken: string): Promise<void> {
    await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
    });
}

// Hooks
export function useLogin() {
    const { setAuth } = useAuthStore();
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: loginApi,
        onSuccess: async (data) => {
            // Fetch user profile with the new token
            const user = await getProfileApi(data.accessToken);
            setAuth(user, data.accessToken);
            queryClient.setQueryData(['profile'], user);

            // Redirect to appropriate portal
            router.push(getPortalPath(user.role));
        },
    });
}

export function useRegister() {
    const router = useRouter();

    return useMutation({
        mutationFn: registerApi,
        onSuccess: () => {
            router.push('/login?registered=true');
        },
    });
}

export function useLogout() {
    const { accessToken, clearAuth } = useAuthStore();
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => logoutApi(accessToken || ''),
        onSettled: () => {
            clearAuth();
            queryClient.clear();
            router.push('/login');
        },
    });
}

export function useRefreshToken() {
    const { setToken, clearAuth } = useAuthStore();

    return useMutation({
        mutationFn: refreshTokenApi,
        onSuccess: (data) => {
            setToken(data.accessToken);
        },
        onError: () => {
            clearAuth();
        },
    });
}

export function useProfile() {
    const { accessToken, setAuth, clearAuth } = useAuthStore();

    return useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            if (!accessToken) throw new Error('No token');
            const user = await getProfileApi(accessToken);
            setAuth(user, accessToken);
            return user;
        },
        enabled: !!accessToken,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
    });
}

// Auto-refresh hook
export function useAutoRefresh() {
    const { accessToken } = useAuthStore();
    const refreshMutation = useRefreshToken();

    // Refresh every 14 minutes (before 15min expiry)
    useQuery({
        queryKey: ['auto-refresh'],
        queryFn: async () => {
            await refreshMutation.mutateAsync();
            return true;
        },
        enabled: !!accessToken,
        refetchInterval: 14 * 60 * 1000,
        refetchIntervalInBackground: true,
        staleTime: Infinity,
    });
}
