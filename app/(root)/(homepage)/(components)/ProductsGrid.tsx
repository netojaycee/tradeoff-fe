"use client";

import React from "react";
import { ProductCard } from "@/components/local/ecom";
import { Product } from "@/lib/types";
import { Icon } from "@iconify/react";
import { useGetProductsQuery } from "@/redux/api";

interface ProductsGridProps {
  title?: string;
  className?: string;
  limit?: number;
  category?: string;
  productSlug?: string;
}

export default function ProductsGrid({
  title = "Featured Products",
  className,
  limit = 8,
  category = "",
  productSlug = "",
}: ProductsGridProps) {
  // Fetch products using RTK Query
  const {
    data: productsData,
    isLoading,
    error,
  } = useGetProductsQuery({
    page: 1,
    limit: limit,
    category: category,
  });

  // Extract products from response - handle both array and object responses
  const productList = Array.isArray(productsData?.data)
    ? productsData?.data
    : [];

  // Filter out current product if productSlug is provided
  const filteredProductList = productSlug
    ? productList.filter((product: Product) => product.slug !== productSlug)
    : productList;

  const hasError = !!error;

  // Create skeleton array while loading (8 items)
  const displayItems = isLoading
    ? Array.from({ length: limit }).map(() => null)
    : filteredProductList;

  // Show error state
  if (hasError && !isLoading) {
    return (
      <section className={className}>
        {title && (
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 text-left">
              {title}
            </h2>
          </div>
        )}
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-center max-w-md">
            <div className="mb-4 flex justify-center">
              <div className="p-4 rounded-full bg-red-50">
                <Icon
                  icon="material-symbols:error-outline"
                  className="w-12 h-12 text-red-500"
                />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t load the products at the moment. Please try again
              later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              <Icon icon="material-symbols:refresh" className="w-5 h-5" />
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state (only if not loading, no error, and no products)
  if (
    !isLoading &&
    !hasError &&
    (!filteredProductList || filteredProductList.length === 0)
  ) {
    return (
      <section className={className}>
        {title && (
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 text-left">
              {title}
            </h2>
          </div>
        )}
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-center max-w-md">
            <div className="mb-4 flex justify-center">
              <div className="p-4 rounded-full bg-gray-100">
                <Icon
                  icon="material-symbols:shopping-cart-outline"
                  className="w-12 h-12 text-gray-400"
                />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Products Available
            </h3>
            <p className="text-gray-600">
              We don't have any products to display right now. Please check back
              soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Show products with loading skeletons mixed in
  return (
    <section className={className}>
      {title && (
        <div className="mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 text-left">
            {title}
          </h2>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {displayItems.map((product: Product | null, index: number) => (
          <ProductCard
            key={isLoading ? `skeleton-${index}` : product?.id || product?._id}
            product={product || undefined}
            isLoading={product === null}
          />
        ))}
      </div>
    </section>
  );
}
