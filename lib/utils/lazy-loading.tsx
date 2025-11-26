'use client';

import dynamic from 'next/dynamic';
import { ComponentType, ReactNode, Suspense } from 'react';

/**
 * Loading fallback for lazy-loaded components
 */
export function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

/**
 * Create a lazy-loaded component with streaming support
 */
export function createLazyComponent<P extends object>(
  Component: ComponentType<P>,
  options?: {
    fallback?: ReactNode;
    delay?: number;
  }
) {
  const DynamicComponent = dynamic(() => Promise.resolve(Component), {
    loading: () => (options?.fallback as any) || <LoadingFallback />,
    ssr: false,
  });

  return function LazyWrapper(props: P) {
    return (
      <Suspense fallback={(options?.fallback as any) || <LoadingFallback />}>
        <DynamicComponent {...props} />
      </Suspense>
    );
  };
}

/**
 * Lazy load component when it enters viewport
 */
export function createIntersectionLazyComponent<P extends object>(
  Component: ComponentType<P>,
  options?: {
    rootMargin?: string;
    threshold?: number;
  }
) {
  return dynamic(() => Promise.resolve(Component), {
    loading: () => <LoadingFallback />,
    ssr: false,
  });
}

/**
 * Preload a component before rendering
 */
export function preloadComponent(
  componentPath: string,
  options?: {
    priority?: 'high' | 'medium' | 'low';
  }
) {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    (window as any).requestIdleCallback(
      () => {
        import(componentPath).catch(() => {
          // Silently fail
        });
      },
      { timeout: options?.priority === 'high' ? 1000 : 5000 }
    );
  }
}

/**
 * Utility to create a dynamically imported component
 */
export function withLazyLoad<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  fallback: ReactNode = <LoadingFallback />
) {
  return dynamic(importFn, {
    loading: () => fallback,
    ssr: false,
  });
}
