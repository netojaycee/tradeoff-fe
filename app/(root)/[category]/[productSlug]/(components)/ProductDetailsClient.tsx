"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, useFavoritesStore } from "@/lib/stores";
import { Product } from "@/lib/types";
import { ProductInfo } from "./ProductInfo";
import { ProductAccordion } from "./ProductAccordion";
import { ProductGallery } from "./ProductGallery";
import BuyNowModal from "@/components/local/ecom/BuyNowModal";
import AddedToCartModal from "@/components/local/ecom/AddedToCartModal";
import { CustomModal } from "@/components/local/custom/CustomModal";
import ProductsGrid from "@/app/(root)/(homepage)/(components)/ProductsGrid";

interface ProductDetailsClientProps {
  initialProduct: Product;
}

export default function ProductDetailsClient({
  initialProduct,
}: ProductDetailsClientProps) {
  const router = useRouter();

  const { toggleFavorite, isFavorited } = useFavoritesStore();
  const { addToCart, updateQuantity, items: cartItems } = useCartStore();

  const [openedBuyNow, setOpenedBuyNow] = useState(false);
  const [openedAddedToCart, setOpenedAddedToCart] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const product = initialProduct;

  const handleToggleFavorite = () => {
    if (product) {
      const productId = product.id || product._id || "";
      toggleFavorite(productId);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);
    const productId = product.id || product._id || "";
    const productTitle = product.title || "";
    const productPrice = product.sellingPrice || product.originalPrice || 0;

    const existing = cartItems.find((item) => item.id === productId);
    if (!existing) {
      addToCart({
        id: productId,
        name: productTitle,
        price: productPrice,
        image: product.images[0],
        quantity: 1,
      });
    } else {
      updateQuantity(productId, existing.quantity + 1);
    }

    setTimeout(() => setIsAddingToCart(false), 500);
    setOpenedAddedToCart(true);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setOpenedBuyNow(true);
  };

  return (
    <div className="px-4 md:px-16 py-2 md:py-6">
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Product Gallery */}
        <ProductGallery
          images={product.images || []}
          isVerified={product.isVerified}
          isWishlisted={isFavorited(product.id || product._id || "")}
          onWishlistToggle={handleToggleFavorite}
        />

        {/* Product Info */}
        <div className="space-y-4">
          <ProductInfo
            product={product}
            onAddToCartClick={handleAddToCart}
            onBuyNowClick={handleBuyNow}
          />
          {/* Product Details Accordion */}
          <ProductAccordion product={product} />
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <ProductsGrid
          limit={4}
          category={product.category?.slug}
          productSlug={product.slug}
          title="You May Also Like"
        />
      </div>

      {/* Modals */}
      <CustomModal open={openedBuyNow} onOpenChange={setOpenedBuyNow}>
        <BuyNowModal
          product={
            {
              ...product,
              images: product.images || [],
              price: product.sellingPrice || product.originalPrice || 0,
            } as any
          }
          onClose={() => setOpenedBuyNow(false)}
        />
      </CustomModal>

      <CustomModal open={openedAddedToCart} onOpenChange={setOpenedAddedToCart}>
        <AddedToCartModal
          product={
            {
              ...product,
              images: product.images || [],
              price: product.sellingPrice || product.originalPrice || 0,
            } as any
          }
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
