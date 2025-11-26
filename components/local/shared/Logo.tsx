"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "light" | "dark";
  clickable?: boolean;
  href?: string;
  className?: string;
  priority?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  variant = "dark",
  clickable = true,
  href = "/",
  className,
  priority = false,
}) => {
  const logoSrc = variant === "light" ? "/logo-white.png" : "/logo-black.png";

  const image = (
    <div className={cn("relative shrink-0 w-[94px] h-8 md:w-[169px] md:h-12", className)}>
      <Image
        src={logoSrc}
        alt="TradeOff Logo"
        fill
        sizes="(max-width: 768px) 94px, 169px"
        priority={priority}
        className="object-contain"
      />
    </div>
  );

  if (!clickable) return image;

  return (
    <Link href={href} className="inline-block transition-opacity hover:opacity-80" aria-label="TradeOff Homepage">
      {image}
    </Link>
  );
};

export { Logo };