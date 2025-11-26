"use client";

import React, { useEffect, useState, useMemo } from "react";
import ProductFilters, { Filters } from "./ProductFilters";
import ProductPagination from "./ProductPagination";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/local/ecom";
import { Icon } from "@iconify/react";
import { useGetProductsQuery, useGetCategoriesQuery } from "@/lib/api";

type ProductListingProps = {
  enablePagination?: boolean;
  itemsPerPage?: number;
};

export default function ProductListing({
  enablePagination = false,
  itemsPerPage = 12,
}: ProductListingProps): React.ReactNode {
  const [filters, setFilters] = useState<Filters>({});
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch categories for filter
  const { data: categoriesData } = useGetCategoriesQuery();
  
  // Map filters to API parameters
  const categorySlug = filters.categories?.[0] || "";
  const priceMin = filters.priceMin;
  const priceMax = filters.priceMax;
  const condition = filters.conditions?.[0] || "";
  
  // Fetch products with RTK Query
  const { data: productsData, isLoading, error } = useGetProductsQuery({
    page: currentPage,
    limit: itemsPerPage,
    category: categorySlug,
    search: searchQuery,
    condition: condition || undefined,
    minPrice: priceMin,
    maxPrice: priceMax,
    sortBy: sortBy,
    status: "active",
  });

  const products = productsData?.data || [];
  const totalItems = productsData?.meta?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to page 1 when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      {/* Filters Sidebar */}
      <div className="md:w-1/4 w-full">
        <ProductFilters filters={filters} onChange={handleFilterChange} />
      </div>

      {/* Products Grid */}
      <div className="md:w-3/4 w-full">
        {/* Sort Bar */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b">
          <p className="text-sm text-gray-600">
            Showing {isLoading ? "0" : (currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} products
          </p>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded border border-gray-300 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest</option>
            <option value="popular">Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Icon
                icon="mdi:loading"
                className="text-4xl text-blue-600 animate-spin mx-auto mb-2"
              />
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : error || totalItems === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Icon icon="mdi:magnify-close" className="text-4xl text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No products found matching your filters.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {products.map((product) => (
                <ProductCard 
                  key={product.id || product._id} 
                  product={product}
                  isLoading={false}
                />
              ))}
            </div>

            {/* Pagination */}
            {enablePagination && totalPages > 1 && (
              <ProductPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
