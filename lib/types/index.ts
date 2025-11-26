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
    _id?: string
    id?: string
    name: string
    slug: string
    description?: string
}

export interface Subcategory {
    _id?: string
    id?: string
    name: string
    slug: string
    description?: string
}

export interface Seller {
    id: string
    name: string
    rating?: number
    verified: boolean
}

export interface Shipping {
    domestic?: number
    international?: number
    free?: boolean
}

export interface Product {
    id?: string
    _id?: string
    title: string
    description: string
    brand?: string
    category: Category
    subCategory?: Subcategory | null
    gender?: string
    sellerId: string
    sellerName?: string
    isVerifiedSeller?: boolean
    isVerified?: boolean
    originalPrice: number
    sellingPrice: number
    retailPrice?: number | null
    currency?: string
    negotiable?: boolean
    condition: string
    size?: string | null
    sizeType?: string | null
    materials?: string[]
    color?: string
    images: string[]
    authenticationStatus?: string
    slug: string
    status?: string
    featured?: boolean
    promoted?: boolean
    quantity: number
    sold?: boolean
    shipping?: Shipping
    shippingMethods?: string[]
    views?: number
    likes?: number
    saves?: number
    shares?: number
    inquiries?: number
    averageRating?: number
    totalReviews?: number
    keywords?: string[]
    seoTitle?: string
    seoDescription?: string
    location?: {
        city: string
        state: string
        country: string
    }
    isFavorite?: boolean
    createdAt: string
    updatedAt: string
}