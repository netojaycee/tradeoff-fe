// components/product/ProductGallery.tsx
"use client";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";
// import Autoplay from "embla-carousel-autoplay";

export function ProductGallery({ images }: { images: string[] }) {
  return (
    <Carousel
    //   plugins={[
    //     Autoplay({
    //       delay: 4000,
    //     }),
    //   ]}
      className="w-full"
    >
      <CarouselContent>
        {images.map((src, i) => (
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
    </Carousel>
  );
}