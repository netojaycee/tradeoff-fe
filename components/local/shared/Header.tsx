"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { CustomInput } from "../custom/CustomInput";
import { CustomButton } from "../custom/CustomButton";
import { Logo } from "./Logo";
import { useGetCategoriesQuery } from "@/redux/api";
import { Category } from "@/lib/types";

interface NavigationItem {
  name: string;
  href: string;
  hasDropdown: boolean;
}

interface HeaderAction {
  type: "link" | "icon";
  label?: string;
  icon?: string;
  href: string;
  className: string;
  showOnMobile: boolean;
  hasNotification?: boolean;
  notificationCount?: number;
}

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch categories from RTK Query
  const { data: categoriesData } = useGetCategoriesQuery();
  const allCategories = categoriesData?.data || [];
  
  // Limit to 8 categories for UI
  const navigationItems: NavigationItem[] = allCategories.slice(0, 8).map((category:  Category) => ({
    name: category.name,
    href: "/",
    hasDropdown: true,
  }));

  const [open, setOpen] = useState(false);

  const product = {
    name: "LV Remix Boat Shoe",
    description:
      "A sleek, easy-to-style boat shoe that blends classic design with everyday comfort and street-ready flair.",
    price: 24000,
    image: "/shoe.png",
  };
  // Header action items
  const headerActions: HeaderAction[] = [
    {
      type: "link",
      label: "Sell with us",
      href: "/sell",
      className:
        "text-gray-800 hover:text-black underline transition-colors text-sm font-semibold",
      showOnMobile: true,
    },
    {
      type: "icon",
      icon: "material-symbols:search",
      href: "/search",
      className: "relative hover:scale-110 transition-transform",
      showOnMobile: true,
      hasNotification: false,
    },
    {
      type: "icon",
      icon: "material-symbols:favorite-outline",
      href: "/wishlist",
      className: "relative hover:scale-110 transition-transform",
      showOnMobile: true,
      hasNotification: false,
    },
    {
      type: "icon",
      icon: "material-symbols:shopping-bag-outline",
      href: "/cart",
      className: "relative hover:scale-110 transition-transform",
      showOnMobile: true,
      hasNotification: true,
      notificationCount: 2,
    },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 ">
        {/* Logo */}
        <Logo variant="dark" />

        {/* Mobile Actions */}
        <div className="flex items-center space-x-3">
          {headerActions
            .filter((action) => action.showOnMobile)
            .map((action, index) => (
              <div key={index}>
                {action.type === "link" ? (
                  <Link href={action.href} className={action.className}>
                    {action.label}
                  </Link>
                ) : (
                  <Link href={action.href} className={action.className}>
                    <Icon
                      icon={action.icon!}
                      className="w-6 h-6 text-gray-700"
                    />
                    {action.hasNotification && action.notificationCount && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {action.notificationCount}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1"
          >
            <Icon
              icon="material-symbols:menu"
              className="w-6 h-6 text-gray-700"
            />
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        {/* Main Header */}
        <div className="flex items-center justify-between px-16 py-4">
          {/* Logo */}
          <Logo variant="dark" />

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <CustomInput
                type="text"
                placeholder="Search for brand, item..."
                icon="material-symbols:search"
                iconPosition="left"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent bg-gray-50"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-6">
            {headerActions.map((action, index) => (
              <div key={index}>
                {action.type === "link" ? (
                  <Link href={action.href} className={action.className}>
                    {action.label}
                  </Link>
                ) : (
                  <Link href={action.href} className={action.className}>
                    <Icon
                      icon={action.icon!}
                      className="w-6 h-6 text-gray-700"
                    />
                    {action.hasNotification && action.notificationCount && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {action.notificationCount}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}

            <CustomButton
              variant="default"
              className="bg-[#38BDF8] hover:bg-[#2abdfc] text-white px-6 py-2.5 rounded-md font-medium transition-colors"
            >
              Get started
            </CustomButton>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="bg-white">
          <div className="px-16 py-2">
            <div className="flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-700 hover:text-black transition-colors group py-2"
                >
                  <span className="text-sm font-medium">{item.name}</span>
                  {item.hasDropdown && (
                    <Icon
                      icon="mdi:arrow-up"
                      className="w-4 h-4 rotate-45 group-hover:rotate-90 transition-transform"
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="bg-white w-80 h-full flex flex-col">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-lg font-semibold">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
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
                className="w-full bg-gray-50"
              />
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center justify-between py-3 px-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="font-medium">{item.name}</span>
                    {item.hasDropdown && (
                      <Icon
                        icon="material-symbols:chevron-right"
                        className="w-5 h-5"
                      />
                    )}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Mobile Bottom Actions */}
            <div className="p-4 border-t bg-gray-50">
              <CustomButton
                variant="default"
                className="w-full bg-[#38BDF8] hover:bg-[#2abdfc] text-white py-3 rounded-md font-medium mb-4 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get started
              </CustomButton>

              <div className="text-center">
                <span className="text-sm text-gray-500">
                  Already have an account?{" "}
                </span>
                <Link
                  href="/auth/login"
                  className="text-sm text-[#38BDF8] font-medium hover:underline"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export { Header };
