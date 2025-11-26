'use client';

import Link, { LinkProps } from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface PrefetchLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  prefetch?: boolean;
  prefetchDelay?: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

/**
 * Optimized Link component with smart prefetching
 * Prefetches on hover/focus to improve navigation performance
 */
export function PrefetchLink({
  children,
  prefetch = true,
  prefetchDelay = 200,
  className,
  onMouseEnter: onMouseEnterProp,
  onMouseLeave: onMouseLeaveProp,
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  ...props
}: PrefetchLinkProps) {
  const router = useRouter();
  const [isPrefetching, setIsPrefetching] = useState(false);
  let prefetchTimer: NodeJS.Timeout;

  const handleMouseEnter = () => {
    if (!prefetch) {
      onMouseEnterProp?.();
      return;
    }

    prefetchTimer = setTimeout(() => {
      if (typeof props.href === 'string') {
        router.prefetch(props.href);
        setIsPrefetching(true);
      }
    }, prefetchDelay);

    onMouseEnterProp?.();
  };

  const handleMouseLeave = () => {
    clearTimeout(prefetchTimer);
    onMouseLeaveProp?.();
  };

  const handleFocus = () => {
    if (!prefetch) {
      onFocusProp?.();
      return;
    }

    if (typeof props.href === 'string') {
      router.prefetch(props.href);
      setIsPrefetching(true);
    }

    onFocusProp?.();
  };

  const handleBlur = () => {
    onBlurProp?.();
  };

  return (
    <Link
      {...props}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
    </Link>
  );
}

/**
 * Hook to prefetch multiple links on page load
 * Useful for prefetching popular products/categories
 */
export function usePrefetchLinks(links: string[]) {
  const router = useRouter();

  useEffect(() => {
    // Prefetch links with requestIdleCallback for non-blocking behavior
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        links.forEach((link) => {
          router.prefetch(link);
        });
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        links.forEach((link) => {
          router.prefetch(link);
        });
      }, 2000);
    }
  }, [links, router]);
}

/**
 * Prefetch links when they become visible in viewport
 */
export function useIntersectionPrefetch(links: Array<{ href: string; ref: React.RefObject<HTMLElement> }>) {
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const link = links.find((l) => l.ref.current === entry.target);
          if (link) {
            router.prefetch(link.href);
          }
        }
      });
    });

    links.forEach(({ ref }) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      links.forEach(({ ref }) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [links, router]);
}
