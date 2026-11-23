"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { InquiryModal } from "@/components/InquiryModal";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>
        {children}
        <CartDrawer />
        <InquiryModal />
      </CartProvider>
    </MotionConfig>
  );
}
