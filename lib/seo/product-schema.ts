/**
 * Product schema.org JSON-LD generator
 * Generates rich product snippets for Google search results
 */

interface ProductSchemaData {
  id: string;
  name: string;
  description?: string;
  image?: string[];
  price: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder' | 'Discontinued';
  rating?: number;
  reviewCount?: number;
  brand?: string;
  category?: string;
  url: string;
}

/**
 * Generate Product schema JSON-LD
 */
export function generateProductSchema(product: ProductSchemaData) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.name,
    image: product.image || [],
    brand: {
      '@type': 'Brand',
      name: product.brand || 'TradeOff',
    },
    offers: {
      '@type': 'Offer',
      url: `https://tradeoff.ng${product.url}`,
      priceCurrency: product.currency || 'NGN',
      price: product.price.toString(),
      availability: `https://schema.org/${product.availability || 'InStock'}`,
    },
    ...(product.rating && product.reviewCount && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.toFixed(1),
        reviewCount: product.reviewCount,
      },
    }),
  };
}

/**
 * Product Collection (for category pages)
 */
export function generateProductCollectionSchema(
  categoryName: string,
  categoryUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: categoryName,
    url: `https://tradeoff.ng${categoryUrl}`,
    mainEntity: {
      '@type': 'Product',
      category: categoryName,
    },
  };
}

/**
 * Organization + LocalBusiness schema
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TradeOff',
    url: 'https://tradeoff.ng',
    logo: 'https://tradeoff.ng/logo.png',
    description:
      "Nigeria's premier luxury fashion marketplace for authenticated designer fashion",
    sameAs: [
      'https://twitter.com/TradeOffNG',
      'https://instagram.com/TradeOffNG',
      'https://facebook.com/TradeOffNG',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+234-XXX-XXXX-XXX',
      contactType: 'Customer Service',
      areaServed: 'NG',
      availableLanguage: 'en',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NG',
      addressLocality: 'Lagos',
    },
  };
}

/**
 * FAQPage schema (for help/FAQ pages)
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * SearchAction schema (for sitelinks search box)
 */
export function generateSearchActionSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: 'https://tradeoff.ng',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://tradeoff.ng/products?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
