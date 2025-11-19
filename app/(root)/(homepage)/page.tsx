import Hero from "./(components)/Hero";
import ProductsGrid from "./(components)/ProductsGrid";
import SellHero from "./(components)/SellHero";
import PopularBrands from "./(components)/PopularBrands";

// This is a client component but we can export metadata for the root layout
// export const metadata: Metadata = {
//   title: "Home - TradeOff | Premium Luxury Fashion Marketplace Nigeria",
//   description:
//     "Discover authenticated luxury fashion in Nigeria. Buy and sell designer handbags, shoes, and accessories on TradeOff - your trusted luxury fashion marketplace.",
//   keywords: [
//     "luxury fashion Nigeria",
//     "designer handbags",
//     "authenticated fashion",
//     "luxury resale",
//     "fashion marketplace Nigeria",
//   ],
//   openGraph: {
//     title: "TradeOff - Premium Luxury Fashion Marketplace in Nigeria",
//     description:
//       "Buy and sell authenticated designer fashion on TradeOff. Nigeria's premier luxury marketplace.",
//     type: "website",
//     locale: "en_NG",
//     url: "https://tradeoff.ng",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "TradeOff - Luxury Fashion Marketplace",
//     description: "Discover authenticated luxury fashion in Nigeria",
//   },
// };

export default function Home() {
 

  return (
    <div>
      <Hero />
      <div className="py-8 md:py-16 px-4 lg:px-16 xl:px-20 2xl:px-24">
        <ProductsGrid 
          limit={8}
          title="Featured Products"
        />
      </div>
      <div className="mt-8">
        <SellHero />
      </div>
      <div className="mt-8">
        <PopularBrands />
      </div>
    </div>
  );
}
