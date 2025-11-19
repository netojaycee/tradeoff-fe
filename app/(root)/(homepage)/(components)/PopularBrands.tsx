"use client";

import Image from "next/image";
import React from "react";

const brands = [
  { id: "lv", name: "Louis Vuitton", image: "/popularBrands.png" },
  { id: "hermes", name: "Hermes", image: "/popularBrands.png" },
  { id: "gucci", name: "Gucci", image: "/popularBrands.png" },
  { id: "more", name: "View all", image: "/popularBrands.png" },
];

export default function PopularBrands() {
  return (
    <section className="max-w-7xl mx-auto py-12 px-4 lg:px-16">
      <h2 className="text-3xl font-semibold text-gray-900 mb-8">
        Popular Brands
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {brands.map((brand, idx) => (
          <div
            key={brand.id}
            className={`relative rounded-md overflow-hidden border border-[#E5E5E5] bg-white ${
              brand.id === "more" ? "flex items-center justify-center" : ""
            }`}
          >
            {brand.id !== "more" ? (
              <>
                <div className="relative w-full h-64 md:h-72">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-contain"
                    // sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    sizes="(max-width: 640px) 50vw, 25vw"
                    priority={idx < 2}
                  />
                </div>

                <div className="absolute left-0 right-0 bottom-10 bg-[#38BDF8] text-white py-1 text-center font-medium">
                  {brand.name}
                </div>
              </>
            ) : (
              // View all card
              <div className="w-full h-64 sm:h-72 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center mb-4">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12H19"
                      stroke="#111827"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 5L19 12L12 19"
                      stroke="#111827"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="text-sm text-gray-700 underline">View all</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
