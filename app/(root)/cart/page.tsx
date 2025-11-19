// components/cart/CartPage.tsx
"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { removeFromCart, updateQuantity } from "@/redux/slices/cartSlice";
import { Lock, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CartItemCard from "@/components/local/ecom/CartItemCard";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { formatPrice } from "@/lib/utils";
import { CustomButton, CustomInput } from "@/components/local";

export default function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  if (cartItems.length === 0) {
    return (
      <div className=" px-4 py-8 md:px-16">
     
        <div className="max-w-md mx-auto flex flex-col items-center justify-center h-full  px-6 text-center">
          <div className="bg-gray-100 rounded-full p-8 mb-8">
            <ShoppingBag className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 max-w-sm">
            Looks like you haven&apos;t added anything to your cart yet. Start
            shopping and find something you love!
          </p>
          <Button className="mt-8 bg-[#38BDF8] hover:bg-[#0EA5E9] text-white">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className=" px-4 py-8 md:px-16">
     
      <div className="mx-auto max-w-md flex flex-col h-full border border-[#E5E5E5] rounded">
        {/* Header */}

        <div className="border-b border-[#E5E5E5]">
          <div className="flex items-center font-medium text-gray-600 justify-between px-2 py-0.5">
            <h2 className="">Your Cart</h2>
            <span className=" ">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4 ">
          {cartItems.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onRemove={handleRemove}
              onUpdateQuantity={handleUpdateQuantity}
            />
          ))}
        </div>

        {/* Subtotal */}
        <div className=" px-2 pt-0.5 pb-2">
          <div className="flex items-center justify-between border rounded px-2">
            <span className="text font-medium text-gray-700">Subtotal</span>
            {/* <div className="flex items-center gap-4"> */}
              <div className="">======</div>
              <span className="text-xl font-semibold text-gray-900">
                {formatPrice(subtotal)}
              </span>
            {/* </div> */}
          </div>
        </div>

        {/* Promo Code */}
        <div className="px-2 py-4 border-t border-[#E5E5E5]">
          <div className="grid grid-cols-[1fr_auto] gap-2 w-full">
            <CustomInput
              placeholder="Enter promo code here..."
              className="w-full"
            />
            <CustomButton variant="outline">
              Apply
            </CustomButton>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="px-2 pb-4">
          <CustomButton
            onClick={() => (window.location.href = "/checkout")}
            className="w-full"
          >
            Proceed to Checkout
          </CustomButton>
        </div>

        {/* Verified Badge */}
        <div className="px-6 pb-6">
          <div className="bg-emerald-50 text-emerald-700 rounded p-2 flex items-center gap-2 text-xs font-normal">
            <Lock className="w-5 h-5" />
            All items on TradeOff. are verified for authenticity before
            shipping.
          </div>
        </div>
      </div>
    </div>
  );
}
