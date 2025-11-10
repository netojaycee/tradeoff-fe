import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RootState } from '@/redux/store';
import { useGetProfileQuery } from '@/redux/api';

interface UseAuthOptions {
    redirectTo?: string;
    redirectIfFound?: boolean;
}

/**
 * Custom hook for authentication logic
 * @param options - Configuration options
 * @returns Auth state and utilities
 */
export function useAuth(options: UseAuthOptions = {}) {
    const { redirectTo, redirectIfFound = false } = options;
    const router = useRouter();
    
    // Get auth state from Redux store
    const { user, accessToken, refreshToken, isAuthenticated } = useSelector(
        (state: RootState) => state.auth
    );
    
    // Attempt to fetch user profile if we have a token but no user data
    const {
        isLoading: isLoadingProfile,
        error: profileError,
    } = useGetProfileQuery(undefined, {
        skip: !accessToken || !!user, // Skip if no token or user already exists
    });
    
    const isLoading = isLoadingProfile;
    const hasError = !!profileError;
    
    useEffect(() => {
        // Handle redirects based on auth state
        if (!isLoading && redirectTo) {
            if (redirectIfFound && isAuthenticated) {
                // Redirect authenticated users away from auth pages
                router.push(redirectTo);
            } else if (!redirectIfFound && !isAuthenticated) {
                // Redirect unauthenticated users to login
                const currentPath = window.location.pathname;
                const loginUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
                router.push(loginUrl);
            }
        }
    }, [isAuthenticated, isLoading, redirectTo, redirectIfFound, router]);
    
    return {
        // Auth state
        user,
        accessToken,
        refreshToken,
        isAuthenticated,
        isLoading,
        hasError,
        
        // Utilities
        requireAuth: () => {
            if (!isAuthenticated && !isLoading) {
                const currentPath = window.location.pathname;
                router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
            }
        },
        
        redirectToLogin: (returnUrl?: string) => {
            const redirect = returnUrl || window.location.pathname;
            router.push(`/auth/login?redirect=${encodeURIComponent(redirect)}`);
        },
        
        redirectToDashboard: () => {
            router.push('/');
        },
    };
}

/**
 * Hook for protecting routes that require authentication
 */
export function useRequireAuth() {
    return useAuth({
        redirectTo: '/auth/login',
        redirectIfFound: false,
    });
}

/**
 * Hook for auth pages that should redirect authenticated users
 */
export function useRedirectIfAuthenticated(redirectTo: string = '/') {
    return useAuth({
        redirectTo,
        redirectIfFound: true,
    });
}

/**
 * Simple hook to check if user is authenticated
 */
export function useIsAuthenticated() {
    const { isAuthenticated, isLoading } = useSelector(
        (state: RootState) => state.auth
    );
    
    return {
        isAuthenticated,
        isLoading,
    };
}