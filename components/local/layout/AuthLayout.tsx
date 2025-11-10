"use client"

import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  className?: string
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  className
}) => {
  return (
    <>
      {/* Mobile Layout - Same as before */}
      <div className="md:hidden min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className={cn("w-full max-w-md bg-white rounded-lg shadow-sm p-6", className)}>
          {/* Header */}
          <div className="mb-6 mt-5">
            <h1 className="text-2xl font-semibold text-[#404040] mb-2">
              {title}
            </h1>
            <p className="text-[#737373] text-sm">
              {subtitle}
            </p>
          </div>

          {/* Content */}
          {children}
        </div>
      </div>

      {/* Desktop Layout - Split Screen */}
      <div className="hidden md:flex min-h-screen">
        {/* Left Side - Auth Form */}
        <div className="flex-1 flex items-center justify-center bg-white p-8">
          <div className={cn("w-full max-w-md", className)}>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-[#404040] mb-2">
                {title}
              </h1>
              <p className="text-[#737373] text-base">
                {subtitle}
              </p>
            </div>

            {/* Content */}
            {children}
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="flex-1 relative">
          <Image
            src="/auth.png"
            alt="Authentication"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </>
  )
}

export { AuthLayout }