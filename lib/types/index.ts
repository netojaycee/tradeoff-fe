// TradeOff Authentication Types based on backend API
export enum UserRole {
    USER = 'user',
    ADMIN = 'admin'
}

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
    PENDING_VERIFICATION = 'pending_verification'
}

export enum VerificationStatus {
    PENDING = 'pending',
    VERIFIED = 'verified',
    REJECTED = 'rejected',
    EXPIRED = 'expired'
}

export enum SellerStatus {
    NOT_SELLER = 'not_seller',
    PENDING_VERIFICATION = 'pending_verification',
    VERIFIED_SELLER = 'verified_seller',
    SUSPENDED_SELLER = 'suspended_seller'
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: UserRole;
    status: UserStatus;
    emailVerificationStatus: VerificationStatus;
    emailVerified: boolean;
    sellerStatus: SellerStatus;
    avatar?: string;
    bio?: string;
    website?: string;
    socialMedia?: string[];
    nin?: string; // Nigerian ID
    bvn?: string; // Bank Verification Number
    createdAt: string;
    updatedAt: string;
}

// API Response Structure
export interface TradeOffApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    errors?: string[];
    statusCode?: number;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface AuthData {
    user: User;
    accessToken: string;
    refreshToken: string;
}

// Token Response (for refresh endpoint)
export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}


export interface Category {
    id: string
    name: string
    slug: string
}

export interface Product {
  id: string
  name: string
  category: Category
  condition: 'New' | 'Used' | 'Like New'
  price: number
  originalPrice?: number
  discount?: number
  images: string[]
  isVerified?: boolean
  isFavorite?: boolean
  description?: string
  slug: string
  seller?: {
    name: string
    rating: number
    verified: boolean
  }
}