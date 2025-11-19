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
    CheckoutCredentials,
    ProductFormData,
    CategoryFormData,
    SubcategoryFormData
} from "@/lib/schema";
import { clearUserInfo, setUserInfo, setTokens } from "./slices/userSlice";
import { 
    TradeOffApiResponse, 
    AuthData, 
    TokenResponse, 
    User,
    Product,
    Category,
    Subcategory
} from "@/lib/types";
import { RootState } from "./store";
import { setAuthCookies, clearAuthCookies } from "@/lib/utils/cookies";


const BASE_URL =
    process.env.NODE_ENV === "production"
        ? process.env.API_BASE_URL || "https://api-tradeoff.onrender.com"
        : `http://192.168.1.135:3050`;

// const BASE_URL = process.env.API_BASE_URL || "http://192.168.1.135:3050";

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
            // --- CART & FAVORITES API PLACEHOLDERS ---

            // Cart Endpoints (placeholders, not enabled)
            // getCart: builder.query<TradeOffApiResponse<CartItem[]>, void>({
            //   query: () => ({ url: "/cart" }),
            // }),
            // addToCart: builder.mutation<TradeOffApiResponse, CartItem>({
            //   query: (item) => ({ url: "/cart", method: "POST", body: item }),
            // }),
            // updateCartItem: builder.mutation<TradeOffApiResponse, { id: string; quantity: number }>({
            //   query: ({ id, quantity }) => ({ url: `/cart/${id}`, method: "PATCH", body: { quantity } }),
            // }),
            // removeFromCart: builder.mutation<TradeOffApiResponse, string>({
            //   query: (id) => ({ url: `/cart/${id}`, method: "DELETE" }),
            // }),

            // Favorites Endpoints (placeholders, not enabled)
            // getFavorites: builder.query<TradeOffApiResponse<string[]>, void>({
            //   query: () => ({ url: "/favorites" }),
            // }),
            // addFavorite: builder.mutation<TradeOffApiResponse, string>({
            //   query: (productId) => ({ url: "/favorites", method: "POST", body: { productId } }),
            // }),
            // removeFavorite: builder.mutation<TradeOffApiResponse, string>({
            //   query: (productId) => ({ url: `/favorites/${productId}`, method: "DELETE" }),
            // }),
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
                        // const { user, accessToken, refreshToken } = data.data;
                        
                        // Store tokens in localStorage
                        // setTokensInStorage(accessToken, refreshToken);
                        
                        // Update Redux store
                        // dispatch(setTokens({ accessToken, refreshToken }));
                        // dispatch(setUserInfo(user));
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

        // PRODUCT ENDPOINTS
        createProduct: builder.mutation<TradeOffApiResponse<Product>, ProductFormData>({
            query: (data) => ({
                url: "/products",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Product"],
        }),

        getProducts: builder.query<{ success: boolean; message: string; data: Product[]; meta: { total: number; page: number; limit: number }; timestamp: string }, { page?: number; limit?: number; category?: string; search?: string; condition?: string; brand?: string; minPrice?: number; maxPrice?: number; sortBy?: string; status?: string }>({
            query: ({ page = 1, limit = 20, category, search, condition, brand, minPrice, maxPrice, sortBy = 'newest', status = 'active' }) => {
                const params = new URLSearchParams();
                params.append('page', page.toString());
                params.append('limit', limit.toString());
                if (category) params.append('category', category);
                if (search) params.append('search', search);
                if (condition) params.append('condition', condition);
                if (brand) params.append('brand', brand);
                if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
                if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());
                if (sortBy) params.append('sortBy', sortBy);
                if (status) params.append('status', status);
                return { url: `/products?${params.toString()}` };
            },
            providesTags: ["Product"],
        }),

        getProductById: builder.query<{ success: boolean; message: string; data: Product; timestamp: string }, string>({
            query: (id) => ({ url: `/products/${id}` }),
            providesTags: ["Product"],
        }),

        getProductBySlug: builder.query<{ success: boolean; message: string; data: Product; timestamp: string }, string>({
            query: (slug) => ({ url: `/products/slug/${slug}` }),
            providesTags: ["Product"],
        }),

        getUserProducts: builder.query<TradeOffApiResponse<{ products: Product[]; total: number }>, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 20 }) => {
                const params = new URLSearchParams();
                params.append('page', page.toString());
                params.append('limit', limit.toString());
                return { url: `/products/user/my-products?${params.toString()}` };
            },
            providesTags: ["Product"],
        }),

        updateProduct: builder.mutation<TradeOffApiResponse<Product>, { id: string; data: Partial<ProductFormData> }>({
            query: ({ id, data }) => ({
                url: `/products/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Product"],
        }),

        deleteProduct: builder.mutation<TradeOffApiResponse<void>, string>({
            query: (id) => ({
                url: `/products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"],
        }),

        // CATEGORY ENDPOINTS
        getCategories: builder.query<{ success: boolean; message: string; data: Category[]; meta: { total: number; page: number; limit: number }; timestamp: string }, void>({
            query: () => ({ url: "/categories" }),
            providesTags: ["Category"],
        }),

        getCategoryById: builder.query<{ success: boolean; message: string; data: Category; timestamp: string }, string>({
            query: (id) => ({ url: `/categories/${id}` }),
            providesTags: ["Category"],
        }),

        getCategoryBySlug: builder.query<{ success: boolean; message: string; data: Category; timestamp: string }, string>({
            query: (slug) => ({ url: `/categories/slug/${slug}` }),
            providesTags: ["Category"],
        }),

        createCategory: builder.mutation<TradeOffApiResponse<Category>, CategoryFormData>({
            query: (data) => ({
                url: "/categories",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Category"],
        }),

        editCategory: builder.mutation<TradeOffApiResponse<Category>, { id: string; data: Partial<CategoryFormData> }>({
            query: ({ id, data }) => ({
                url: `/categories/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Category"],
        }),

        deleteCategory: builder.mutation<TradeOffApiResponse<void>, string>({
            query: (id) => ({
                url: `/categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category"],
        }),

        // SUBCATEGORY ENDPOINTS
        getSubcategories: builder.query<{ success: boolean; message: string; data: Subcategory[]; meta: { total: number; page: number; limit: number }; timestamp: string }, { categoryId?: string }>({
            query: ({ categoryId }) => {
                if (categoryId) {
                    return { url: `/subcategories?categoryId=${categoryId}` };
                }
                return { url: "/subcategories" };
            },
            providesTags: ["Category"],
        }),

        getSubcategoryById: builder.query<{ success: boolean; message: string; data: Subcategory; timestamp: string }, string>({
            query: (id) => ({ url: `/subcategories/${id}` }),
            providesTags: ["Category"],
        }),

        getSubcategoryBySlug: builder.query<{ success: boolean; message: string; data: Subcategory; timestamp: string }, string>({
            query: (slug) => ({ url: `/subcategories/slug/${slug}` }),
            providesTags: ["Category"],
        }),

        createSubcategory: builder.mutation<TradeOffApiResponse<Subcategory>, SubcategoryFormData>({
            query: (data) => ({
                url: "/subcategories",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Category"],
        }),

        editSubcategory: builder.mutation<TradeOffApiResponse<Subcategory>, { id: string; data: Partial<SubcategoryFormData> }>({
            query: ({ id, data }) => ({
                url: `/subcategories/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Category"],
        }),

        deleteSubcategory: builder.mutation<TradeOffApiResponse<void>, string>({
            query: (id) => ({
                url: `/subcategories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category"],
        }),

        // CREATE ORDER ENDPOINT
        createOrder: builder.mutation<
            { order: any; data: { payment?: { reference: string; authorizationUrl: string; amount: number; currency: string; paymentMethod: string } } },
            {
                items: Array<{ productId: string; quantity: number; selectedSize?: string; itemNotes?: string }>;  
                shippingAddress: {
                    firstName: string;
                    lastName: string;
                    email: string;
                    phone: string;
                    address: string;
                    city: string;
                    state: string;
                    country: string;
                    postalCode?: string;
                };
                shippingMethod?: string;
                buyerNotes?: string;
                couponCode?: string;
                paymentMethod?: string;
                paymentNote?: string;
            }
        >({
            query: (data) => ({
                url: "/orders",
                method: "POST",
                body: {
                    ...data,
                    paymentMethod: data.paymentMethod || "paystack", // Default to paystack
                },
            }),
            invalidatesTags: ["Product"],
        }),

        // GET ORDER BY orderNo ENDPOINT
        getOrderByOrderNo: builder.query<{ success: boolean; message: string; data: any; timestamp: string }, string>({
            query: (ordno) => ({ url: `/orders/number/${ordno}` }),
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
                url: "/orders/",
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
// Cart/Favorites API hooks (commented out, enable when backend is ready)
// export const {
//   useGetCartQuery,
//   useAddToCartMutation,
//   useUpdateCartItemMutation,
//   useRemoveFromCartMutation,
//   useGetFavoritesQuery,
//   useAddFavoriteMutation,
//   useRemoveFavoriteMutation,
// } = api;

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
    
    // Product Mutations & Queries
    useCreateProductMutation,
    useGetProductsQuery,
    useGetProductByIdQuery,
    useGetProductBySlugQuery,
    useGetUserProductsQuery,
    useUpdateProductMutation,
    useDeleteProductMutation,
    
    // Category Mutations & Queries
    useGetCategoriesQuery,
    useGetCategoryByIdQuery,
    useGetCategoryBySlugQuery,
    useCreateCategoryMutation,
    useEditCategoryMutation,
    useDeleteCategoryMutation,
    
    // Subcategory Mutations & Queries
    useGetSubcategoriesQuery,
    useGetSubcategoryByIdQuery,
    useGetSubcategoryBySlugQuery,
    useCreateSubcategoryMutation,
    useEditSubcategoryMutation,
    useDeleteSubcategoryMutation,
    
    // Orders
    useCreateOrderMutation,
    useGetOrderByOrderNoQuery,
    useCheckoutMutation,
} = api;

export type AppApi = typeof api;