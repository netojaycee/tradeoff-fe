"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { CustomInput } from "./CustomInput";
import Image from "next/image";

const Footer: React.FC = () => {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription logic here
  };

  return (
    <footer className="bg-black text-white">
          {/* Top Section - Hero Image and Follow Section */}
        <div className="mb-8 md:mb-12">
          {/* TradeOff Hero Section with Background Images */}
          <div className="relative h-32 md:h-48 mb-8 rounded-lg overflow-hidden">
            {/* Background collage of images */}
            {/* <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30">
              <div className="grid grid-cols-6 md:grid-cols-8 h-full opacity-50">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-gray-600 border border-gray-700"></div>
                ))}
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-4xl md:text-6xl font-bold text-white">#tradeoff</h2>
            </div> */}
            <Image
              src="/footer.png"
              alt="TradeOff Hero"
              fill
              className="object-cover object-center"
            />
          </div>

         
        </div>
      {/* Main Footer Content */}
      <div className="container mx-auto py-4 md:py-12 px-4">
       {/* Follow Us Section */}
          <div className="mb-4 ">
            <div className="flex items-center justify-between">
              {" "}
              <h3 className="text-lg md:text-xl font-semibold mb-4">
                FOLLOW US
              </h3>
              <div className="flex space-x-4 mb-4">
                <a
                  href="#"
                  className="w-8 h-8 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Follow us on Instagram"
                >
                  <Icon icon="mdi:instagram" className="w-6 h-6 text-white" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-black border border-gray-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Follow us on TikTok"
                >
                  <Icon
                    icon="ic:baseline-tiktok"
                    className="w-6 h-6 text-white"
                  />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-black border border-gray-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Follow us on X (Twitter)"
                >
                  <Icon
                    icon="fa6-brands:x-twitter"
                    className="w-6 h-6 text-white"
                  />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Follow us on Facebook"
                >
                  <Icon icon="mdi:facebook" className="w-6 h-6 text-white" />
                </a>
              </div>
            </div>
          </div>

        <div className="flex items-center md:flex-row flex-col gap-5 md:gap-20">
          {/* Newsletter Subscription */}
          <div className="w-full">
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter & get 10% discount
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex gap-0 max-w-md"
            >
              <div className="flex-1">
                <CustomInput
                  button={{
                    text: "Subscribe",
                    onClick: () => {},
                    variant: "default",
                    loading: false,
                  }}
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:border-primary"
                />
              </div>
            </form>
          </div>
          {/* Links Sections */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8 w-full">
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">
                QUICK LINKS
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sell"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Sell an item
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    My account
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cart"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Cart
                  </Link>
                </li>
              </ul>
            </div>
            {/* Mobile: Third column hidden, Desktop: Empty for spacing */}
            <div className="hidden md:block"></div>

            {/* Support/Help */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">
                SUPPORT / HELP
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/help"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Help center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Contact us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>
        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 px-4">
          {/* Logo */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              TradeOff.
            </h2>
          </div>

          {/* Disclaimer */}
          <div className="mb-6">
            <p className="text-gray-400 text-sm leading-relaxed">
              TradeOff has no association and/or affiliation with the brands
              whose items are offered for sale on its website. All
              authentication services are performed independently by TradeOff.
            </p>
          </div>

          {/* Legal Links */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 md:gap-6 text-sm">
              <Link
                href="/seller-policy"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Seller policy
              </Link>
              <Link
                href="/privacy"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Privacy policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Terms & conditions
              </Link>
              <Link
                href="/cookies"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-gray-500 text-sm">
            <p>©2025 TradeOff. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
