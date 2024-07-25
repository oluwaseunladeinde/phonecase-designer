import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  return formatter.format(price)
}

export const formatNaira = (value: number) => {
  const nairaSymbol = "\u{020A6}";
  return nairaSymbol + new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}