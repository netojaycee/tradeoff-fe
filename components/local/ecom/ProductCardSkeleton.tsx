"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {/* Image Skeleton */}
      <div className="relative aspect-square bg-gray-100">
        <Skeleton className="w-full h-full rounded-none" />
      </div>

      {/* Product Details Skeleton */}
      <div className="p-2 space-y-3">
        {/* Title Skeleton */}
        <div className="space-y-2">
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-3/4 h-4 rounded" />
        </div>

        {/* Category Skeleton */}
        <Skeleton className="w-1/2 h-3 rounded" />

        {/* Condition Skeleton */}
        <Skeleton className="w-2/3 h-3 rounded" />

        {/* Price Section Skeleton */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="w-1/3 h-5 rounded" />
          <Skeleton className="w-12 h-8 rounded" />
        </div>
      </div>
    </div>
  );
}
