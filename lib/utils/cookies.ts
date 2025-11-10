// Cookie utility functions for authentication

export const setCookie = (name: string, value: string, days?: number) => {
    if (typeof window !== 'undefined') {
        const maxAge = days ? days * 24 * 60 * 60 : 24 * 60 * 60; // Default 1 day
        document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; secure; samesite=strict`;
    }
};

export const getCookie = (name: string): string | null => {
    if (typeof window !== 'undefined') {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop()?.split(';').shift() || null;
        }
    }
    return null;
};

export const deleteCookie = (name: string) => {
    if (typeof window !== 'undefined') {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
};

export const setAuthCookies = (accessToken: string, refreshToken: string) => {
    setCookie('accessToken', accessToken, 1); // 1 day
    setCookie('refreshToken', refreshToken, 7); // 7 days
};

export const clearAuthCookies = () => {
    deleteCookie('accessToken');
    deleteCookie('refreshToken');
};

export const getAuthTokensFromCookies = () => {
    return {
        accessToken: getCookie('accessToken'),
        refreshToken: getCookie('refreshToken'),
    };
};