"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import { Icon } from "@iconify/react";

// List of routes to exclude from showing breadcrumbs
const EXCLUDED_ROUTES = [
  "/", // homepage
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-otp",
  "/checkout?success",
  // Add more as needed
];

function toTitle(str: string) {
  return str
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  if (!pathname || EXCLUDED_ROUTES.includes(pathname)) return null;

  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="px-4 md:px-16 flex items-center space-x-2 text-sm text-gray-500 my-4" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-gray-900">Home</Link>
      {segments.map((seg, idx) => {
        const path = "/" + segments.slice(0, idx + 1).join("/");
        const isLast = idx === segments.length - 1;
        return (
          <React.Fragment key={path}>
            <Icon icon="tabler:slash" className="w-4 h-4 mx-1" />
            {isLast ? (
              <span className="text-gray-900 font-medium">{toTitle(seg)}</span>
            ) : (
              <Link href={path} className="hover:text-gray-900">{toTitle(seg)}</Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
