/**
 * SEO Utilities for TradeOff
 * Helper functions for generating meta tags, structured data, and SEO-related content
 */

export const generateProductSchema = (
  product: any
) => ({
  "@context": "https://schema.org/",
  "@type": "Product",
  name: product.title,
  image: product.images,
  description: product.description,
  price: product.sellingPrice,
  priceCurrency: "NGN",
  availability: "https://schema.org/InStock",
  seller: {
    "@type": "Organization",
    name: product.seller?.name || "TradeOff Seller",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: product.rating || 4.5,
    reviewCount: product.reviewCount || 0,
  },
});

export const generateBreadcrumbSchema = (
  breadcrumbs: Array<{ name: string; url: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const generateCollectionSchema = (
  name: string,
  description: string,
  image: string,
  items: number
) => ({
  "@context": "https://schema.org",
  "@type": "Collection",
  name,
  description,
  image,
  numberOfItems: items,
});

export const generateLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "TradeOff",
  image: "https://tradeoff.ng/logo.png",
  description:
    "Nigeria's premier luxury fashion marketplace for authenticated designer fashion",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Lagos, Nigeria",
    addressLocality: "Lagos",
    addressCountry: "NG",
  },
  telephone: "+234-XXX-XXXX-XXX",
  url: "https://tradeoff.ng",
  sameAs: [
    "https://twitter.com/TradeOffNG",
    "https://instagram.com/TradeOffNG",
    "https://facebook.com/TradeOffNG",
  ],
});

export const generateFAQSchema = (
  faqs: Array<{ question: string; answer: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

/**
 * Social Meta Tags
 */
export const generateOGMetaTags = (
  title: string,
  description: string,
  image: string,
  url: string,
  type: "website" | "article" | "product" = "website"
) => ({
  "og:title": title,
  "og:description": description,
  "og:image": image,
  "og:url": url,
  "og:type": type,
  "og:site_name": "TradeOff",
  "og:locale": "en_NG",
});

export const generateTwitterMetaTags = (
  title: string,
  description: string,
  image: string
) => ({
  "twitter:card": "summary_large_image",
  "twitter:title": title,
  "twitter:description": description,
  "twitter:image": image,
  "twitter:creator": "@TradeOffNG",
});

/**
 * SEO Best Practices
 */
export const truncateDescription = (text: string, maxLength: number = 160) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

export const generateCanonicalUrl = (path: string) =>
  `https://tradeoff.ng${path}`;

export const generateMetaKeywords = (keywords: string[]) =>
  keywords.slice(0, 10).join(", ");

export const sanitizeUrl = (url: string) => {
  try {
    return new URL(url).toString();
  } catch {
    return url;
  }
};
