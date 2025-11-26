'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores';
import { setAuthCookies } from '@/lib/utils/cookies';

/**
 * AuthProvider component that initializes authentication state
 * This should be rendered high in the component tree
 * Now uses Zustand instead of Redux
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setTokens } = useAuthStore();

    useEffect(() => {
        // Initialize auth state from localStorage on app load
        const initializeAuth = () => {
            if (typeof window !== 'undefined') {
                const accessToken = localStorage.getItem('accessToken');
                const refreshToken = localStorage.getItem('refreshToken');

                if (accessToken && refreshToken) {
                    setTokens(accessToken, refreshToken);
                    
                    // Sync with cookies for middleware access
                    setAuthCookies(accessToken, refreshToken);
                }
            }
        };

        initializeAuth();
    }, [setTokens]);

    return <>{children}</>;
}