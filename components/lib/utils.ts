// File: lib/utils.ts

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const SOL_MINT: string = 'So11111111111111111111111111111111111111112';
export const USDC_MINT: string = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
export const SOL_SYMBOL: string = 'SOL';
export const USDC_SYMBOL: string = 'USDC';
export const SOL_DECIMAL = 9;
export const USDC_DECIMAL = 6;