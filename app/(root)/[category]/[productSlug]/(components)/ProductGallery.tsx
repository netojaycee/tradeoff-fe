// components/product/ProductGallery.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Icon } from "@iconify/react";

type ProductGalleryProps = {
  images: string[];
  isVerified?: boolean;
  isWishlisted?: boolean;
  onWishlistToggle?: () => void;
};

export function ProductGallery({
  images,
  isVerified = false,
  isWishlisted = false,
  onWishlistToggle = () => {},
}: ProductGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(isWishlisted);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    onSelect(); // initial
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Thumbnail click → scroll main carousel
  const handleThumbClick = (index: number) => {
    api?.scrollTo(index);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onWishlistToggle();
  };

  return (
    <div className="space-y-4">
      {/* MAIN IMAGE CAROUSEL */}
      <div className="relative">
        <Carousel
         setApi={setApi}
          opts={{ loop: true }}
          className="w-full"
        >
          <CarouselContent>
            {images && images.map((src, i) => (
              <CarouselItem key={i}>
                <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
                  <Image
                    src={src}
                    alt={`Product image ${i + 1}`}
                    fill
                    className="object-contain p-8"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={i === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </>
          )}

          {/* Heart Icon (Top Right) */}
          <button
            onClick={handleLike}
            className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isLiked ? "fill-red-500 text-red-500" : "text-gray-700"
              }`}
            />
          </button>

          {/* Verified Badge (Bottom Left) */}
          {isVerified && (
            <div className="absolute bottom-2 left-4 z-10">
              <div className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded border border-gray-300 text-xs font-medium">
                <span>Verified</span>
                <Icon
                  icon="streamline-ultimate:check-badge-bold"
                  className="w-4 h-4 text-[#8BC34A]"
                />
              </div>
            </div>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full">
            <CarouselDots />
          </div>
        </Carousel>
      </div>

      {/* THUMBNAILS */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => handleThumbClick(i)}
              className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                currentIndex === i
                  ? "border-black ring-2 ring-black ring-offset-2"
                  : "border-[#E5E5E5] hover:border-gray-400"
              }`}
            >
              <Image
                src={src}
                alt={`Thumbnail ${i + 1}`}
                fill
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
