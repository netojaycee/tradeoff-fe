"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * TradeOff Logo Component - Responsive by default
 * 
 * Automatically sizes: Mobile (94x32px) → Desktop (169x48px)
 * 
 * Usage Examples:
 * <Logo variant="light" />          // White logo for dark backgrounds
 * <Logo variant="dark" />           // Black logo for light backgrounds  
 * <Logo clickable={false} />        // Non-clickable logo
 * <Logo href="/custom-link" />      // Custom link destination
 */

interface LogoProps {
  /** Theme variant - determines which logo to show */
  variant?: "light" | "dark";
  /** Whether the logo should be clickable (wraps in Link) */
  clickable?: boolean;
  /** Custom href for the link (defaults to "/") */
  href?: string;
  /** Additional CSS classes */
  className?: string;
  /** Priority loading for above-the-fold logos */
  priority?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  variant = "dark",
  clickable = true,
  href = "/",
  className,
  priority = false,
}) => {
  // Determine logo source based on variant
  const logoSrc = variant === "light" ? "/logo-white.png" : "/logo-black.png";

  const logoElement = (
    <div className={cn(
      "relative shrink-0",
      // Mobile: 94x32px, Desktop: 169x48px (Figma measurements)
      "w-[94px] h-8 md:w-[169px] md:h-12",
      className
    )}>
      <Image
        src={logoSrc}
        alt="TradeOff Logo"
        fill
        priority={priority}
        className="object-contain"
        sizes="(max-width: 768px) 94px, 169px"
      />
    </div>
  );

  // Return clickable or non-clickable version
  if (clickable) {
    return (
      <Link 
        href={href} 
        className="inline-block transition-opacity hover:opacity-80"
        aria-label="TradeOff Homepage"
      >
        {logoElement}
      </Link>
    );
  }

  return logoElement;
};

export { Logo };