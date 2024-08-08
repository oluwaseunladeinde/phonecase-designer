import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios';
import { Metadata } from 'next';

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

export const formatNaira = (value: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2, // Ensures two decimal places
  }).format(value);
}

export const convertToNaira = (dollars: number): number => {
  const exchangeRate = 1_575
  const nairaEquivalent = (dollars * exchangeRate);
  return nairaEquivalent;
}

export const convertToNairaWithCurrency = (dollars: number): string => {
  const exchangeRate = 1_575
  const nairaEquivalent = formatNaira(dollars * exchangeRate);
  return nairaEquivalent;
}

export const convertDollarToNaira = async (dollars: number): Promise<number> => {
  try {
    const response = await axios.get('https://api.example.com/exchange-rate'); // Replace with your exchange rate API endpoint
    const exchangeRate = response.data.rate; // Assuming the API response has a 'rate' property

    const nairaEquivalent = dollars * exchangeRate;
    return nairaEquivalent;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    throw error; // Re-throw the error for proper error handling
  }
};

// Example usage:
// const dollars = 100;
// convertDollarToNaira(dollars)
//   .then(naira => console.log(`$${dollars} is equivalent to ₦${naira}`))
//   .catch(error => console.error(error));

export function constructMetadata({
  title = 'PhoneCase Designer - custom high-quality phone cases',
  description = 'Create custom high-quality phone cases in seconds',
  image = '/thumbnail.png',
  icons = '/favicon.ico',
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@joshtriedcoding',
    },
    icons,
    metadataBase: new URL("https://phonecase-designer.vercel.app/")
  }
}