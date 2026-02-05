import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ensureDate(value: Date | string | number | undefined | null): Date {
  if (!value) return new Date();
  
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? new Date() : value;
  }
  
  const date = new Date(value);
  return isNaN(date.getTime()) ? new Date() : date;
}

export function safeParseDate(value: any): Date {
  return ensureDate(value);
}
