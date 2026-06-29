// Single source of truth for public, non-secret configuration.
// Anything shown to the user on the home page lives here.
//
// Vars must be prefixed with NEXT_PUBLIC_ so Next.js exposes them
// to the browser. Server-side vars (no prefix) are read directly in
// their respective modules (lib/googleSheets.ts, proxy.ts).

export const JAZZCASH_PHONE =
  process.env.NEXT_PUBLIC_JAZZCASH_PHONE ?? '000000000000';

export const EASYPAISA_PHONE =
  process.env.NEXT_PUBLIC_EASYPAISA_PHONE ?? '0000000000000';

export const WHATSAPP_PHONE =
  process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? '923308235820';

// Ticket amount options shown on the home page.
// Each entry is the display label (e.g. "20 PKR"). Add, remove, or
// reorder them here to change what users see — no other file needs editing.
export const AMOUNT_OPTIONS = [
  '100 PKR',
  '200 PKR',
  '300 PKR',
  '400 PKR',
  '500 PKR',
] as const;

export type AmountOption = (typeof AMOUNT_OPTIONS)[number];