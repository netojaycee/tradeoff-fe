// components/product/ProductInfo.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart } from "lucide-react";

export function ProductInfo({
  name,
  description,
  price,
  condition,
  stock,
}: {
  name: string;
  description: string;
  price: number;
  condition: string;
  stock: number;
}) {
  return (
    <div className="space-y-4">
      {/* Title & Wishlist */}
      <div className="flex items-start justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold">{name}</h1>
        <button className="p-2 hover:bg-gray-100 rounded-full transition">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Description */}
      <p className="text-gray-600">{description}</p>

      {/* Condition & Stock */}
      <div className="flex items-center gap-3 text-sm">
        <span className="font-medium">Condition: {condition}</span>
        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
          Fire Only {stock} available
        </Badge>
      </div>

      {/* Price */}
      <div className="text-3xl font-bold">₦{price.toLocaleString("en-NG")}</div>

      {/* Warning */}
      <p className="text-sm text-orange-600">
        Fire This item is popular! It’s likely to sell soon
      </p>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="flex-1 bg-[#38BDF8] hover:bg-[#0EA5E9]">
          Buy Now
        </Button>
        <Button variant="outline" size="icon">
          <ShoppingCart className="w-5 h-5" />
        </Button>
      </div>

      {/* Verified Badge */}
      <div className="flex items-center gap-2 text-sm text-green-600">
        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
            <path d="M3 6L5 8L9 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
        Verified
      </div>
    </div>
  );
}