"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { CustomInput } from './CustomInput'
import { CustomButton } from './CustomButton'

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { name: 'New Arrivals', href: '/new-arrivals', hasDropdown: true },
    { name: 'Designers', href: '/designers', hasDropdown: true },
    { name: 'Bags', href: '/bags', hasDropdown: true },
    { name: 'Accessories', href: '/accessories', hasDropdown: true },
    { name: 'Shoes', href: '/shoes', hasDropdown: true },
    { name: 'Jewellries', href: '/jewellries', hasDropdown: true },
    { name: 'Watches', href: '/watches', hasDropdown: true },
    { name: 'Sale', href: '/sale', hasDropdown: true },
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-black">
          TradeOff.
        </Link>

        {/* Mobile Actions */}
        <div className="flex items-center space-x-3">
          <Link href="/sell" className="text-sm text-gray-700">
            Sell with us
          </Link>
          <Link href="/wishlist" className="relative">
            <Icon icon="material-symbols:favorite-outline" className="w-6 h-6 text-gray-700" />
          </Link>
          <Link href="/cart" className="relative">
            <Icon icon="material-symbols:shopping-bag-outline" className="w-6 h-6 text-gray-700" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              2
            </span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1"
          >
            <Icon icon="material-symbols:menu" className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-[#38BDF8]">
            TradeOff.
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <CustomInput
                type="text"
                placeholder="Search for brand, item..."
                icon="material-symbols:search"
                iconPosition="left"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-6">
            <Link 
              href="/sell" 
              className="text-gray-700 hover:text-black transition-colors"
            >
              Sell with us
            </Link>
            
            <Link href="/wishlist" className="relative hover:scale-110 transition-transform">
              <Icon icon="material-symbols:favorite-outline" className="w-6 h-6 text-gray-700" />
            </Link>
            
            <Link href="/cart" className="relative hover:scale-110 transition-transform">
              <Icon icon="material-symbols:shopping-bag-outline" className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </Link>

            <CustomButton
              variant="default"
              className="bg-[#38BDF8] hover:bg-[#2abdfc] text-white px-6 py-2 rounded-lg font-medium"
            >
              Get started
            </CustomButton>

            {/* Gender Filter */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button className="p-2 rounded bg-white shadow-sm">
                <Icon icon="material-symbols:person-outline" className="w-5 h-5 text-gray-700" />
              </button>
              <button className="p-2 rounded">
                <Icon icon="material-symbols:person-outline" className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="border-t border-gray-200 px-6 py-3">
          <div className="flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-1 text-gray-700 hover:text-black transition-colors group"
              >
                <span className="text-sm font-medium">{item.name}</span>
                {item.hasDropdown && (
                  <Icon 
                    icon="material-symbols:keyboard-arrow-down" 
                    className="w-4 h-4 group-hover:rotate-180 transition-transform" 
                  />
                )}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="bg-white w-80 h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-lg font-semibold">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1"
              >
                <Icon icon="material-symbols:close" className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="p-4 border-b">
              <CustomInput
                type="text"
                placeholder="Search for brand, item..."
                icon="material-symbols:search"
                iconPosition="left"
                className="w-full"
              />
            </div>

            {/* Mobile Navigation */}
            <nav className="p-4">
              <div className="space-y-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center justify-between py-2 text-gray-700 hover:text-black transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>{item.name}</span>
                    {item.hasDropdown && (
                      <Icon icon="material-symbols:chevron-right" className="w-5 h-5" />
                    )}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Mobile Actions */}
            <div className="p-4 border-t mt-auto">
              <CustomButton
                variant="default"
                className="w-full bg-[#38BDF8] hover:bg-[#2abdfc] text-white py-3 rounded-lg font-medium mb-4"
              >
                Get started
              </CustomButton>
              
              <div className="text-center">
                <span className="text-sm text-gray-500">Already have an account? </span>
                <Link href="/auth/login" className="text-sm text-[#38BDF8] font-medium">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export { Header }
