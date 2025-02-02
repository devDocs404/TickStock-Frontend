import { type ClassValue, clsx } from 'clsx'
import dayjs from 'dayjs'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const dummyResponse = {
  data: [],
  pagination: {
    currentPage: '0',
    hasNextPage: false,
    hasPreviousPage: false,
    pageSize: '10',
    totalItems: '0',
    totalPages: '0',
  },
}

export const stockBrokers = [
  { label: 'Groww', value: 'Groww' },
  { label: 'Integrated', value: 'Integrated' },
  { label: 'Kite', value: 'Kite' },
  { label: 'Upstox', value: 'Upstox' },
  { label: 'Zerodha', value: 'Zerodha' },
]

export function formatCurrency(value: number | string) {
  return `${new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(Number(value))}`
}

export function formatDate(value: string) {
  return dayjs(value).format('DD/MM/YYYY')
}

// Format numbers with Indian locale (adds commas for thousands, lakhs, etc.) and adds leading zero if less than 10
export function formatQuantity(value: number | string): string {
  const numericValue = parseFloat(value?.toString() || '0')

  if (isNaN(numericValue)) {
    throw new Error('Invalid number input')
  }

  // Add leading zero for numbers less than 10
  const formattedValue =
    numericValue < 10
      ? `0${numericValue}`
      : new Intl.NumberFormat('en-IN').format(numericValue)

  return formattedValue
}
