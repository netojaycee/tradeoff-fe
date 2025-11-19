// app/orders/page.tsx or app/(dashboard)/orders/page.tsx
"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderCard from "@/components/local/ecom/OrderCard";

// Mock data — replace with real API later
const mockOrders = [
  {
    id: "1",
    orderNumber: "TROF-10425",
    productName: "LV Remix Boat Shoe Black - 45",
    productImage: "/images/lv-boat.jpg",
    date: "Tue, Oct 15, 2025",
    time: "10:24 AM",
    status: "in-transit" as const,
    total: 24000,
  },
  {
    id: "2",
    orderNumber: "TROF-10425",
    productName: "LV Remix Boat Shoe Black - 45",
    productImage: "/images/lv-boat.jpg",
    date: "Tue, Oct 15, 2025",
    time: "10:24 AM",
    status: "completed" as const,
    total: 24000,
  },
  {
    id: "3",
    orderNumber: "TROF-10425",
    productName: "LV Remix Boat Shoe Black - 45",
    productImage: "/images/lv-boat.jpg",
    date: "Tue, Oct 15, 2025",
    time: "10:24 AM",
    status: "cancelled" as const,
    total: 24000,
  },
];

export default function OrdersPage() {
  const [filter, setFilter] = useState("all");

  const filteredOrders = mockOrders.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  const hasOrders = filteredOrders.length > 0;

  return (
    <div className="px-4 py-8 md:px-16 lg:px-24">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Order History</h1>

          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All orders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-transit">In Transit</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        {hasOrders ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-100 rounded-full p-10 mb-6">
              <ShoppingBag className="w-20 h-20 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No orders yet
            </h2>
            <p className="text-gray-600 max-w-sm mb-8">
              When you place an order, it will appear here. Start shopping to make your first purchase!
            </p>
            <Button className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-white">
              Start Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}