import type { Metadata } from "next";

export const siteConfig = {
  name: "TradeOff",
  description:
    "Nigeria's premier luxury fashion marketplace. Buy and sell authenticated designer fashion, handbags, shoes, and accessories. Similar to Fashionphile and Vestiaire Collective but curated for Nigerian fashion lovers.",
  url: "https://tradeoff.ng",
  ogImage: "https://tradeoff.ng/og-image.png",
  keywords: [
    "luxury fashion Nigeria",
    "designer handbags Nigeria",
    "authenticated fashion",
    "luxury resale",
    "fashion marketplace",
    "designer shoes Nigeria",
    "authenticated sneakers",
    "luxury accessories",
    "pre-owned designer",
    "fashion collection",
  ],
};

export const defaultMetadata: Metadata = {
  title: {
    default: "TradeOff - Premium Luxury Fashion Marketplace in Nigeria",
    template: "%s | TradeOff",
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: "TradeOff",
      url: siteConfig.url,
    },
  ],
  creator: "TradeOff",
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteConfig.url,
    title: "TradeOff - Premium Luxury Fashion Marketplace in Nigeria",
    description: siteConfig.description,
    siteName: "TradeOff",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "TradeOff - Luxury Fashion Marketplace",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TradeOff - Premium Luxury Fashion Marketplace in Nigeria",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@TradeOffNG",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  alternates: {
    canonical: siteConfig.url,
  },
  verification: {
    google: "google-site-verification-code", // Add your Google verification code
    yandex: "yandex-verification-code", // Add your Yandex verification code
  },
};

// Page-specific metadata generators
export const generateProductPageMetadata = (
  productTitle: string,
  productDescription: string,
  productImage: string,
  productPrice: number
): Metadata => ({
  title: `${productTitle} - TradeOff Luxury Marketplace`,
  description: `${productDescription.substring(0, 155)}... Buy authenticated ${productTitle} on TradeOff, Nigeria's premium luxury fashion marketplace.`,
  keywords: [
    productTitle,
    "luxury fashion Nigeria",
    "authenticated designer",
    ...siteConfig.keywords,
  ],
  openGraph: {
    type: "website",
    title: `${productTitle} - TradeOff`,
    description: `${productDescription.substring(0, 155)}...`,
    images: [
      {
        url: productImage,
        width: 600,
        height: 600,
        alt: productTitle,
      },
    ],
  },
});

export const generateCategoryPageMetadata = (
  categoryName: string,
  categoryDescription: string
): Metadata => ({
  title: `${categoryName} - Shop Premium ${categoryName} on TradeOff`,
  description: `Discover authentic ${categoryName} on TradeOff. ${categoryDescription} Find the best luxury ${categoryName} in Nigeria.`,
  keywords: [
    categoryName,
    `${categoryName} Nigeria`,
    `luxury ${categoryName}`,
    "authenticated designer",
    ...siteConfig.keywords,
  ],
  openGraph: {
    type: "website",
    title: `${categoryName} - TradeOff`,
    description: `Shop ${categoryName} on TradeOff, Nigeria's premium luxury marketplace.`,
  },
});

export const generateSearchPageMetadata = (query: string): Metadata => ({
  title: `Search Results for "${query}" - TradeOff`,
  description: `Find luxury fashion items matching "${query}" on TradeOff. Browse authenticated designer products in Nigeria.`,
  robots: {
    index: false, // Don't index search result pages
    follow: true,
  },
});

export const generateSellerPageMetadata = (sellerName: string): Metadata => ({
  title: `Shop from ${sellerName} - TradeOff Verified Seller`,
  description: `Browse verified luxury items from ${sellerName} on TradeOff. Authenticated designer fashion in Nigeria.`,
  keywords: [
    sellerName,
    "verified seller",
    "luxury fashion",
    ...siteConfig.keywords,
  ],
});
