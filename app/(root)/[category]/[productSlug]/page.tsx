import { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';
import { API_BASE_URL } from '@/lib/api/client';
import ProductsGrid from "../../(homepage)/(components)/ProductsGrid";
import { generateProductSchema, generateSearchActionSchema } from '@/lib/seo/product-schema';
import { logger } from '@/lib/utils/logger';
import ProductDetailsClient from './(components)/ProductDetailsClient';

// Disable prerendering - generate on demand
export const revalidate = false;
export const dynamicParams = true;

// Props types
interface ProductDetailsPageProps {
  params: Promise<{
    productSlug: string;
    category: string;
  }>;
}

// Generate static parameters for top products
export async function generateStaticParams() {
  // Return empty array to skip pre-rendering
  // Pages will be generated on-demand with dynamicParams = true
  return [];
}

// Generate metadata for each product page
export async function generateMetadata(
  { params }: ProductDetailsPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const { productSlug } = resolvedParams;

  try {
    const response = await fetch(
      `${API_BASE_URL}/products/slug/${productSlug}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      return { title: 'Product - TradeOff' };
    }

    const data = await response.json();
    const product = data?.data;

    if (!product) {
      return { title: 'Product Not Found - TradeOff' };
    }

    const title = `${product.title} - Buy on TradeOff`;
    const description = product.description?.substring(0, 155) || `Buy authentic ${product.title} on TradeOff, Nigeria's premium luxury fashion marketplace.`;
    const image = product.images?.[0] || '';

    return {
      title,
      description,
      keywords: [product.title, product.category?.name, 'luxury fashion Nigeria', 'authenticated designer'],
      openGraph: {
        title,
        description,
        type: 'website',
        images: [{ url: image, width: 600, height: 600, alt: product.title }],
        url: `https://tradeoff.ng/${resolvedParams.category}/${productSlug}`,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
      alternates: {
        canonical: `https://tradeoff.ng/${resolvedParams.category}/${productSlug}`,
      },
    };
  } catch (error) {
    logger.error('Error generating metadata:', error);
    return { title: 'Product - TradeOff' };
  }
}

// Server component that fetches data
async function ProductDetailsServer({ params }: ProductDetailsPageProps) {
  const resolvedParams = await params;
  const { productSlug, category } = resolvedParams;

  try {
    const response = await fetch(
      `${API_BASE_URL}/products/slug/${productSlug}`,
      { 
        next: { revalidate: 3600 }, // ISR - revalidate every hour
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        }
      }
    );

    if (!response.ok) {
      return (
        <div className="px-4 md:px-16 py-8">
          <div className="text-center">
            <p className="text-red-500 text-lg">Product not found</p>
          </div>
        </div>
      );
    }

    const data = await response.json();
    const product = data?.data || [];
    logger.log('Fetched product:', product);

    if (!product) {
      return (
        <div className="px-4 md:px-16 py-8">
          <div className="text-center">
            <p className="text-red-500 text-lg">Product not found</p>
          </div>
        </div>
      );
    }

    // Generate product schema for rich snippets
    const productSchema = generateProductSchema({
      id: product.id,
      name: product.title,
      description: product.description,
      image: product.images || [],
      price: product.price || 0,
      currency: 'NGN',
      availability: product.inStock ? 'InStock' : 'OutOfStock',
      rating: product.rating,
      reviewCount: product.reviewCount,
      brand: product.brand,
      category: product.category?.name,
      url: `/${category}/${productSlug}`,
    });

    const searchSchema = generateSearchActionSchema();

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(searchSchema) }}
        />
        <ProductDetailsClient initialProduct={product} />
      </>
    );
  } catch (error) {
    logger.error('Error fetching product:', error);
    return (
      <div className="px-4 md:px-16 py-8">
        <div className="text-center">
          <p className="text-red-500 text-lg">Failed to load product</p>
        </div>
      </div>
    );
  }
}

// Product loading skeleton
function ProductDetailsSkeleton() {
  return (
    <div className="px-4 md:px-16 py-2 md:py-6">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4 bg-gray-200 h-96 rounded-lg animate-pulse" />
        <div className="space-y-4">
          <div className="bg-gray-200 h-8 rounded animate-pulse" />
          <div className="bg-gray-200 h-6 rounded animate-pulse w-1/2" />
          <div className="bg-gray-200 h-10 rounded animate-pulse w-1/3" />
        </div>
      </div>
    </div>
  );
}

// Main page component
export default function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetailsServer params={params} />
    </Suspense>
  );
}
