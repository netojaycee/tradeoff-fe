"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { CustomButton } from "@/components/local/custom/CustomButton";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from "@/lib/types";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  onToggleFavorite?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
  className?: string;
}

export default function ProductCard({
  product,
  onToggleFavorite,
  onAddToCart,
  className,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(product.isFavorite || false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    onToggleFavorite?.(product.id);
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    onAddToCart?.(product.id);
    // Simulate API call delay
    setTimeout(() => setIsAddingToCart(false), 500);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(price)
      .replace("NGN", "₦"); // Replace NGN with ₦ symbol
  };

  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow duration-300",
        className
      )}
    >
      {/* Image Carousel Section */}
      <div className="relative aspect-square bg-[#F5F5F5]">
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 left-0 z-20">
            <div
              className="inline-block bg-red-500 text-white py-0.5 pr-5 pl-3 text-sm font-medium"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 80% 50%, 80% 50%, 100% 100%, 0 100%)",
              }}
            >
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
          <CarouselContent className="h-full">
            {product.images.map((image, index) => (
              <CarouselItem
                key={index}
                className="h-full flex items-center justify-center"
              >
                {/* ---------- IMAGE WRAPPER ---------- */}
                <div className="w-full max-w-md mx-auto">
                  {/* 92% of the slide height – change the % to make it taller/shorter */}
                  <div className="relative w-full h-0 pb-[88%] md:pb-[92%] overflow-hidden">
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* ---------- DOTS ---------- */}
          <div className="absolute bottom-2 -right-14  md:left-1/2 md:-translate-x-1/2 w-full">
            <CarouselDots />
          </div>
        </Carousel>

        

        {/* Verified Badge */}
        {product.isVerified && (
          <div className="absolute bottom-0 left-2 z-20">
            <div className="inline-flex items-center gap-1 px-1 border border-[#737373] rounded text-xs font-normal">
              <span>Verified</span>
              <Icon
                icon="streamline-ultimate:check-badge-bold"
                className="w-3 h-3 text-[#8BC34A]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-2 space-y-1 relative">
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 text-base md:text-lg leading-tight line-clamp-1">
          <Link href={`/${product.category.slug}/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>

        {/* Category */}
        <p className="text-[#737373] text-sm underline underline-offset-2">
          {product.category.name}
        </p>

        {/* Condition */}
        <p className="text-[#737373] text-sm">Condition: {product.condition}</p>

        {/* Price Section */}
        <div className="flex items-center gap-2 justify-between">
          <div>
            <span className="font-bold text-base md:text-xl text-[#555555]">
              {formatPrice(product.price)}
            </span>
            {/* {product.originalPrice && (
            <span className="text-gray-500 line-through text-sm">
              {formatPrice(product.originalPrice)}
            </span>
          )} */}
          </div>
          {/* Add to Cart Button */}
          <div className="absolute right-0 pt-2">
            <CustomButton
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              loading={isAddingToCart}
              variant="default"
              size="sm"
              icon="lucide:plus"
              iconPosition="left"
            >
              <span className="hidden sm:inline">Cart</span>
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
}
