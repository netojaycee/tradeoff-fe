"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useGetProductBySlugQuery } from "@/redux/api";
import { addToCart, updateQuantity } from "@/redux/slices/cartSlice";
import { toggleFavorite } from "@/redux/slices/favoritesSlice";
import { RootState } from "@/redux/store";
import ProductsGrid from "../../(homepage)/(components)/ProductsGrid";
import { ProductInfo } from "./(components)/ProductInfo";
import { ProductAccordion } from "./(components)/ProductAccordion";
import { ProductGallery } from "./(components)/ProductGallery";
import BuyNowModal from "../../../../components/local/ecom/BuyNowModal";
import AddedToCartModal from "@/components/local/ecom/AddedToCartModal";
import { CustomModal } from "@/components/local/custom/CustomModal";

export default function ProductDetails() {
  const { productSlug, category } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  
  // Redux state
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  // Modal states
  const [openedBuyNow, setOpenedBuyNow] = useState(false);
  const [openedAddedToCart, setOpenedAddedToCart] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Fetch product by slug
  const { data: productData, isLoading, error } = useGetProductBySlugQuery(
    productSlug as string,
    {
      skip: !productSlug,
    }
  );

  const product = productData?.data;

  // Console log the product data for debugging
  console.log("Product slug:", productSlug);
  console.log("Category:", category);
  console.log("Product data response:", productData);
  console.log("Product:", product);
  console.log("Is loading:", isLoading);
  console.log("Error:", error);

  // Handle favorite toggle
  const handleToggleFavorite = () => {
    if (product) {
      const productId = product.id || product._id || "";
      dispatch(toggleFavorite(productId));
    }
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    const productId = product.id || product._id || "";
    const productTitle = product.title || "";
    const productPrice = product.sellingPrice || product.originalPrice || 0;

    // Check if already in cart
    const existing = cartItems.find((item) => item.id === productId);
    if (!existing) {
      dispatch(
        addToCart({
          id: productId,
          name: productTitle,
          price: productPrice,
          image: product.images[0],
          quantity: 1,
        })
      );
    } else {
      dispatch(updateQuantity({ id: productId, quantity: existing.quantity + 1 }));
    }

    // UI feedback
    setTimeout(() => setIsAddingToCart(false), 500);
    setOpenedAddedToCart(true);
  };

  if (isLoading) {
    return (
      <div className="px-4 md:px-16 py-2 md:py-6">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4 bg-gray-200 h-96 rounded-lg animate-pulse" />
          <div className="space-y-4">
            <div className="bg-gray-200 h-8 rounded animate-pulse" />
            <div className="bg-gray-200 h-6 rounded animate-pulse w-1/2" />
            <div className="bg-gray-200 h-10 rounded animate-pulse w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="px-4 md:px-16 py-8">
        <div className="text-center">
          <p className="text-red-500 text-lg">Product not found</p>
          <p className="text-gray-600">Please check the URL and try again</p>
        </div>
      </div>
    );
  }

  const productId = product.id || product._id || "";
  const isFavorited = favorites.includes(productId);
  return (
    <div>
      <div className="px-4 md:px-16 py-2 md:py-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <ProductGallery
              images={product.images || []}
              isVerified={product.isVerifiedSeller || false}
              isWishlisted={isFavorited}
              onWishlistToggle={handleToggleFavorite}
            />
          </div>

          {/* Right: Product Info */}
          <div className="space-y-4">
            <ProductInfo
              product={product}
              onBuyNowClick={() => setOpenedBuyNow(true)}
              onAddToCartClick={handleAddToCart}
            />
            <ProductAccordion />
          </div>
        </div>
      </div>

      <div className="py-8 md:py-10 px-4 md:px-16">
        <ProductsGrid 
          limit={4} 
          title={"You May Also Like"} 
          category={product.category?.slug || ""} 
          productSlug={product.slug || ""} 
        />
      </div>

      <div className="py-8 md:py-10 px-4 md:px-16">
        <h3 className="text-lg text-[#262626] font-semibold mb-4">
          Others Also Searched For
        </h3>
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

      {/* Buy Now Modal */}
      <CustomModal open={openedBuyNow} onOpenChange={setOpenedBuyNow}>
        <BuyNowModal product={product} onClose={() => setOpenedBuyNow(false)} />
      </CustomModal>

      {/* Added to Cart Modal */}
      <CustomModal open={openedAddedToCart} onOpenChange={setOpenedAddedToCart}>
        <AddedToCartModal
          product={{
            ...product,
            name: product.title || "",
            images: product.images || [],
            price: product.sellingPrice || product.originalPrice || 0,
          }}
          onCheckout={() => {
            setOpenedAddedToCart(false);
            router.push("/checkout");
          }}
          onContinue={() => setOpenedAddedToCart(false)}
          onClose={() => setOpenedAddedToCart(false)}
        />
      </CustomModal>
    </div>
  );
}
