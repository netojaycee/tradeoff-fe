"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { CustomInput } from "../custom/CustomInput";
import Image from "next/image";
import { Logo } from "./Logo";

interface FooterLink {
  name: string;
  href: string;
}

interface SocialLink {
  icon: string;
  href: string;
  className: string;
  label: string;
}

const Footer: React.FC = () => {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription logic here
  };

  // Social media links
  const socialLinks: SocialLink[] = [
    {
      icon: "mdi:instagram",
      href: "#",
      className: "w-7 p-1 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform",
      label: "Follow us on Instagram"
    },
    {
      icon: "ic:baseline-tiktok",
      href: "#",
      className: "w-7 p-1 h-7 bg-black border border-gray-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform",
      label: "Follow us on TikTok"
    },
    {
      icon: "fa6-brands:x-twitter",
      href: "#",
      className: "w-7 p-1 h-7 bg-black border border-gray-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform",
      label: "Follow us on X (Twitter)"
    },
    {
      icon: "mdi:facebook",
      href: "#",
      className: "w-7 p-1 h-7 bg-blue-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform",
      label: "Follow us on Facebook"
    }
  ];

  // Quick links
  const quickLinks: FooterLink[] = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Sell an item", href: "/sell" },
    { name: "My account", href: "/account" },
    { name: "Cart", href: "/cart" }
  ];

  // Support links
  const supportLinks: FooterLink[] = [
    { name: "Help center", href: "/help" },
    { name: "Contact us", href: "/contact" },
    { name: "Shipping & Returns", href: "/shipping" },
    { name: "FAQs", href: "/faq" }
  ];

  // Legal links
  const legalLinks: FooterLink[] = [
    { name: "Seller policy", href: "/seller-policy" },
    { name: "Privacy policy", href: "/privacy" },
    { name: "Terms & conditions", href: "/terms" },
    { name: "Cookies", href: "/cookies" }
  ];

  return (
    <footer className="bg-black text-white">
      {/* Hero Image Section - Replace /footer.png with your community/lifestyle image */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <Image
          src="/footer-hero.png"
          alt="TradeOff Community"
          fill
          className="hidden md:block object-cover object-center"
        />
         <Image
          src="/footer-hero-mobile.png"
          alt="TradeOff Community"
          fill
          className="md:hidden object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white/80">#tradeoff</h2>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="px-4 md:px-20 py-8 md:py-12">
        {/* Mobile: Follow Us Section */}
        <div className="md:hidden mb-8">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-white">
              FOLLOW US
            </h3>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={social.className}
                  aria-label={social.label}
                >
                  <Icon icon={social.icon} className="w-6 h-6 text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block space-y-8">
          {/* Row 1: FOLLOW US and Newsletter */}
          <div className="flex w-full items-start">
            <div className="space-y-4 flex-1 underline underline-offset-4"><h3 className="text-lg font-semibold text-white">
              FOLLOW US
            </h3>
              {/* Row 2: Social Icons */}
          <div className="flex space-x-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className={social.className}
                aria-label={social.label}
              >
                <Icon icon={social.icon} className="w-6 h-6 text-white" />
              </a>
            ))}
          </div></div>
          <div className="flex-1">
              <p className="text-gray-300 mb-4 text-sm">
                Subscribe to our newsletter & get 10% discount
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex">
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
                    className="bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:border-[#38BDF8] focus:ring-[#38BDF8]/20 rounded-none"
                  />
                </div>
              </form>
            </div>
          </div>

        

          {/* Row 3: Logo and Links */}
          <div className="flex w-full items-start">
            <div className="space-y-6 flex-1">
              <Logo variant='light' />
              {/* Row 4: Disclaimer */}
          <div className="max-w-md">
            <p className="text-gray-400 text-sm leading-relaxed">
              TradeOff has no association and/or affiliation with the brands
              whose items are offered for sale on its website. All
              authentication services are performed independently by TradeOff.
            </p>
          </div>

          {/* Row 5: Legal Links */}
          <div className="flex gap-6 text-sm">
            {legalLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Row 6: Copyright */}
          <div className="text-gray-500 text-sm">
            <p>©2025 TradeOff. All rights reserved.</p>
          </div>
          </div>
            <div className="grid grid-cols-2 gap-16 flex-1">
              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold mb-6 text-white">
                  QUICK LINKS
                </h3>
                <ul className="space-y-3">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support/Help */}
              <div>
                <h3 className="text-lg font-semibold mb-6 text-white">
                  SUPPORT / HELP
                </h3>
                <ul className="space-y-3">
                  {supportLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-8">
          {/* Newsletter Section */}
          <div>
            <p className="text-gray-300 mb-6 text-sm">
              Subscribe to our newsletter & get 10% discount
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex max-w-lg">
              <div className="flex-1">
                <CustomInput
                  button={{
                    text: "Subscribe",
                    onClick: () => {},
                    variant: "default",
                    loading: false,
                    className: "rounded-none"
                  }}
                  type="email"
                  placeholder="Enter your email address"
                  className="rounded-none bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:border-[#38BDF8] focus:ring-[#38BDF8]/20"
                />
              </div>
            </form>
          </div>

          {/* Links Section */}
          <div className="grid gap-8">
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">
                QUICK LINKS
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support/Help */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">
                SUPPORT / HELP
              </h3>
              <ul className="space-y-3">
                {supportLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Logo */}
         <Logo variant='light' />

          {/* Disclaimer */}
          <div>
            <p className="text-gray-400 text-sm leading-relaxed">
              TradeOff has no association and/or affiliation with the brands
              whose items are offered for sale on its website. All
              authentication services are performed independently by TradeOff.
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap gap-4 text-sm">
            {legalLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
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
