import React from 'react'
import Image from 'next/image'
import { CustomButton } from '@/components/local/custom/CustomButton'

export default function Hero() {
  return (
    <section className=" bg-[#E3E3E31A] overflow-hidden">
      <div className="flex flex-col-reverse lg:flex-row items-center">
        {/* Content Section - Left on desktop, Bottom on mobile */}
        <div className="flex-1 flex flex-col justify-center px-4 py-8 lg:px-20 2xl:px-24">
          <div className="max-w-2xl lg:max-w-none">
            {/* Tag */}
            <div className="text-left">
              <span className="text-sm font-medium text-[#525252] tracking-wide uppercase">
                STYLE FOR EVERY ERA
              </span>
            </div>
            
            {/* Main Heading */}
            <h1 className="mt-2 text-xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold text-[#262626] leading-tight text-left">
              Buy, Sell & Style the Way You Want...
            </h1>
            
            {/* Subtitle */}
            <p className="mt-2 text-base lg:text-lg xl:text-xl text-[#525252] leading-relaxed text-left">
              Your wardrobe, your rules... Let&apos;s make it fresh!
            </p>
            
            {/* CTA Button */}
            <div className="mt-2 md:mt-6 text-left">
              <CustomButton
                size="sm"
                icon="lucide:arrow-right"
                variant={"link"}
                iconPosition="right"
              >
                Shop Collection
              </CustomButton>
            </div>
          </div>
        </div>
        
        {/* Image Section - Right on desktop, Top on mobile */}
        <div className="flex-1 relative w-full">
          <Image
            src="/hero-image.png"
            alt="Stylish man in black jacket"
            className="object-cover object-center w-full h-auto"
            width={600}
            height={800}
            priority
          />
        </div>
      </div>
    </section>
  )
}
