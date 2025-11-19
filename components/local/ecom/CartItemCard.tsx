// components/cart/CartItemCard.tsx
"use client";


import Image from "next/image";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "@/redux/slices/cartSlice";
import { formatPrice } from "@/lib/utils";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartItemCardProps = {
  item: CartItem;
  onRemove?: (id: string) => void;
  onUpdateQuantity?: (id: string, quantity: number) => void;
};
export default function CartItemCard({
  item,
  onRemove,
  onUpdateQuantity,
}: CartItemCardProps) {
  const dispatch = useDispatch();

  const handleRemove = (id: string) => {
    if (onRemove) {
      onRemove(id);
    } else {
      dispatch(removeFromCart(id));
    }
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (onUpdateQuantity) {
      onUpdateQuantity(id, quantity);
    } else {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  return (
    <div className="border border-[#E5E5E5] rounded p-2 flex gap-5 relative transition">
      {/* Remove Button */}
      <button
        onClick={() => handleRemove(item.id)}
        className="absolute top-0 right-0 text-white  transition bg-red-500 rounded"
      >
        <Icon icon="mdi:close" className="w-6 h-6" />
      </button>

      {/* Product Image */}
      <div className="w-28 h-28 bg-gray-50 rounded overflow-hidden border border-[#E5E5E5] shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          width={112}
          height={112}
          className="w-full h-full object-contain p-3"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 line-clamp-2 leading-tight">
          {item.name}
        </h3>
        <p className="text-2xl font-bold text-gray-900 mt-2">
          {formatPrice(item.price)}
        </p>
      </div>

      {/* Quantity Selector */}
      <div className="absolute bottom-0 right-0">
      <Select
        value={item.quantity.toString()}
        onValueChange={(val) => handleUpdateQuantity(item.id, Number(val))}
      >
        <SelectTrigger className="w-20 h-11 border-gray-300">
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
    </div>
  );
}
