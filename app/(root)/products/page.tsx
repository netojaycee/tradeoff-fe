
import ProductListing from "./(components)/ProductListing";

export default function Products() {
  return (
    <main className="px-4 md:px-16 py-4">
      <h1 className="text-2xl font-bold mb-4">New Arrivals</h1>
      <p className="text-gray-500 mb-6 text-sm">
        Shop from collections of items that just landed on our platform. Don&apos;t miss out.
      </p>
      <ProductListing enablePagination={true} itemsPerPage={12} />
    </main>
  );
}