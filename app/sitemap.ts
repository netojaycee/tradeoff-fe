import { MetadataRoute } from "next";

// Types for API responses
interface Category {
  id: string;
  slug: string;
  name: string;
  updatedAt?: string;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug?: string;
  updatedAt?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.1.135:3050";

async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/categories?limit=1000`,
      {
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    );
    if (!response.ok) throw new Error("Failed to fetch categories");
    const data = await response.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error("Failed to fetch categories for sitemap:", error);
    return [];
  }
}

async function getTopProducts(): Promise<Product[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products?limit=5000&sort=popular`,
      {
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    );
    if (!response.ok) throw new Error("Failed to fetch products");
    const data = await response.json();
    return Array.isArray(data.data) ? data.data.slice(0, 5000) : [];
  } catch (error) {
    console.error("Failed to fetch products for sitemap:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://tradeoff.ng";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sell`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/orders`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Fetch categories dynamically
  const categories = await getCategories();
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/${category.slug}`,
    lastModified: category.updatedAt ? new Date(category.updatedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Fetch top products dynamically (limit to ~5000 for sitemap size)
  const products = await getTopProducts();
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/${product.categorySlug || 'products'}/${product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Combine and return all pages
  return [...staticPages, ...categoryPages, ...productPages];
}
