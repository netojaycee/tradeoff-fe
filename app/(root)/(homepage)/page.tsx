import Hero from "./(components)/Hero";
import ProductsGrid from "./(components)/ProductsGrid";
import SellHero from "./(components)/SellHero";
import PopularBrands from "./(components)/PopularBrands";
import { Metadata } from "next";
import { API_BASE_URL } from "@/lib/api";

export const metadata: Metadata = {
  title: "Home - TradeOff | Premium Luxury Fashion Marketplace Nigeria",
  description:
    "Discover authenticated luxury fashion in Nigeria. Buy and sell designer handbags, shoes, and accessories on TradeOff - your trusted luxury fashion marketplace.",
  keywords: [
    "luxury fashion Nigeria",
    "designer handbags",
    "authenticated fashion",
    "luxury resale",
    "fashion marketplace Nigeria",
  ],
  openGraph: {
    title: "TradeOff - Premium Luxury Fashion Marketplace in Nigeria",
    description:
      "Buy and sell authenticated designer fashion on TradeOff. Nigeria's premier luxury marketplace.",
    type: "website",
    locale: "en_NG",
    url: "https://tradeoff.ng",
  },
  twitter: {
    card: "summary_large_image",
    title: "TradeOff - Luxury Fashion Marketplace",
    description: "Discover authenticated luxury fashion in Nigeria",
  },
};

async function getHomepageProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products?page=1&limit=8`, {
      next: { revalidate: 3600 }, // ISR: 1 hour
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching homepage products:", error);
    return { data: [] };
  }
}

export default async function Home() {
  const productsData = await getHomepageProducts();
  const products = Array.isArray(productsData?.data) ? productsData.data : [];

  return (
    <div>
      <Hero />
      <div className="py-8 md:py-16 px-4 lg:px-16 xl:px-20 2xl:px-24">
        <ProductsGrid 
          initialProducts={products}
          limit={8}
          title="Featured Products"
        />
      </div>
      <div className="mt-8">
        <SellHero />
      </div>
      <div className="mt-8">
        <PopularBrands />
      </div>
    </div>
  );
}
