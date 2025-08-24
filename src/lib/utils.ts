import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Nepali currency formatting utility
export function formatNepaliCurrency(amount: number): string {
  // Convert to string and split by decimal point
  const [wholePart, decimalPart] = Math.abs(amount).toString().split('.')
  
  // Add commas for Indian numbering system (Lakhs and Crores)
  let formattedWhole = wholePart
  if (wholePart.length > 3) {
    formattedWhole = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  
  // Add decimal part if it exists
  const formattedAmount = decimalPart ? `${formattedWhole}.${decimalPart}` : formattedWhole
  
  // Add Nepali Rupees symbol and sign
  const sign = amount < 0 ? '-' : ''
  return `${sign}रु ${formattedAmount}`
}

// Format large numbers using Indian numbering system
export function formatIndianNumber(num: number): string {
  if (num >= 10000000) {
    // Crores
    return (num / 10000000).toFixed(2) + ' Crore'
  } else if (num >= 100000) {
    // Lakhs
    return (num / 100000).toFixed(2) + ' Lakh'
  } else {
    // Thousands and below
    return num.toLocaleString('en-IN')
  }
}
