"use client"

import Image from 'next/image'
import { CustomButton } from '@/components/local/custom/CustomButton'

export default function SellHero() {
  return (
    <section className="w-full">
      {/* Top CTA area */}
      <div className="w-full bg-[#0E6A91] text-white py-12 md:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">Turn Your Closet Into Cash</h2>
          <p className="mt-3 text-sm md:text-base text-white/90 max-w-2xl mx-auto">
            We do the work. You get paid. It&apos;s easy to sell what no longer serves you. <span className="underline">*Terms apply</span>
          </p>

          <div className="mt-6 flex justify-center">
            <CustomButton
              className="border border-white bg-transparent"
              icon="lucide:tag"
              iconPosition="left"

            >
              Sell With Us
            </CustomButton>
          </div>
        </div>
      </div>

      {/* Lower image area - full width image */}
      <div className="w-full h-48 md:h-64 lg:h-80 relative">
        <Image
          src="/sell.png"
          alt="Closet turned into cash" 
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
      </div>
    </section>
  )
}
