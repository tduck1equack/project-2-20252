'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore, getPortalPath } from '@/stores/auth-store';
import { LoginDto, RegisterDto, ApiResponseDto, User, TokenPair } from '@repo/dto';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

// Local aliases if desired, or just use DTOs directly
type LoginCredentials = LoginDto;
type RegisterData = RegisterDto;
type AuthResponse = TokenPair;
type ApiResponse<T> = ApiResponseDto<T>;

// API functions wrapper to handle standard response
async function post<T>(url: string, data?: any): Promise<T> {
    const response = await api.post<any, ApiResponse<T>>(url, data);
    if (!response.success && response.error) {
        throw new Error(response.error.message || 'Request failed');
    }
    return response.data!;
}

async function get<T>(url: string, headers?: any): Promise<T> {
    const response = await api.get<any, ApiResponse<T>>(url, { headers });
    if (!response.success && response.error) {
        throw new Error(response.error.message || 'Request failed');
    }
    return response.data!;
}

async function loginApi(credentials: LoginCredentials): Promise<AuthResponse> {
    return post<AuthResponse>('/api/v1/auth/login', credentials);
}

async function registerApi(data: RegisterData): Promise<User> {
    return post<User>('/api/v1/auth/register', data);
}

async function getProfileApi(accessToken: string): Promise<User> {
    return get<User>('/api/v1/auth/profile', { Authorization: `Bearer ${accessToken}` });
}

async function refreshTokenApi(): Promise<AuthResponse> {
    return post<AuthResponse>('/api/v1/auth/refresh');
}

async function logoutApi(accessToken: string): Promise<void> {
    await api.post('/api/v1/auth/logout', {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
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
