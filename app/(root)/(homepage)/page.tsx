import Hero from "./(components)/Hero";
import ProductsGrid from "./(components)/ProductsGrid";

export default function Home() {
  return (
    <div>
      <Hero />
      <div className="py-16 px-6 lg:px-16 xl:px-20 2xl:px-24">
        <ProductsGrid />
      </div>
    </div>
  );
}
