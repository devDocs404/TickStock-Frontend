import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dummyResponse = {
  data: [],
  pagination: {
    currentPage: "0",
    hasNextPage: false,
    hasPreviousPage: false,
    pageSize: "10",
    totalItems: "0",
    totalPages: "0",
  },
};

export const stockBrokers = [
  { label: "Groww", value: "Groww" },
  { label: "Integrated", value: "Integrated" },
  { label: "Kite", value: "Kite" },
  { label: "Upstox", value: "Upstox" },
  { label: "Zerodha", value: "Zerodha" },
];

export function formatCurrency(value: number | string) {
  return `${new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(value))}`;
}

export function formatDate(value: string) {
  // return new Date(value).toLocaleDateString("en-IN", {
  //   day: "2-digit",
  //   month: "2-digit",
  //   year: "numeric",
  // });
  return dayjs(value).format("DD/MM/YYYY");
}
