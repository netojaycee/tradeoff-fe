import { Product, Category } from '@/lib/types'
import { FakeStoreProduct } from '@/lib/types/fakestore'

const FAKESTORE_BASE_URL = 'https://fakestoreapi.com'

// Helper function to generate random condition
const getRandomCondition = (): 'New' | 'Used' | 'Like New' => {
  const conditions: ('New' | 'Used' | 'Like New')[] = ['New', 'Used', 'Like New']
  return conditions[Math.floor(Math.random() * conditions.length)]
}

// Helper function to generate random discount
const getRandomDiscount = (): number | undefined => {
  const shouldHaveDiscount = Math.random() < 0.4 // 40% chance of discount
  if (shouldHaveDiscount) {
    return Math.floor(Math.random() * 50) + 10 // 10-60% discount
  }
  return undefined
}

// Helper function to generate seller info
const generateSellerInfo = () => {
  const sellerNames = [
    'StyleMaster', 'FashionHub', 'TrendyDeals', 'EliteStore', 'UrbanStyle',
    'ClassicWear', 'ModernLook', 'ChicBoutique', 'VogueVault', 'StyleCrate'
  ]
  const name = sellerNames[Math.floor(Math.random() * sellerNames.length)]
  const rating = Number((3.5 + Math.random() * 1.5).toFixed(1)) // 3.5-5.0 rating
  const verified = Math.random() < 0.7 // 70% chance of being verified
  
  return { name, rating, verified }
}

// Helper function to create multiple image variations
const generateImageVariations = (originalImage: string): string[] => {
  // For demo purposes, we'll duplicate the same image 3 times
  // In a real scenario, you might have different angles/views
  return [originalImage, originalImage, originalImage]
}

// Transform FakeStore product to our Product interface
export const transformFakeStoreProduct = (fakeProduct: FakeStoreProduct): Product => {
  const discount = getRandomDiscount()
  const originalPrice = discount ? Math.round(fakeProduct.price * (1 + discount / 100)) : undefined
  
  // Create category object
  const category: Category = {
    id: fakeProduct.category.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
    name: fakeProduct.category.charAt(0).toUpperCase() + fakeProduct.category.slice(1),
    slug: fakeProduct.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const randomSixDigit = Math.floor(Math.random() * 1_000_000).toString().padStart(6, '0')
  const slug = `${fakeProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${randomSixDigit}`

  return {
    id: fakeProduct.id.toString(),
    name: fakeProduct.title,
    category,
    condition: getRandomCondition(),
    price: Math.round(fakeProduct.price * 1000), // Convert to Naira (roughly)
    originalPrice: originalPrice ? Math.round(originalPrice * 1000) : undefined,
    discount,
    images: generateImageVariations(fakeProduct.image),
    isVerified: Math.random() < 0.6, // 60% chance of being verified
    isFavorite: false, // Default to false
    description: fakeProduct.description,
    seller: generateSellerInfo(),
    slug: slug,
  }
}

// API Service Class
export class FakeStoreService {
  private static baseUrl = FAKESTORE_BASE_URL

  // Fetch all products
  static async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/products`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const fakeProducts: FakeStoreProduct[] = await response.json()
      return fakeProducts.map(transformFakeStoreProduct)
    } catch (error) {
      console.error('Error fetching products:', error)
      throw new Error('Failed to fetch products')
    }
  }

  // Fetch products by category
  static async getProductsByCategory(categoryName: string): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/products/category/${categoryName}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const fakeProducts: FakeStoreProduct[] = await response.json()
      return fakeProducts.map(transformFakeStoreProduct)
    } catch (error) {
      console.error('Error fetching products by category:', error)
      throw new Error('Failed to fetch products by category')
    }
  }

  // Fetch single product
  static async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const fakeProduct: FakeStoreProduct = await response.json()
      return transformFakeStoreProduct(fakeProduct)
    } catch (error) {
      console.error('Error fetching product:', error)
      return null
    }
  }

  // Fetch all categories
  static async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${this.baseUrl}/products/categories`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const categoryNames: string[] = await response.json()
      return categoryNames.map(name => ({
        id: name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
        name: name.charAt(0).toUpperCase() + name.slice(1),
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }))
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw new Error('Failed to fetch categories')
    }
  }

  // Fetch limited products (for featured sections)
  static async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/products?limit=${limit}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const fakeProducts: FakeStoreProduct[] = await response.json()
      return fakeProducts.map(transformFakeStoreProduct)
    } catch (error) {
      console.error('Error fetching featured products:', error)
      throw new Error('Failed to fetch featured products')
    }
  }
}