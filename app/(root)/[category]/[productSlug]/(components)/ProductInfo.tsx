"use client";

import { Icon } from "@iconify/react";
import { CustomButton } from "@/components/local";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/lib/types";
import ConditionGuide from "@/components/local/ecom/ConditionGuide";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface ProductInfoProps {
  product: Product;
  onBuyNowClick: () => void;
  onAddToCartClick: () => void;
}

export function ProductInfo({
  product,
  onBuyNowClick,
  onAddToCartClick,
}: ProductInfoProps) {
  const name = product.title || "";
  const description = product.description || "";
  const price = product.sellingPrice || product.originalPrice || 0;
  const originalPrice = product.originalPrice || 0;
  const condition = product.condition || "";
  const stock = product.quantity || 1;
  const discount = originalPrice && price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const rating = product.averageRating || 0;
  const reviewCount = product.totalReviews || 0;
  return (
    <div className="space-y-4">
      {/* Title & Wishlist */}
      <div className="flex items-start justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold">{name}</h1>
        
      </div>

      {/* Description */}
      <p className="text-gray-600">{description}</p>

      {/* Condition & Stock */}
      <div className="flex items-center gap-3 text-sm border-t border-b py-1 border-[#E5E5E5]">
        <span className="font-medium text-[#404040] flex items-center gap-2">
          Condition: {condition}{" "}
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="cursor-help hover:opacity-70 transition-opacity"
                title="Learn about our condition guide"
              >
                <Icon icon="mdi:info" className="inline-block w-4 h-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="start">
              <div className="p-4">
                <ConditionGuide />
              </div>
            </PopoverContent>
          </Popover>
        </span>
        <span className="flex items-center gap-2 text-[#404040]">
          <div className="bg-[#DC2626] w-1.5 h-1.5 rounded-full" />
          Only {stock} available
        </span>
      </div>

      {/* Price & Discount */}
      <div className="border-[#E5E5E5] border-b border-t py-3 space-y-2">
        <div className="flex items-center gap-3">
          <div className="text-3xl text-[#333333] font-semibold">
            {formatPrice(price)}
          </div>
          {/* {originalPrice > price && (
            <>
              <div className="text-lg text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </div>
              <div className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-medium">
                -{discount}%
              </div>
            </>
          )} */}
        </div>
      </div>

      {/* Rating */}
      {reviewCount > 0 && (
        <div className="flex items-center gap-2 py-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                icon={i < Math.floor(rating) ? "mdi:star" : "mdi:star-outline"}
                className="w-4 h-4 text-yellow-400"
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">{rating.toFixed(1)} ({reviewCount} reviews)</span>
        </div>
      )}

      {/* Stock Warning */}
      {stock <= 3 && stock > 0 && (
        <p className="text-sm text-[#DC2626] font-medium">
          <Icon
            icon="mdi:fire"
            className="inline-block w-4 h-4"
          />{" "}
          Only {stock} left in stock - Order soon!
        </p>
      )}
      {stock === 0 && (
        <p className="text-sm text-gray-500">
          Currently out of stock
        </p>
      )}

      {/* Actions */}
      {stock > 0 ? (
        <div className="flex gap-3 flex-row-reverse md:flex-row">
          <CustomButton onClick={onBuyNowClick} className="flex-1">
            Buy Now
          </CustomButton>
          <CustomButton
            onClick={onAddToCartClick}
            icon="lucide:plus"
            iconPosition="left"
            className="flex-1 md:flex-none border-primary bg-transparent text-primary border hover:bg-primary hover:text-white"
          >
            Cart
          </CustomButton>
        </div>
      ) : (
        <CustomButton disabled className="w-full bg-gray-300 text-gray-600 cursor-not-allowed">
          Out of Stock
        </CustomButton>
      )}
    </div>
  );
}
