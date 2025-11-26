import { Inter, Playfair_Display } from 'next/font/google';

/**
 * Primary sans-serif font for body text
 * Optimized with preload and subset loading
 */
export const interFont = Inter({
  subsets: ['latin'],
  display: 'swap', // Use fallback while loading
  preload: true,
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});

/**
 * Serif font for headings
 * Playfair Display - elegant serif for luxury brand aesthetic
 */
export const playfairFont = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  weight: ['400', '700', '900'],
  variable: '--font-playfair',
});

/**
 * Font CSS classes
 * Use these in your components or Tailwind config
 */
export const fontClasses = {
  inter: interFont.className,
  playfair: playfairFont.className,
};

/**
 * CSS variables for use in Tailwind
 */
export const fontVariables = {
  inter: interFont.variable,
  playfair: playfairFont.variable,
};
