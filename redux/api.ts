import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { 
    LoginCredentials, 
    RegisterCredentials,
    VerifyEmailCredentials,
    ResendVerificationCredentials,
    ForgotPasswordCredentials,
    ResetPasswordCredentials,
    RefreshTokenCredentials,
    CheckoutCredentials
} from "@/lib/schema";
import { clearUserInfo, setUserInfo, setTokens } from "./slices/userSlice";
import { 
    TradeOffApiResponse, 
    AuthData, 
    TokenResponse, 
    User 
} from "@/lib/types";
import { RootState } from "./store";
import { setAuthCookies, clearAuthCookies } from "@/lib/utils/cookies";


const BASE_URL =
    process.env.NODE_ENV === "production"
        ? process.env.BASE_URL || "https://api.tradeoff.com"
        : `http://localhost:3050`;

// Helper functions for token management
const getTokenFromStorage = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('accessToken');
    }
    return null;
};

const getRefreshTokenFromStorage = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('refreshToken');
    }
    return null;
};

const setTokensInStorage = (accessToken: string, refreshToken: string): void => {
    if (typeof window !== 'undefined') {
        // Store in localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        // Also store in cookies for middleware access
        setAuthCookies(accessToken, refreshToken);
    }
};

const clearTokensFromStorage = (): void => {
    if (typeof window !== 'undefined') {
        // Clear localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // Clear cookies
        clearAuthCookies();
    }
};

