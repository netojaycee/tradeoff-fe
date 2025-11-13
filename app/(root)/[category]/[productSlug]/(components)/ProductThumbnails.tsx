// components/product/ProductThumbnails.tsx
"use client";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";

export function ProductThumbnails({ images }: { images: string[] }) {
  return (
    <Carousel className="w-full" opts={{ align: "start" }}>
      <CarouselContent className="-ml-2">
        {images.map((src, i) => (
          <CarouselItem key={i} className="pl-2 basis-1/4 sm:basis-1/5">
            <div className="relative aspect-square bg-gray-50 rounded-md overflow-hidden border border-gray-200 cursor-pointer hover:border-gray-400 transition">
              <Image
                src={src}
                alt={`Thumbnail ${i + 1}`}
                fill
                className="object-contain p-2"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}