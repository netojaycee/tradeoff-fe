// app/orders/[id]/page.tsx
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Clock } from "lucide-react";
import { useParams } from "next/navigation";

// Mock data — replace with real API later
const order = {
  id: "TROF-10425",
  status: "in-transit",
  orderDate: "Tue, Oct 15, 2025",
  eta: "Fri, Oct 17, 2025",
  items: [
    {
      id: "1",
      name: "LV Remix Boat Shoe Black - 45",
      price: 24000,
      quantity: 1,
      image: "/images/lv-boat.jpg",
    },
    {
      id: "2",
      name: "LV Remix Boat Shoe Black - 45",
      price: 24000,
      quantity: 1,
      image: "/images/lv-boat.jpg",
    },
    {
      id: "3",
      name: "LV Remix Boat Shoe Black - 45",
      price: 24000,
      quantity: 1,
      image: "/images/lv-boat.jpg",
    },
  ],
  subtotal: 72000,
  deliveryFee: 2500,
  tax: 1000,
  total: 75500,
  timeline: [
    { status: "Order Placed", date: "Tue, Oct 15, 2025", time: "10:24 AM", done: true },
    { status: "Order Confirmed", date: "Tue, Oct 15, 2025", time: "10:31 AM", done: true },
    { status: "Seller Preparing Item", date: "Tue, Oct 15, 2025", time: "12:18 PM", done: true },
    { status: "Processing", date: "Wed, Oct 16, 2025", time: "09:15 AM", done: false },
  ],
};

const statusConfig = {
  "in-transit": { label: "In transit", variant: "default" as const, bg: "bg-yellow-100 text-yellow-800" },
  completed: { label: "Completed", variant: "default" as const, bg: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", variant: "destructive" as const, bg: "bg-red-100 text-red-800" },
};

export default function OrderDetailsPage() {
    const params = useParams();
    const { id } = params;
  const status = statusConfig[order.status as keyof typeof statusConfig];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">Order TROF-{order.id}</h1>
                <Badge className={`${status.bg} font-medium`}>
                  {status.label} {id}
                </Badge>
              </div>
              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <p>Order date: {order.orderDate}</p>
                <p>ETA: {order.eta}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl">
              Print
            </Button>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
            <span className="text-sm text-gray-600">{order.items.length} items</span>
          </div>

          <div className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <div key={item.id} className="p-6 flex gap-5">
                <div className="w-24 h-24 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-contain p-3"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    ₦{item.price.toLocaleString("en-NG")}.00
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Qty:</p>
                  <p className="font-medium text-gray-900">{item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-50 p-6 space-y-3 border-t border-gray-200">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>₦{order.subtotal.toLocaleString("en-NG")}.00</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Delivery fee</span>
              <span>₦{order.deliveryFee.toLocaleString("en-NG")}.00</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax</span>
              <span>₦{order.tax.toLocaleString("en-NG")}.00</span>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>₦{order.total.toLocaleString("en-NG")}.00</span>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex gap-8 border-b border-gray-200 mb-6">
            <h3 className="pb-3 font-semibold text-gray-900 border-b-2 border-gray-900">Order history</h3>
            <button className="pb-3 text-gray-600 hover:text-gray-900 transition">
              Receiver details
            </button>
          </div>

          <div className="space-y-5">
            {order.timeline.map((event, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className={`mt-1 ${event.done ? "text-green-600" : "text-yellow-600"}`}>
                  {event.done ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${event.done ? "text-gray-900" : "text-gray-500"}`}>
                    {event.status}
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {event.date} · {event.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}