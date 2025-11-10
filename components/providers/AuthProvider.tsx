'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTokens } from '@/redux/slices/userSlice';
import { setAuthCookies } from '@/lib/utils/cookies';

/**
 * AuthProvider component that initializes authentication state
 * This should be rendered high in the component tree
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();

    useEffect(() => {
        // Initialize auth state from localStorage on app load
        const initializeAuth = () => {
            if (typeof window !== 'undefined') {
                const accessToken = localStorage.getItem('accessToken');
                const refreshToken = localStorage.getItem('refreshToken');

                if (accessToken && refreshToken) {
                    dispatch(setTokens({ accessToken, refreshToken }));
                    
                    // Sync with cookies for middleware access
                    setAuthCookies(accessToken, refreshToken);
                }
            }
        };

        initializeAuth();
    }, [dispatch]);

    return <>{children}</>;
}