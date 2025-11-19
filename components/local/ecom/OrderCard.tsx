// components/order/OrderCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

type Order = {
  id: string;
  orderNumber: string;
  productName: string;
  productImage: string;
  date: string;
  time: string;
  status: "pending" | "in-transit" | "completed" | "cancelled";
  total: number;
};

type OrderCardProps = {
  order: Order;
};

const statusConfig = {
  "in-transit": { label: "In transit", color: "bg-yellow-100 text-yellow-800" },
  completed: { label: "Completed", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
  pending: { label: "Pending", color: "bg-blue-100 text-blue-800" },
};

export default function OrderCard({ order }: OrderCardProps) {
  const status = statusConfig[order.status];

  return (
    <Link href={`/orders/${order.id}`} className="block">
      <div className="border border-[#E5E5E5] rounded-lg p-4 flex gap-4 hover:shadow-sm transition-shadow cursor-pointer">
        {/* Product Image */}
        <div className="w-20 h-20 bg-gray-50 rounded overflow-hidden border border-[#E5E5E5] shrink-0">
          <Image
            src={order.productImage}
            alt={order.productName}
            width={80}
            height={80}
            className="w-full h-full object-contain p-2"
          />
        </div>

        {/* Order Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-gray-900 line-clamp-2">
                {order.productName}
              </h3>
              <p className="text-sm text-gray-500 mt-1">#{order.orderNumber}</p>
            </div>

            {/* Status Badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
            >
              {status.label}
            </span>
          </div>

          <div className="mt-3 text-sm text-gray-600">
            {order.date} · {order.time}
          </div>
        </div>
      </div>
    </Link>
  );
}