import Hero from "./(components)/Hero";
import ProductsGrid from "./(components)/ProductsGrid";
import SellHero from "./(components)/SellHero";
import PopularBrands from "./(components)/PopularBrands";

export default function Home() {
  return (
    <div>
      <Hero />
      <div className="py-8 md:py-16 px-4 lg:px-16 xl:px-20 2xl:px-24">
        <ProductsGrid />
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
