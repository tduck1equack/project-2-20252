import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, UserRole } from '@repo/dto';
export type { User, UserRole };

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
}

interface AuthActions {
    setAuth: (user: User, accessToken: string) => void;
    setToken: (accessToken: string) => void;
    clearAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            // State
            user: null,
            accessToken: null,
            isAuthenticated: false,

            // Actions
            setAuth: (user, accessToken) =>
                set({ user, accessToken, isAuthenticated: true }),

            setToken: (accessToken) =>
                set({ accessToken }),

            clearAuth: () =>
                set({ user: null, accessToken: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                accessToken: state.accessToken,
                // Don't persist user - fetch fresh on mount
            }),
        }
    )
);

// Role portal mapping
export const rolePortals: Record<UserRole, string> = {
    CUSTOMER: '/customer',
    EMPLOYEE: '/employee',
    MANAGER: '/manager',
    ADMIN: '/admin',
    ACCOUNTANT: '/employee',
};

// Get redirect path for user's role
export const getPortalPath = (role: UserRole): string => {
    return rolePortals[role] || '/customer';
};
