import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios';

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
  const exchangeRate = 1_601
  const nairaEquivalent = (dollars * exchangeRate);
  return nairaEquivalent;
}

export const convertToNairaWithCurrency = (dollars: number): string => {
  const exchangeRate = 1_601
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

