"use client"

import React from 'react'
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
    <div className="min-h-screen bg-gray-50 flex md:items-center md:justify-center p-4 md:p-6">
      <div className={cn("w-full max-w-md bg-white rounded-lg md:shadow-sm md:p-6", className)}>
        {/* Header */}
        <div className="mb-6 md:mt-0 mt-5">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#404040] mb-2">
            {title}
          </h1>
          <p className="text-[#737373] text-sm md:text-base">
            {subtitle}
          </p>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  )
}

export { AuthLayout }