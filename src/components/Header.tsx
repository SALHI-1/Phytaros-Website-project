"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronRight,
  Menu,
  MessageCircle,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
} from "motion/react";
import { SITE_CONFIG, formatPriceMad } from "@/config/site";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { totalItems, totalMad, isCartOpen, openCart, openInquiry } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string>("");

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });

  // Track active section in viewport for header pill highlight
  useEffect(() => {
    const ids = SITE_CONFIG.navigation.map((n) => n.href.replace("#", ""));
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveHref(`#${visible[0].target.id}`);
        }
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll & close on Escape when left mobile drawer is open
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-forest/92 backdrop-blur-md border-b border-white/10 px-4 sm:px-8">
        <nav
          aria-label="Main"
          className="mx-auto flex min-h-[68px] sm:min-h-[72px] max-w-[1136px] items-center justify-between gap-3 py-2.5 sm:py-3"
        >
          {/* Left group: mobile menu trigger on far left + brand */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label="Open navigation menu"
              className="inline-flex md:hidden h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-on-forest-muted/35 bg-forest-raised/80 text-on-forest hover:border-lime hover:text-lime transition-colors cursor-pointer"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>

            <a
              href="#top"
              onClick={() => setActiveHref("")}
              className="flex items-center text-on-forest font-display text-xl sm:text-2xl font-bold tracking-tight no-underline hover:opacity-90 transition-opacity"
            >
              {SITE_CONFIG.brand.name}
            </a>
          </div>

          {/* Desktop navigation with animated active indicator */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <div className="flex items-center gap-1 mr-3">
              {SITE_CONFIG.navigation.map((link) => {
                const isActive = activeHref === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`relative inline-flex min-h-[40px] items-center rounded-full px-3.5 text-[15px] transition-colors no-underline ${
                      isActive
                        ? "text-lime font-medium"
                        : "text-on-forest/85 hover:text-on-forest"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="header-active-pill"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                        className="absolute inset-0 rounded-full bg-white/10 border border-lime/25"
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </a>
                );
              })}
            </div>

            <button
              type="button"
              onClick={openCart}
              aria-label={`Open pre-order cart (${totalItems} items)`}
              className="relative inline-flex min-h-[44px] items-center gap-2 rounded-[12px] border border-white/15 bg-forest-raised/85 px-3.5 text-sm font-semibold text-on-forest hover:border-lime/70 hover:text-lime transition-colors cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              <span>Cart</span>
              <AnimatePresence mode="popLayout">
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-lime px-1.5 font-mono text-xs font-bold text-on-lime"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <a
              href="#catalog"
              className="inline-flex min-h-[44px] items-center rounded-[12px] bg-lime px-5 text-[15px] font-semibold text-on-lime hover:bg-lime-hover active:scale-[0.98] transition-all no-underline"
            >
              Pre-order
            </a>
          </div>

          {/* Mobile right action: Cart button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open pre-order cart (${totalItems} items)`}
              className="relative inline-flex h-11 items-center gap-1.5 rounded-[12px] border border-white/15 bg-forest-raised px-3.5 text-sm font-semibold text-on-forest hover:border-lime transition-colors cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              <span>Cart</span>
              <AnimatePresence mode="popLayout">
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-lime px-1.5 font-mono text-xs font-bold text-on-lime"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>

        {/* Subtle scroll progress bar */}
        <motion.div
          style={{ scaleX }}
          className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-water-bright via-lime to-lime"
        />
      </header>

      {/* Mobile Left Slide-In Drawer — occupies 3/4 (75%) of the viewport width */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            className="fixed inset-0 z-50 flex md:hidden"
          >
            {/* Backdrop over the remaining 1/4 of the screen */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-ink/65 backdrop-blur-[3px]"
            />

            {/* Left drawer panel: 3/4 width */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 36 }}
              className="relative z-10 flex h-[100dvh] w-3/4 flex-col bg-forest text-on-forest shadow-2xl border-r border-white/10"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <a
                  href="#top"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center font-display text-xl font-bold text-on-forest no-underline"
                >
                  {SITE_CONFIG.brand.name}
                </a>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/15 bg-forest-raised text-on-forest hover:border-lime hover:text-lime transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto px-4 py-5">
                <p className="m-0 mb-2 px-2 text-[11px] font-semibold tracking-[0.08em] text-lime uppercase">
                  NAVIGATION
                </p>
                <div className="flex flex-col gap-1">
                  {SITE_CONFIG.navigation.map((link) => {
                    const isActive = activeHref === link.href;
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex min-h-[48px] items-center justify-between rounded-[12px] px-3 text-base font-medium transition-colors no-underline ${
                          isActive
                            ? "bg-white/10 text-lime border border-lime/25"
                            : "text-on-forest hover:bg-forest-raised hover:text-lime"
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronRight
                          className={`h-4 w-4 ${
                            isActive ? "text-lime" : "text-on-forest-muted"
                          }`}
                          aria-hidden="true"
                        />
                      </a>
                    );
                  })}
                </div>

                {/* Pre-order quick reassurance */}
                <div className="mt-6 rounded-[14px] bg-forest-raised border border-white/10 p-4 text-xs leading-relaxed text-on-forest-muted flex flex-col gap-2">
                  <p className="m-0 flex items-center gap-2 text-on-forest font-medium">
                    <Truck
                      className="h-3.5 w-3.5 text-lime shrink-0"
                      aria-hidden="true"
                    />
                    Delivery included · Pay on delivery
                  </p>
                  <p className="m-0 flex items-center gap-2">
                    <MessageCircle
                      className="h-3.5 w-3.5 text-lime shrink-0"
                      aria-hidden="true"
                    />
                    Confirmed on WhatsApp
                  </p>
                </div>
              </div>

              {/* Drawer Footer CTAs */}
              <div className="flex flex-col gap-2.5 border-t border-white/10 bg-forest/80 px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                <a
                  href="#catalog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[12px] bg-lime px-5 text-base font-semibold text-on-lime hover:bg-lime-hover transition-all no-underline"
                >
                  Choose your tower
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openCart();
                    }}
                    className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-[12px] border border-white/15 bg-forest-raised px-3 text-sm font-semibold text-on-forest cursor-pointer"
                  >
                    <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                    Cart{totalItems > 0 ? ` (${totalItems})` : ""}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openInquiry("general");
                    }}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-[12px] border border-white/15 px-3 text-sm font-semibold text-on-forest cursor-pointer"
                  >
                    Contact us
                  </button>
                </div>

                <p className="m-0 pt-1 text-center font-mono text-[11px] text-on-forest-muted">
                  Tangier · Barcelona
                </p>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Floating Pre-Order Cart Bar (appears when items > 0) */}
      <AnimatePresence>
        {totalItems > 0 && !isCartOpen && !mobileMenuOpen && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
            className="fixed bottom-4 inset-x-4 z-30 md:hidden"
          >
            <button
              type="button"
              onClick={openCart}
              className="flex w-full items-center justify-between rounded-[16px] bg-forest border border-lime/40 px-4 py-3.5 text-on-forest cursor-pointer active:scale-[0.99] transition-transform"
            >
              <span className="flex items-center gap-2.5 text-sm font-semibold">
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-lime px-1.5 font-mono text-xs font-bold text-on-lime">
                  {totalItems}
                </span>
                <span>Pre-order cart</span>
              </span>
              <span className="flex items-center gap-2 font-mono text-sm font-semibold text-lime">
                {formatPriceMad(totalMad)}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