// Base query with automatic token refresh
const baseQueryWithReauth: BaseQueryFn<FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    // Base query configuration
    const baseQuery = fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/v1`,
        prepareHeaders: (headers, { getState }) => {
            // Get token from state or localStorage
            const state = getState() as RootState;
            const token = state.auth.accessToken || getTokenFromStorage();
            
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    });

    // Try the initial request
    let result = await baseQuery(args, api, extraOptions);

    // If we get a 401 error, try to refresh the token
    if (result.error?.status === 401) {
        console.log('Token expired, attempting refresh...');
        
        const state = api.getState() as RootState;
        const refreshToken = state.auth.refreshToken || getRefreshTokenFromStorage();
        
        if (refreshToken) {
            // Attempt to refresh the token
            const refreshResult = await baseQuery(
                {
                    url: '/auth/refresh-token',
                    method: 'POST',
                    body: { refreshToken },
                },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                const refreshData = refreshResult.data as TradeOffApiResponse<TokenResponse>;
                
                if (refreshData.success && refreshData.data) {
                    // Store the new tokens
                    const { accessToken, refreshToken: newRefreshToken } = refreshData.data;
                    
                    // Update Redux store
                    api.dispatch(setTokens({
                        accessToken,
                        refreshToken: newRefreshToken
                    }));
                    
                    // Update localStorage
                    setTokensInStorage(accessToken, newRefreshToken);
                    
                    // Retry the original request with new token
                    result = await baseQuery(args, api, extraOptions);
                }
            } else {
                // Refresh failed, clear tokens and redirect to login
                console.log('Token refresh failed, logging out...');
                api.dispatch(clearUserInfo());
                clearTokensFromStorage();
                
                // Redirect to login page
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
            }
        } else {
            // No refresh token available, clear state and redirect
            api.dispatch(clearUserInfo());
            clearTokensFromStorage();
            
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
            }
        }
    }

    return result;
};


// Define the API
export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User", "Product", "Category"],
    endpoints: (builder) => ({
        // AUTHENTICATION ENDPOINTS - TradeOff API

        // 1. Register User
        register: builder.mutation<TradeOffApiResponse<AuthData>, RegisterCredentials>({
            query: (credentials) => ({
                url: "/auth/register",
                method: "POST",
                body: credentials,
            }),
            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    if (data.success && data.data) {
                        const { user, accessToken, refreshToken } = data.data;
                        
                        // Store tokens in localStorage
                        setTokensInStorage(accessToken, refreshToken);
                        
                        // Update Redux store
                        dispatch(setTokens({ accessToken, refreshToken }));
                        dispatch(setUserInfo(user));
                    }
                } catch (error) {
                    console.error("Registration failed:", error);
                }
            },
        }),

        // 2. Login User
        login: builder.mutation<TradeOffApiResponse<AuthData>, LoginCredentials>({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
            }),
            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    if (data.success && data.data) {
                        const { user, accessToken, refreshToken } = data.data;
                        
                        // Store tokens in localStorage
                        setTokensInStorage(accessToken, refreshToken);
                        
                        // Update Redux store
                        dispatch(setTokens({ accessToken, refreshToken }));
                        dispatch(setUserInfo(user));
                    }
                } catch (error) {
                    console.error("Login failed:", error);
                }
            },
        }),

        // 3. Verify Email (POST with code)
        verifyEmail: builder.mutation<TradeOffApiResponse, {  code: string }>({
            query: (credentials) => ({
                url: "/auth/verify-email",
                method: "POST",
                body: credentials,
            }),
        }),

        // 4. Verify Email (GET with URL parameter) - alternative endpoint
        verifyEmailByUrl: builder.mutation<TradeOffApiResponse, { code: string }>({
            query: ({ code }) => ({
                url: `/auth/verify-email/${code}`,
                method: "GET",
            }),
        }),

        // 5. Resend Verification Code
        resendVerification: builder.mutation<TradeOffApiResponse, ResendVerificationCredentials>({
            query: (credentials) => ({
                url: "/auth/resend-verification",
                method: "POST",
                body: credentials,
            }),
        }),

        // 6. Forgot Password
        forgotPassword: builder.mutation<TradeOffApiResponse, ForgotPasswordCredentials>({
            query: (credentials) => ({
                url: "/auth/forgot-password",
                method: "POST",
                body: credentials,
            }),
        }),

        // 7. Reset Password
        resetPassword: builder.mutation<TradeOffApiResponse, {code: string; newPassword:string}>({
            query: (credentials) => ({
                url: "/auth/reset-password",
                method: "POST",
                body: credentials,
            }),
        }),

        // 8. Refresh Token (handled automatically by baseQueryWithReauth)
        refreshToken: builder.mutation<TradeOffApiResponse<TokenResponse>, RefreshTokenCredentials>({
            query: (credentials) => ({
                url: "/auth/refresh-token",
                method: "POST",
                body: credentials,
            }),
            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    if (data.success && data.data) {
                        const { accessToken, refreshToken } = data.data;
                        
                        // Store new tokens
                        setTokensInStorage(accessToken, refreshToken);
                        dispatch(setTokens({ accessToken, refreshToken }));
                    }
                } catch (error) {
                    console.error("Token refresh failed:", error);
                    // Clear tokens and redirect to login
                    dispatch(clearUserInfo());
                    clearTokensFromStorage();
                }
            },
        }),

        // 9. Get Profile (Protected)
        getProfile: builder.query<TradeOffApiResponse<{ user: User }>, void>({
            query: () => ({ url: "/auth/profile" }),
            keepUnusedDataFor: 600,
            providesTags: ["User"],
            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    if (data.success && data.data?.user) {
                        dispatch(setUserInfo(data.data.user));
                    }
                } catch (error) {
                    console.error("Get profile failed:", error);
                }
            },
        }),

        // 10. Logout (clears tokens)
        logout: builder.mutation<TradeOffApiResponse, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    // Clear all auth data
                    dispatch(clearUserInfo());
                    clearTokensFromStorage();
                } catch (error) {
                    console.error("Logout failed:", error);
                    // Clear local data anyway
                    dispatch(clearUserInfo());
                    clearTokensFromStorage();
                }
            },
        }),

        // CHECKOUT ENDPOINT (keeping existing functionality)
        checkout: builder.mutation<
            { authorization_url: string, access_code: string, reference: string },
            CheckoutCredentials & {
                items: Array<{
                    name: string;
                    price: number;
                    quantity: number;
                }>;
                subtotal: number;
                deliveryFee: number;
                tax: number;
                total: number;
            }
        >({
            query: (data) => ({
                url: "/orders/checkout",
                method: "POST",
                body: data,
            }),
            onQueryStarted: async (_arg, { queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    // Redirect to Paystack authorization URL
                    if (data.authorization_url) {
                        window.location.href = data.authorization_url;
                    }
                } catch (error) {
                    console.error("Checkout failed:", error);
                }
            },
        }),
    }),
});

// Export hooks with TypeScript types
// Export hooks for usage in functional components
export const {
    // Auth Mutations
    useRegisterMutation,
    useLoginMutation,
    useVerifyEmailMutation,
    useVerifyEmailByUrlMutation,
    useResendVerificationMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useRefreshTokenMutation,
    useLogoutMutation,
    
    // Auth Queries
    useGetProfileQuery,
    
    // Checkout
    useCheckoutMutation,
    
    // Keep these commented out for now
    // useGetCategoriesQuery,
    // useGetCategoryByIdQuery,
    // useAddCategoryMutation,
    // useUpdateCategoryMutation,
    // useDeleteCategoryMutation,
    // useGetProductsQuery,
    // useGetProductByIdQuery,
    // useAddProductMutation,
    // useUpdateProductMutation,
    // useDeleteProductMutation,
    // useGetPackagesQuery,
    // useGetPackageByIdQuery,
    // useAddPackageMutation,
    // useUpdatePackageMutation,
    // useDeletePackageMutation,
    // useGetProductsByCategoryQuery,
} = api;

export type AppApi = typeof api;