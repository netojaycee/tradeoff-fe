// FakeStore API Response Types
export interface FakeStoreProduct {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

// Available categories from FakeStore API
export const FAKESTORE_CATEGORIES = [
  "electronics",
  "jewelery", 
  "mens-clothing",
  "womens-clothing"
] as const

export type FakeStoreCategory = typeof FAKESTORE_CATEGORIES[number]