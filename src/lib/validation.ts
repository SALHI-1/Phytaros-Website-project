import { z } from "zod";
import { SITE_CONFIG } from "@/config/site";

export const productIdSchema = z.enum(["phytaros-mini", "phytaros-tower"]);

export const preorderItemSchema = z.object({
  productId: productIdSchema,
  quantity: z
    .number()
    .int()
    .min(1, "Quantity must be at least 1")
    .max(
      SITE_CONFIG.preorder.maxQuantityPerItem,
      `Maximum ${SITE_CONFIG.preorder.maxQuantityPerItem} units per model`
    ),
});

export const preorderSchema = z.object({
  items: z
    .array(preorderItemSchema)
    .min(1, "Your pre-order cart is empty")
    .max(10),
  customer: z.object({
    fullName: z
      .string()
      .trim()
      .min(2, "Please enter your full name")
      .max(120, "Name is too long"),
    whatsappPhone: z
      .string()
      .trim()
      .min(8, "Please enter a valid WhatsApp phone number")
      .max(30, "Phone number is too long")
      .regex(/^[+\d\s().-]+$/, "Please enter a valid phone number"),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .max(160),
    city: z
      .string()
      .trim()
      .min(2, "Please enter your city")
      .max(80),
    address: z
      .string()
      .trim()
      .min(5, "Please enter your delivery address")
      .max(300),
    notes: z.string().trim().max(500).optional().default(""),
  }),
  /** Honeypot field — real users never fill this. */
  website: z.string().max(0).optional().default(""),
});

export type PreorderInput = z.infer<typeof preorderSchema>;

export const inquirySchema = z.object({
  type: z.enum(["smartcap-waitlist", "farming-as-a-service", "general"]),
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(120),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(160),
  whatsappPhone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .default(""),
  organization: z
    .string()
    .trim()
    .max(120)
    .optional()
    .default(""),
  ownsTower: z
    .enum(["phytaros", "other", "none"])
    .optional()
    .default("none"),
  message: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .default(""),
  /** Honeypot field — real users never fill this. */
  website: z.string().max(0).optional().default(""),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

/**
 * Normalizes a phone string into international digits for `https://wa.me/<digits>`.
 * Handles local Moroccan format (e.g. `06XXXXXXXX` -> `2126XXXXXXXX`).
 */
export function normalizeWhatsAppDigits(raw: string): string {
  const trimmed = raw.trim();
  let digits = trimmed.replace(/\D/g, "");

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  } else if (digits.startsWith("0") && digits.length === 10) {
    digits = `212${digits.slice(1)}`;
  }

  return digits;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function generateOrderId(): string {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `PHY-${y}${m}${d}-${rand}`;
}
