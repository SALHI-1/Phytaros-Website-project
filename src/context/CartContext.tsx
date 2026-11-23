"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SITE_CONFIG, getProductById, type ProductId } from "@/config/site";

export interface CartItem {
  productId: ProductId;
  quantity: number;
}

export type InquiryModalType =
  | "smartcap-waitlist"
  | "farming-as-a-service"
  | "general"
  | null;

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalMad: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: ProductId, openDrawer?: boolean) => void;
  updateQuantity: (productId: ProductId, quantity: number) => void;
  removeItem: (productId: ProductId) => void;
  clearCart: () => void;
  inquiryModalType: InquiryModalType;
  openInquiry: (type: Exclude<InquiryModalType, null>) => void;
  closeInquiry: () => void;
}

const SESSION_STORAGE_KEY = "phytaros_preorder_cart_v1";

const CartContext = createContext<CartContextValue | null>(null);

function readSessionCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is CartItem =>
        entry &&
        typeof entry === "object" &&
        (entry.productId === "phytaros-mini" ||
          entry.productId === "phytaros-tower") &&
        typeof entry.quantity === "number" &&
        Number.isInteger(entry.quantity) &&
        entry.quantity >= 1 &&
        entry.quantity <= SITE_CONFIG.preorder.maxQuantityPerItem
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [inquiryModalType, setInquiryModalType] =
    useState<InquiryModalType>(null);

  useEffect(() => {
    setItems(readSessionCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota / privacy mode errors
    }
  }, [items, hydrated]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addItem = useCallback((productId: ProductId, openDrawer = true) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + 1,
                  SITE_CONFIG.preorder.maxQuantityPerItem
                ),
              }
            : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
    if (openDrawer) {
      setIsCartOpen(true);
    }
  }, []);

  const updateQuantity = useCallback(
    (productId: ProductId, quantity: number) => {
      if (quantity <= 0) {
        setItems((prev) => prev.filter((item) => item.productId !== productId));
        return;
      }
      const clamped = Math.min(
        quantity,
        SITE_CONFIG.preorder.maxQuantityPerItem
      );
      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity: clamped } : item
        )
      );
    },
    []
  );

  const removeItem = useCallback((productId: ProductId) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openInquiry = useCallback(
    (type: Exclude<InquiryModalType, null>) => setInquiryModalType(type),
    []
  );
  const closeInquiry = useCallback(() => setInquiryModalType(null), []);

  const { totalItems, totalMad } = useMemo(() => {
    let count = 0;
    let sum = 0;
    for (const item of items) {
      const product = getProductById(item.productId);
      if (!product) continue;
      count += item.quantity;
      sum += product.priceMad * item.quantity;
    }
    return { totalItems: count, totalMad: sum };
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalItems,
      totalMad,
      isCartOpen,
      openCart,
      closeCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      inquiryModalType,
      openInquiry,
      closeInquiry,
    }),
    [
      items,
      totalItems,
      totalMad,
      isCartOpen,
      openCart,
      closeCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      inquiryModalType,
      openInquiry,
      closeInquiry,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
