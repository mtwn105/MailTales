import { type ClassValue, clsx } from "clsx"
import { sanitize } from "dompurify";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function sanitizeHTML(html: string) {
  return sanitize(html);
}