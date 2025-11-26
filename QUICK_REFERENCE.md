# Quick Reference: Using the New Optimizations

## 🎯 Common Usage Patterns

### 1. Using Cache Presets in Queries

```typescript
// Before
const { data } = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
  staleTime: 60000,
  gcTime: 10 * 60 * 1000,
});

// After - Using Optimized Hook
import { useOptimizedQuery, CACHE_PRESETS } from '@/lib/hooks/useOptimizedQuery';

const { data } = useOptimizedQuery(
  'PRODUCTS',
  ['products'],
  fetchProducts
);

// Or use specialized hook
import { useProductQuery } from '@/lib/hooks/useOptimizedQuery';
const { data } = useProductQuery();
```

### 2. Adding Product Schema to Pages

```typescript
import { generateProductSchema, generateSearchActionSchema } from '@/lib/seo/product-schema';

// In server component
const productSchema = generateProductSchema({
  id: product.id,
  name: product.title,
  price: product.price,
  image: product.images,
  url: `/category/${product.slug}`,
  availability: product.inStock ? 'InStock' : 'OutOfStock',
});

// In JSX
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
/>
```

### 3. Using PrefetchLink Component

```typescript
import { PrefetchLink } from '@/components/local/custom/PrefetchLink';

// Replace Next.js Link
<PrefetchLink href="/products/123">
  View Product
</PrefetchLink>

// Batch prefetch on mount
import { usePrefetchLinks } from '@/components/local/custom/PrefetchLink';

export function PopularProducts() {
  usePrefetchLinks(['/products/1', '/products/2', '/products/3']);
  return <div>...</div>;
}
```

### 4. Lazy Loading Below-Fold Components

```typescript
import { createLazyComponent } from '@/lib/utils/lazy-loading';

// Original component
function HeavyComponent() {
  return <div>Complex content...</div>;
}

// Lazy version
const LazyHeavyComponent = createLazyComponent(HeavyComponent, {
  fallback: <div>Loading...</div>,
});

// Use in page
export function Page() {
  return (
    <>
      <Hero />
      <LazyHeavyComponent />
    </>
  );
}
```

### 5. Canonical URLs

```typescript
import { getProductCanonicalUrl, getCanonicalUrl } from '@/lib/seo/canonical-url';

// In metadata
export async function generateMetadata() {
  return {
    alternates: {
      canonical: getProductCanonicalUrl(categorySlug, productSlug),
    },
  };
}

// Or get for any page
const canonical = getCanonicalUrl('/page', { param: 'value' });
```

### 6. Logging (Production-Safe)

```typescript
import { logger } from '@/lib/utils/logger';

// These only log in development
logger.log('Message', { data: 'value' });
logger.debug('Debug info', { data: 'value' });

// These always log (even in production)
logger.error('Error occurred', error);
logger.warn('Warning', { data: 'value' });
logger.info('Info', { data: 'value' });
```

### 7. Error Reporting

```typescript
import { errorLogger } from '@/lib/utils/error-logger';

// Report custom errors
try {
  // code
} catch (error) {
  errorLogger.reportError({
    message: 'Something went wrong',
    error: error as Error,
    severity: 'error',
    context: { action: 'checkout' },
  });
}

// Errors are auto-captured globally
// Check POST /api/errors to see reports
```

### 8. Breadcrumb Schema

```typescript
import { BreadcrumbSchema, getProductBreadcrumbs } from '@/lib/seo/breadcrumb-schema';

const items = getProductBreadcrumbs(
  categoryName,
  categorySlug,
  productName,
  productSlug
);

// In JSX
<BreadcrumbSchema items={items} />
<nav>
  {items.map(item => (
    <Link key={item.href} href={item.href}>
      {item.title}
    </Link>
  ))}
</nav>
```

### 9. Blur Placeholders for Images

```typescript
import { getStaticBlurSvg } from '@/lib/utils/blur-placeholder';
import Image from 'next/image';

<Image
  src={product.image}
  alt={product.name}
  placeholder="blur"
  blurDataURL={getStaticBlurSvg(600, 600)}
/>
```

