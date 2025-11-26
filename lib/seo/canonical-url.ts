/**
 * Canonical URL utilities for SEO
 * Prevents duplicate content issues
 */

const SITE_URL = 'https://tradeoff.ng';

/**
 * Get canonical URL for a page
 */
export function getCanonicalUrl(path: string, params?: Record<string, string>): string {
  const baseUrl = new URL(path, SITE_URL).toString();
  
  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }

  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

/**
 * Generate canonical meta tag
 */
export function generateCanonicalTag(path: string): string {
  return `<link rel="canonical" href="${getCanonicalUrl(path)}" />`;
}

/**
 * Get canonical URL for product pages
 */
export function getProductCanonicalUrl(
  categorySlug: string,
  productSlug: string
): string {
  return getCanonicalUrl(`/${categorySlug}/${productSlug}`);
}

/**
 * Get canonical URL for category pages
 */
export function getCategoryCanonicalUrl(categorySlug: string): string {
  return getCanonicalUrl(`/${categorySlug}`);
}

/**
 * Get canonical URL for search results
 */
export function getSearchCanonicalUrl(query: string, page?: number): string {
  return getCanonicalUrl('/products', {
    q: query,
    ...(page && page > 1 && { page: page.toString() }),
  });
}

/**
 * Remove tracking parameters from URL for canonicalization
 */
export function removeTrackingParams(url: string): string {
  const urlObj = new URL(url, SITE_URL);
  const paramsToRemove = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'gclid',
    'fbclid',
    'msclkid',
  ];

  paramsToRemove.forEach((param) => {
    urlObj.searchParams.delete(param);
  });

  return urlObj.toString();
}

/**
 * Normalize URL (remove trailing slashes, lowercase)
 */
export function normalizeUrl(url: string): string {
  const urlObj = new URL(url, SITE_URL);
  let pathname = urlObj.pathname.toLowerCase();

  // Remove trailing slash except for root
  if (pathname !== '/' && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  urlObj.pathname = pathname;
  return urlObj.toString();
}
