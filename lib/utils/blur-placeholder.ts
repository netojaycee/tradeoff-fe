/**
 * Generates blur placeholder for images
 * Creates low-res base64 versions for LQIP (Low Quality Image Placeholder)
 */

// Simple 1x1 SVG blur placeholder
const DEFAULT_BLUR_PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221%22 height=%221%22%3E%3Crect fill=%22%23e5e5e5%22 width=%221%22 height=%221%22/%3E%3C/svg%3E';

/**
 * Cache for blur placeholders
 */
const blurCache = new Map<string, string>();

/**
 * Get cached or generate blur placeholder
 * For production, use a simple SVG or request from API
 */
export async function getCachedBlurDataUrl(imageUrl: string): Promise<string> {
  if (blurCache.has(imageUrl)) {
    return blurCache.get(imageUrl)!;
  }

  // Return default for now - can be enhanced with plaiceholder package
  blurCache.set(imageUrl, DEFAULT_BLUR_PLACEHOLDER);
  return DEFAULT_BLUR_PLACEHOLDER;
}

/**
 * Simple gradient placeholder (fallback)
 */
export function getGradientPlaceholder(seed: string): string {
  const hash = seed
    .split('')
    .reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0);
  const hue = Math.abs(hash) % 360;
  const gradientStart = `hsl(${hue}, 70%, 60%)`;
  const gradientEnd = `hsl(${(hue + 60) % 360}, 70%, 80%)`;

  return `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`;
}

/**
 * Get static blur SVG placeholder
 */
export function getStaticBlurSvg(width: number = 600, height: number = 600): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect fill='%23f0f0f0' width='${width}' height='${height}'/%3E%3C/svg%3E`;
}
