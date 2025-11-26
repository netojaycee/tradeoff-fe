"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/stores";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";
import { CustomButton } from "@/components/local";
import { Product } from "@/lib/types";

interface BuyNowModalProps {
  product: Product;
  onClose: () => void;
}

export default function BuyNowModal({ product, onClose }: BuyNowModalProps) {
  // Use Zustand store instead of Redux
  const { addToCart } = useCartStore();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const productId = product.id || product._id || "";
  const productTitle = product.title || "";
  const productPrice = product.sellingPrice || product.originalPrice || 0;
  const totalPrice = productPrice * quantity;

  const handleProceedToCheckout = async () => {
    setIsProcessing(true);

    // Add to cart with selected quantity
    addToCart({
      id: productId,
      name: productTitle,
      price: productPrice,
      image: product.images[0],
      quantity: quantity,
    });

    // Small delay to ensure cart is updated, then redirect
    setTimeout(() => {
      setIsProcessing(false);
      onClose();
      router.push("/checkout");
    }, 300);
  };

  return (
    <div className="overflow-hidden">
      {/* Header */}
      <div className="relative p-2">
        <h2 className="text-lg font-medium text-gray-600">Buy Now</h2>
      </div>

      {/* Product Image */}
      <div className="flex justify-center py-4 bg-gray-50">
        <div className="relative w-30 h-30 md:w-40 md:h-40">
          <Image
            src={product.images[0]}
            alt={productTitle}
            fill
            className="object-contain drop-shadow-xl"
            priority
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="p-2">
        {/* Title */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {productTitle}
          </h3>
          <p className="text-gray-600 text-sm  line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Price Info */}
        <div className="border-t border-b border-[#E5E5E5] space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Unit Price:</span>
            <span className="text-lg font-semibold text-gray-900">
              {formatPrice(productPrice)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Quantity:</span>
            <Select
              value={quantity.toString()}
              onValueChange={(val) => setQuantity(Number(val))}
            >
              <SelectTrigger className="w-20 h-5 border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-[#E5E5E5]">
            <span className="text-gray-900 font-semibold">Total:</span>
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>

        {/* Condition & Stock */}
        {/* <div className="text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium">Condition:</span> {product.condition}
          </p>
          <p>
            <span className="font-medium">Availability:</span> In Stock
          </p>
        </div> */}
      </div>

      {/* Action Buttons */}
      <div className="p-2 flex flex-row-reverse gap-3 items-center border-t border-[#E5E5E5]">
        <CustomButton
          onClick={handleProceedToCheckout}
          disabled={isProcessing}
          loading={isProcessing}
          className="flex-1"
        >
          Proceed to Checkout
        </CustomButton>

        <CustomButton
          onClick={onClose}
          disabled={isProcessing}
          variant="outline"
          className=""
        >
          Cancel
        </CustomButton>
      </div>
    </div>
  );
}
