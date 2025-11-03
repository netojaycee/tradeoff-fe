export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: "USER" | "ADMIN";
    is_verified: boolean;
    full_name?: string;
    profile_image?: string | null;
    verification_code?: string | null;
    // Add other user fields as necessary
}
export interface AuthResponse {
    // token: string;
    user: User;
}

export interface Product {
    id: string;
    category: string;
    name: string;
    description: string;
    rating?: number;
    sold?: number;
    price: number;
    image: string;
    addedToCart?: number; // Optional: for "X people added to cart" instead of "X+ sold"
    // type: "gift" | "food" | "item";
    type: string;
}

export interface Category {
    id: string;
    name: string;
}