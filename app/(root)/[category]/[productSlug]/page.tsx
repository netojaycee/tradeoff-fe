"use client";
import { useParams } from "next/navigation";
import ProductsGrid from "../../(homepage)/(components)/ProductsGrid";
import { ProductInfo } from "./(components)/ProductInfo";
import { ProductAccordion } from "./(components)/ProductAccordion";
import { ProductGallery } from "./(components)/ProductGallery";
import { ProductThumbnails } from "./(components)/ProductThumbnails";


const product = {
  id: "1",
  name: "LV Remix Boat Shoe",
  price: 240000.0,
  description:
    "A sleek, easy-to-style boat shoe that blends classic design with everyday comfort and street-ready flair.",
  condition: "Worn",
  stock: 1,
  images: [
    "/shoe.png",
    "/shoe.png",
    "/shoe.png",
    "/shoe.png",
  ],
  breadcrumbs: ["Home", "LV Remix Boat Shoe"],
};


export default function ProductDetails() {
  const { productSlug, category } = useParams();
  return (
    <div>
      <div className="container mx-auto px-4 py-4 text-sm text-gray-500">
        {product.breadcrumbs.map((crumb, i) => (
          <span key={i}>
            {i > 0 && " / "}
            {crumb}
          </span>
        ))}
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <ProductGallery images={product.images} />
            <ProductThumbnails images={product.images} />
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            <ProductInfo
              name={product.name}
              description={product.description}
              price={product.price}
              condition={product.condition}
              stock={product.stock}
            />
            <ProductAccordion />
         </div></div> </div>
       
      <div className="py-8 md:py-16 px-4 lg:px-16 xl:px-20 2xl:px-24">
        <ProductsGrid limit={4} title={"You May Also Like"} />
      </div>

      <div className="py-8 md:py-16 px-4 lg:px-16 xl:px-20 2xl:px-24">
        <h3 className="text-lg text-[#262626] font-semibold mb-4">Others Also Searched For</h3>
        <ul className="flex flex-wrap gap-2">
          {[
            "Chanel bags under 40k",
            "Affordable sneakers",
            "Two piece for wedding",
            "Louis vuitton cross bags",
          ].map((term) => (
            <li key={term}>
              <a
                href={`/search?query=${encodeURIComponent(term)}`}
                className="inline-block px-3 py-1 text-[#DC2626] rounded-full text-sm"
              >
                {term}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