### 10. Environment Variable Access

```typescript
import { getEnv, isFeatureEnabled } from '@/lib/env';

// In server component
const env = getEnv();
console.log(env.NEXT_PUBLIC_API_URL);

// Check if feature enabled
if (isFeatureEnabled('PWA')) {
  console.log('PWA is enabled');
}

// In browser (use NEXT_PUBLIC_ variables directly)
console.log(process.env.NEXT_PUBLIC_API_URL);
```

### 11. Font Usage in Tailwind

```typescript
// Already configured in layout.tsx
// Use CSS variables:

export default function Component() {
  return (
    <>
      <h1 style={{ fontFamily: 'var(--font-playfair)' }}>
        Heading
      </h1>
      <p style={{ fontFamily: 'var(--font-inter)' }}>
        Body text
      </p>
    </>
  );
}
```

### 12. Web Vitals Data

All Web Vitals are automatically collected and sent to:
- **Endpoint**: `POST /api/analytics/vitals`
- **Metrics**: PageLoadTime, FirstContentfulPaint, AvgResourceTime
- **Auto-triggered**: On page load

No action needed - happens automatically!

---

## 📋 Environment Variables Setup

Create `.env.local`:

```env
# Required
NEXT_PUBLIC_API_URL=https://api-tradeoff.onrender.com

# Optional but recommended
NEXT_PUBLIC_SENTRY_DSN=https://key@sentry.io/projectid

# Features (default to true)
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_SERVICE_WORKER=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Runtime
NODE_ENV=production
```

---

## 🔍 Debugging Tips

### Check Service Worker Status
```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service Workers:', registrations);
});
```

### Check Web Vitals
```javascript
// In browser console
fetch('/api/analytics/vitals')
  .then(r => r.json())
  .then(data => console.log('Last vitals:', data));
```

### Check Errors
```javascript
// In browser console
fetch('/api/errors')
  .then(r => r.json())
  .then(data => console.log('Last errors:', data));
```

### View All Cache Presets
```typescript
import { CACHE_PRESETS } from '@/lib/providers/QueryProvider';
console.table(CACHE_PRESETS);
```

---

## 🚀 Performance Testing

### Build Analysis
```bash
npm run build
# Check .next/static folder size

npm run build -- --analyze
# Requires @next/bundle-analyzer
```

### Lighthouse CLI
```bash
npx lighthouse https://tradeoff.ng --view
```

### Web Vitals Real User Monitoring
- Dashboard: `/api/analytics/vitals` endpoint
- Open DevTools → Network tab
- Filter by vitals requests

---

## 🔐 Security Checklist

- [x] CSP headers configured
- [x] HSTS enabled (forces HTTPS)
- [x] X-Frame-Options set to DENY
- [x] X-Content-Type-Options: nosniff
- [x] No console.log in production
- [x] Environment variables validated with Zod
- [x] Error logging doesn't leak sensitive data

---

## 📚 Further Reading

1. **ISR Documentation**: https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
2. **Image Optimization**: https://nextjs.org/docs/basic-features/image-optimization
3. **Web Vitals**: https://web.dev/vitals/
4. **Schema.org**: https://schema.org/
5. **Service Workers**: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
6. **PWA**: https://web.dev/progressive-web-apps/

---

## ✅ Migration Checklist for Existing Queries

When updating existing code:

1. Replace `useQuery` with `useOptimizedQuery` or specific hook
2. Use CACHE_PRESETS for custom configurations
3. Replace direct `import('logger')` usages with logger utility
4. Add schema markup to detail pages
5. Use PrefetchLink for frequently clicked links
6. Wrap heavy components with lazy loading
7. Add canonical URLs to dynamic pages
8. Test Web Vitals collection in Network tab

---

**Last Updated**: November 26, 2025
**Quick Start Time**: ~5 minutes
