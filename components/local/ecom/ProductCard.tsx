"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addToCart, updateQuantity } from "@/redux/slices/cartSlice";
import { toggleFavorite } from "@/redux/slices/favoritesSlice";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { cn, formatPrice } from "@/lib/utils";
import { CustomButton } from "@/components/local/custom/CustomButton";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import { Product } from "@/lib/types";
import Link from "next/link";
import AddedToCartModal from "./AddedToCartModal";
import { CustomModal } from "../custom/CustomModal";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface ProductCardProps {
  product?: Product;
  className?: string;
  isLoading?: boolean;
}

export default function ProductCard({ product, className, isLoading = false }: ProductCardProps) {
  if (isLoading || !product) {
    return <ProductCardSkeleton />;
  }
  const dispatch = useDispatch();
  const [openedAddedToCart, setOpenedAddedToCart] = useState(false);
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const router = useRouter();

  // Handle both id and _id from backend
  const productId = product.id || product._id || "";
  const productTitle = product.title || "";
  const productPrice = product.sellingPrice || product.originalPrice || 0;
  const originalPrice = product.originalPrice;
  const discount = originalPrice && productPrice ? Math.round(((originalPrice - productPrice) / originalPrice) * 100) : 0;

  const isFavorite = favorites.includes(productId);

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(productId));
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    // Check if already in cart
    const existing = cartItems.find((item) => item.id === productId);
    if (!existing) {
      dispatch(
        addToCart({
          id: productId,
          name: productTitle,
          price: productPrice,
          image: product.images[0],
          quantity: 1,
        })
      );
    } else {
      // Optionally, increase quantity or show feedback
      dispatch(updateQuantity({ id: productId, quantity: existing.quantity + 1 }));
    }
    // UI feedback
    setTimeout(() => setIsAddingToCart(false), 500);
    setOpenedAddedToCart(true);
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
        {discount > 0 && (
          <div className="absolute top-3 left-0 z-20">
            <div
              className="inline-block bg-red-500 text-white py-0.5 pr-5 pl-3 text-sm font-medium"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 80% 50%, 80% 50%, 100% 100%, 0 100%)",
              }}
            >
              -{discount}%
            </div>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
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
                      alt={`${productTitle} - Image ${index + 1}`}
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
        {product.isVerifiedSeller && (
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
          <Link
            href={`/${product.category.slug}/${product.slug}`}
            className="hover:underline"
          >
            {productTitle}
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
              {formatPrice(productPrice)}
            </span>
            {/* {originalPrice && originalPrice > productPrice && (
            <span className="text-gray-500 line-through text-sm ml-2">
              {formatPrice(originalPrice)}
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

      <CustomModal open={openedAddedToCart} onOpenChange={setOpenedAddedToCart}>
        <AddedToCartModal
          product={{
            ...product,
            name: productTitle,
            price: productPrice,
          }}
          onCheckout={() => {
            setOpenedAddedToCart(false);
            router.push("/checkout");
          }}
          onContinue={() => setOpenedAddedToCart(false)}
          onClose={() => setOpenedAddedToCart(false)}
        />
      </CustomModal>
    </div>
  );
}
