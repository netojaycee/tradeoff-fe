interface BreadcrumbItem {
  title: string;
  href: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb schema component for SEO
 * Generates BreadcrumbList schema.org JSON-LD
 */
export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const baseUrl = 'https://tradeoff.ng';
  
  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      item: `${baseUrl}${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
    />
  );
}

/**
 * Generates breadcrumb items for product pages
 */
export function getProductBreadcrumbs(
  categoryName: string,
  categorySlug: string,
  productName: string,
  productSlug: string
): BreadcrumbItem[] {
  return [
    { title: 'Home', href: '/' },
    { title: 'Products', href: '/products' },
    { title: categoryName, href: `/${categorySlug}` },
    { title: productName, href: `/${categorySlug}/${productSlug}` },
  ];
}

/**
 * Generates breadcrumb items for category pages
 */
export function getCategoryBreadcrumbs(
  categoryName: string,
  categorySlug: string
): BreadcrumbItem[] {
  return [
    { title: 'Home', href: '/' },
    { title: 'Products', href: '/products' },
    { title: categoryName, href: `/${categorySlug}` },
  ];
}
