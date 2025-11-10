"use client"

import React, { useEffect, useState, useCallback } from 'react'
import { ProductCard } from '@/components/local/ecom'
import { Product } from '@/lib/types'
import { FakeStoreService } from '@/lib/services/fakestore'

interface ProductsGridProps {
  products?: Product[]
  title?: string
  className?: string
  limit?: number
}

export default function ProductsGrid({ 
  products,
  title = "Featured Products",
  className,
  limit = 8
}: ProductsGridProps) {
  const [displayProducts, setDisplayProducts] = useState<Product[]>(products || [])
  const [loading, setLoading] = useState(!products)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedProducts = await FakeStoreService.getFeaturedProducts(limit)
      setDisplayProducts(fetchedProducts)
    } catch (err) {
      setError('Failed to load products')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    if (!products) {
      fetchProducts()
    }
  }, [products, fetchProducts])

  const handleToggleFavorite = (productId: string) => {
    // Update local state optimistically
    setDisplayProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, isFavorite: !product.isFavorite }
          : product
      )
    )
    console.log('Toggle favorite for product:', productId)
    // TODO: Implement API call to toggle favorite
  }

  const handleAddToCart = (productId: string) => {
    console.log('Add to cart product:', productId)
    // TODO: Implement API call to add to cart
  }

  if (loading) {
    return (
      <section className={className}>
        {title && (
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center">
              {title}
            </h2>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="bg-gray-200 animate-pulse rounded-lg aspect-square"></div>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className={className}>
        {title && (
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center">
              {title}
            </h2>
          </div>
        )}
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchProducts}
            className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-white px-6 py-2 rounded-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className={className}>
      {title && (
        <div className="mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center">
            {title}
          </h2>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </section>
  )
}