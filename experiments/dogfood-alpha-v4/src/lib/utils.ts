import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 조건부 className 병합 — Tailwind 충돌 자동 해소.
 * shadcn 표준 패턴.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
