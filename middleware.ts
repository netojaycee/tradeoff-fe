import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
    '/dashboard',
    '/profile',
    // '/orders',
    '/settings',
    '/seller',
    '/admin',
];

// Define routes that require cart items to access
const cartRequiredRoutes = ['/checkout'];

// Define auth routes that should redirect to dashboard if user is already logged in
const authRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-otp',
];


export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get access token from cookies (which we now properly set)
    const accessToken = request.cookies.get('accessToken')?.value;

    // Check if user is authenticated (has valid access token)
    const isAuthenticated = !!accessToken;

    // Check route types
    const isProtectedRoute = protectedRoutes.some(route => 
        pathname.startsWith(route)
    );
    const isAuthRoute = authRoutes.some(route => 
        pathname.startsWith(route)
    );

    // If accessing /checkout, require cart items in localStorage (SSR limitation)
    if (cartRequiredRoutes.some(route => pathname.startsWith(route))) {
        // Try to read cart from cookies (set by client JS on add to cart)
        const cartCookie = request.cookies.get('tradeoff_cart')?.value;
        let hasCart = false;
        try {
            if (cartCookie) {
                const cart = JSON.parse(cartCookie);
                hasCart = Array.isArray(cart) && cart.length > 0;
            }
        } catch {}
        if (!hasCart) {
            // No cart, redirect to /cart
            return NextResponse.redirect(new URL('/cart', request.url));
        }
    }

    // If accessing protected route without authentication
    if (isProtectedRoute && !isAuthenticated) {
        // Redirect to login with return URL
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If accessing auth route while authenticated
    if (isAuthRoute && isAuthenticated) {
        // Redirect to dashboard or return URL
        const redirectUrl = request.nextUrl.searchParams.get('redirect') || '/dashboard';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // For all other routes (public routes, authenticated users accessing protected routes)
    return NextResponse.next();
}

// Configure which paths this middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc.)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
};