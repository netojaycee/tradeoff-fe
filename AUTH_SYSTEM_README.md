# TradeOff Authentication System Implementation

## Overview
The TradeOff frontend now has a complete authentication system that integrates with the backend API using JWT tokens with automatic refresh functionality and protected routes.

## Key Features

### 1. **Automatic Token Refresh**
- Access tokens are automatically refreshed when they expire (401 errors)
- Refresh tokens are stored securely and used for token renewal
- Seamless user experience with no manual re-authentication required

### 2. **Route Protection**
- Middleware automatically protects routes that require authentication
- Unauthenticated users are redirected to login with return URL
- Authenticated users are redirected away from auth pages

### 3. **State Management**
- Redux store manages authentication state
- Persistent storage using Redux Persist
- Tokens stored in localStorage with Redux synchronization

### 4. **TypeScript Integration**
- Full type safety with TradeOff API response types
- Comprehensive schemas for all authentication endpoints
- Type-safe hooks and components

## Authentication Endpoints

### Available API Endpoints:
1. **POST /auth/register** - Register new user
2. **POST /auth/login** - Login user
3. **POST /auth/verify-email** - Verify email with 6-digit code
4. **GET /auth/verify-email/:code** - Verify email via URL
5. **POST /auth/resend-verification** - Resend verification code
6. **POST /auth/forgot-password** - Request password reset
7. **POST /auth/reset-password** - Reset password with code
8. **POST /auth/refresh-token** - Refresh access token
9. **GET /auth/profile** - Get user profile (protected)
10. **POST /auth/logout** - Logout user

## Usage Examples

### 1. **Using Authentication Hooks**

```tsx
import { useAuth, useRequireAuth } from '@/lib/hooks/useAuth';

// Basic auth status
function MyComponent() {
    const { isAuthenticated, user } = useAuth();
    
    return (
        <div>
            {isAuthenticated ? (
                <p>Welcome, {user?.firstName}!</p>
            ) : (
                <p>Please log in</p>
            )}
        </div>
    );
}

// Protected component
function ProtectedComponent() {
    const { user, requireAuth } = useRequireAuth();
    
    useEffect(() => {
        requireAuth(); // Automatically redirects if not authenticated
    }, [requireAuth]);
    
    return <div>Protected content for {user?.firstName}</div>;
}
```

### 2. **Using API Mutations**

```tsx
import { useLoginMutation, useRegisterMutation } from '@/redux/api';

function LoginComponent() {
    const [login, { isLoading, error }] = useLoginMutation();
    
    const handleLogin = async (credentials) => {
        try {
            const result = await login(credentials).unwrap();
            if (result.success) {
                // User automatically logged in, tokens stored
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };
}
```

### 3. **Protected Routes Setup**

Routes are automatically protected by middleware. Configure in `middleware.ts`:

```typescript
// Protected routes (require authentication)
const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/orders',
    '/settings',
];

// Auth routes (redirect to dashboard if authenticated)
const authRoutes = [
    '/login',
    '/register',
    '/forgot-password',
];
```

## File Structure

```
redux/
├── api.ts              # RTK Query API with auth endpoints
├── store.ts            # Redux store configuration
└── slices/
    └── userSlice.ts    # Auth state management

lib/
├── hooks/
│   └── useAuth.ts      # Authentication hooks
├── types/
│   └── index.ts        # TradeOff API types
└── schema/
    └── index.ts        # Zod validation schemas

components/
├── auth/
│   └── LoginForm.tsx   # Example login component
└── providers/
    └── AuthProvider.tsx # Auth initialization

middleware.ts           # Route protection middleware
```

## Backend API Configuration

The system is configured to work with the TradeOff backend API:

- **Base URL**: `http://localhost:3050/api/v1` (development)
- **Token Lifetime**: 24 hours (access), 7 days (refresh)
- **Verification**: 6-digit codes for email verification
- **Password Requirements**: Minimum 8 characters with uppercase, lowercase, number, and special character

## Security Features

### 1. **Token Management**
- Secure token storage in localStorage
- Automatic token cleanup on logout
- Token validation on app initialization

### 2. **Route Protection**
- Server-side middleware protection
- Client-side authentication hooks
- Automatic redirects with return URLs

### 3. **Error Handling**
- Graceful handling of expired tokens
- User-friendly error messages
- Fallback authentication flows

## Getting Started

### 1. **Wrap your app with providers**

```tsx
// app/layout.tsx or _app.tsx
import { AuthProvider } from '@/components/providers/AuthProvider';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';

export default function RootLayout({ children }) {
    return (
        <Provider store={store}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </Provider>
    );
}
```

### 2. **Use authentication in components**

```tsx
import { useAuth } from '@/lib/hooks/useAuth';
import { useLoginMutation } from '@/redux/api';

function MyComponent() {
    const { isAuthenticated, user } = useAuth();
    const [login] = useLoginMutation();
    
    // Your component logic
}
```

### 3. **Create protected pages**

```tsx
import { useRequireAuth } from '@/lib/hooks/useAuth';

export default function DashboardPage() {
    const { user } = useRequireAuth();
    
    return (
        <div>
            <h1>Welcome to Dashboard, {user?.firstName}!</h1>
        </div>
    );
}
```

## Environment Configuration

Make sure to set the correct environment variables:

```env
# Development
NODE_ENV=development
BASE_URL=http://localhost:3050

# Production
NODE_ENV=production
BASE_URL=https://api.tradeoff.com
```

This authentication system provides a robust, secure, and user-friendly foundation for the TradeOff application with automatic token management, route protection, and comprehensive TypeScript support.