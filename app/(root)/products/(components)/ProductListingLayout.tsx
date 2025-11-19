import React from "react";

export default function ProductListingLayout({
  filters,
  onFilterChange,
  children,
}: {
  filters: any;
  onFilterChange: (filters: any) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <div className="md:w-1/4 w-full">
        {/* Filters */}
        {filters}
      </div>
      <div className="md:w-3/4 w-full">
        {/* Product Grid */}
        {children}
      </div>
    </div>
  );
}
