"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'
import { CustomButton } from '@/components/local/custom/CustomButton'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
  onToggleFavorite?: (productId: string) => void
  onAddToCart?: (productId: string) => void
  className?: string
}

export default function ProductCard({ 
  product, 
  onToggleFavorite, 
  onAddToCart,
  className 
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(product.isFavorite || false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
    onToggleFavorite?.(product.id)
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    onAddToCart?.(product.id)
    // Simulate API call delay
    setTimeout(() => setIsAddingToCart(false), 500)
  }

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`
  }

  return (
    <div className={cn("bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow duration-300", className)}>
      {/* Image Carousel Section */}
      <div className="relative aspect-square">
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 left-3 z-20">
            <div className="bg-red-500 text-white px-2 py-1 rounded-sm text-sm font-medium">
              -{product.discount}%
            </div>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}  
          className="absolute top-3 right-3 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
        >
          <Icon
            icon={isFavorite ? "ph:heart-fill" : "ph:heart"}
            className={cn(
              "w-5 h-5 transition-colors duration-200",
              isFavorite ? "text-[#38BDF8]" : "text-gray-600 hover:text-red-500"
            )}
          />
        </button>

        {/* Image Carousel */}
        <Carousel className="w-full h-full">
          <CarouselContent>
            {product.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-square">
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Carousel Navigation - Only show if more than 1 image */}
          {product.images.length > 1 && (
            <>
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </>
          )}
        </Carousel>

        {/* Carousel Indicators */}
        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1">
            {product.images.map((_, index) => (
              <div key={index} className="w-2 h-2 rounded-full bg-white/60" />
            ))}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-3">
        {/* Verified Badge */}
        {product.isVerified && (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded text-xs font-medium text-green-700">
            <span>Verified</span>
            <Icon icon="ph:check-circle-fill" className="w-3 h-3 text-green-600" />
          </div>
        )}

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2">
          {product.name}
        </h3>

        {/* Category */}
        <p className="text-gray-600 text-sm">
          {product.category.name}
        </p>

        {/* Condition */}
        <p className="text-gray-600 text-sm">
          Condition: {product.condition}
        </p>

        {/* Price Section */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-gray-500 line-through text-sm">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <div className="pt-2">
          <CustomButton
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            loading={isAddingToCart}
            className="w-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-white py-2.5 rounded-sm transition-colors duration-200"
            icon="lucide:plus"
            iconPosition="left"
            iconSize="1rem"
          >
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:hidden">Cart</span>
          </CustomButton>
        </div>
      </div>
    </div>
  )
}