import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number): string => {
  // Check if the number already has decimal places
  const hasDecimals = price % 1 !== 0;
  
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: hasDecimals ? 0 : 2,
    maximumFractionDigits: 2,
  })
    .format(price)
    .replace("NGN", "₦"); // Replace NGN with ₦ symbol
};
