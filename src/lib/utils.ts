import { STORAGE_KEY, DEMO_JSON } from "./constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utilities ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nowIso = () => new Date().toISOString();

export const twoYearsAgo = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 2);
  return d;
};

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEMO_JSON;
}

export function saveState(state: any) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
