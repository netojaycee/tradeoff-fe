/**
 * API Client Configuration
 * Replaces RTK Query's baseQueryWithReauth with a function-based approach
 * Handles token refresh, interceptors, and error handling
 */

import { useAuthStore } from "@/lib/stores";
import { setAuthCookies, clearAuthCookies } from "@/lib/utils/cookies";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://api-tradeoff.onrender.com"
    : "http://192.168.1.135:3050";

export const API_BASE_URL = `${BASE_URL}/api/v1`;

export interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string;
  email?: string;
  data?: any;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  timestamp?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Make authenticated API requests
 */
export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const { accessToken } = useAuthStore.getState();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(typeof options.headers === "object" && options.headers
      ? Object.fromEntries(Object.entries(options.headers))
      : {}),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    const data: ApiResponse<T> = await response.json();

    // Handle 401 - token expired
    if (response.status === 401 && accessToken) {
      const refreshed = await refreshTokenRequest();

      if (refreshed) {
        // Retry the original request with new token
        return apiRequest<T>(url, options);
      } else {
        // Refresh failed, clear auth and redirect
        useAuthStore.getState().clearAuth();
        clearAuthCookies();

        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }

        throw new Error("Session expired. Please login again.");
      }
    }

    // Handle 500 or other server errors
    if (!response.ok) {
      throw new Error(data.message || `HTTP Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
}

/**
 * Refresh access token using refresh token
 */
async function refreshTokenRequest(): Promise<boolean> {
  const { refreshToken, setTokens } = useAuthStore.getState();

  if (!refreshToken) {
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (data.success && data.data) {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        data.data;

      // Update store
      setTokens(newAccessToken, newRefreshToken);

      // Update cookies
      setAuthCookies(newAccessToken, newRefreshToken);

      return true;
    }

    return false;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  }
}

/**
 * Helper to build query parameters
 */
export function buildQueryParams(params: Record<string, any>): URLSearchParams {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => query.append(key, String(v)));
      } else {
        query.append(key, String(value));
      }
    }
  });

  return query;
}
