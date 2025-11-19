import { Icon } from "@iconify/react";
import { CustomButton } from "@/components/local";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/lib/types";

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
  const condition = product.condition || "";
  const stock = 1;
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
          <Icon icon="mdi:info" className="inline-block w-4 h-4" />
        </span>
        <span className="flex items-center gap-2 text-[#404040]">
          <div className="bg-[#DC2626] w-1.5 h-1.5 rounded-full" />
          Only {stock} available
        </span>
      </div>

      {/* Price */}
      <div className="text-3xl text-[#333333] font-semibold border-[#E5E5E5] border-b border-t py-1">
        {formatPrice(price)}
      </div>

      {/* Warning */}
      <p className="text-sm text-[#404040]">
        <Icon
          icon="mdi:fire"
          className="inline-block w-4 h-4 text-orange-500"
        />{" "}
        This item is popular! It&apos;s likely to sell soon{" "}
      </p>

      {/* Actions */}
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

    
    </div>
  );
}
