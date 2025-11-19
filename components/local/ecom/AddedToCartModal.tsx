// components/ui/AddedToCartModal.tsx
"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { CustomButton } from "../shared";

interface AddedToCartModalProps {
  product: {
    name: string;
    description?: string;
    price: number;
    images: string[]; // main product image
  };
  onCheckout: () => void;
  onContinue: () => void;
  onClose: () => void;
}

export default function AddedToCartModal({
  product,
  onCheckout,
  onContinue,
  onClose,
}: AddedToCartModalProps) {
  return (
    <div className="overflow-hidden">
      {/* Header */}
      <div className="relative p-2">
        <h2 className="text-lg font-medium text-gray-600">
          Added to Your Cart
        </h2>
      </div>

      {/* Product Image */}
     <div className="flex justify-center py-8 bg-gray-50">
        <div className="relative w-40 h-40 md:w-40 md:h-40">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain drop-shadow-xl"
            priority
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="p-2 pt-2  text-center">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {product.description}
        </p>
        <p className="text-xl font-bold text-gray-900">
          {formatPrice(product.price)}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="p-2 pt-0">
        <CustomButton onClick={onCheckout} className="w-full ">
          Checkout
        </CustomButton>

        <CustomButton
          onClick={onContinue}
          variant="link"
          className="w-full"
        >
          Continue shopping
        </CustomButton>
      </div>
    </div>
  );
}
