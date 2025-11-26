import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { Toaster } from "sonner";
import { defaultMetadata } from "@/lib/seo/metadata";
import { ServiceWorkerProvider } from "@/components/providers/ServiceWorkerProvider";
import { WebVitalsProvider } from "@/components/providers/WebVitalsProvider";
import { interFont, playfairFont } from "@/lib/fonts";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-NG" className={`${interFont.variable} ${playfairFont.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        {/* Favicon Files */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        {/* Android Chrome Icons */}
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/android-chrome-512x512.png"
        />
        {/* PWA Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="alternate" hrefLang="en-NG" href="https://tradeoff.ng" />
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=YOUR_GOOGLE_GA_ID"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'YOUR_GOOGLE_GA_ID');
            `,
          }}
        />
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "TradeOff",
              url: "https://tradeoff.ng",
              logo: "https://tradeoff.ng/logo.png",
              description:
                "Nigeria's premier luxury fashion marketplace for authenticated designer fashion",
              sameAs: [
                "https://twitter.com/TradeOffNG",
                "https://instagram.com/TradeOffNG",
                "https://facebook.com/TradeOffNG",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+234-XXX-XXXX-XXX",
                contactType: "Customer Service",
                areaServed: "NG",
                availableLanguage: "en",
              },
              address: {
                "@type": "PostalAddress",
                addressCountry: "NG",
                addressLocality: "Lagos",
              },
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ServiceWorkerProvider />
        <WebVitalsProvider />
        <QueryProvider>{children}</QueryProvider>
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
