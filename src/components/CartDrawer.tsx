"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  SITE_CONFIG,
  formatPriceMad,
  getProductById,
} from "@/config/site";
import { useCart } from "@/context/CartContext";

type DrawerStep = "cart" | "checkout" | "confirmed";

const STEPS: Array<{ id: DrawerStep; num: string; label: string }> = [
  { id: "cart", num: "1", label: "Cart" },
  { id: "checkout", num: "2", label: "Details" },
  { id: "confirmed", num: "3", label: "Confirmed" },
];

interface ConfirmationState {
  orderId: string;
  totalMad: number;
  estimatedDelivery: string;
  deliveryMode: "resend" | "dry-run";
  customerEmail: string;
  customerWhatsApp: string;
  items: Array<{
    name: string;
    quantity: number;
    lineTotalMad: number;
  }>;
}

const INPUT_CLASS =
  "h-11 rounded-[10px] border border-line-strong/80 bg-surface-raised px-3.5 text-base text-ink placeholder:text-ink-muted/60 focus:border-water focus:ring-2 focus:ring-water/15 focus:outline-none transition-all";

const TEXTAREA_CLASS =
  "rounded-[10px] border border-line-strong/80 bg-surface-raised p-3 text-base text-ink placeholder:text-ink-muted/60 focus:border-water focus:ring-2 focus:ring-water/15 focus:outline-none transition-all";

export function CartDrawer() {
  const {
    items,
    totalItems,
    totalMad,
    isCartOpen,
    closeCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [step, setStep] = useState<DrawerStep>("cart");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationState | null>(
    null
  );

  const [fullName, setFullName] = useState("");
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot

  useEffect(() => {
    if (isCartOpen && step === "confirmed" && items.length > 0) {
      setStep("cart");
      setConfirmation(null);
    }
  }, [isCartOpen, step, items.length]);

  useEffect(() => {
    if (!isCartOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isCartOpen, closeCart]);

  const handleClose = () => {
    closeCart();
    if (step === "confirmed") {
      window.setTimeout(() => {
        setStep("cart");
        setConfirmation(null);
      }, 250);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/preorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer: {
            fullName,
            whatsappPhone,
            email,
            city,
            address,
            notes,
          },
          website,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(
          data.error || "Please check your details and try again."
        );
        return;
      }

      setConfirmation({
        orderId: data.orderId,
        totalMad: data.totalMad,
        estimatedDelivery: data.estimatedDelivery,
        deliveryMode: data.deliveryMode,
        customerEmail: email,
        customerWhatsApp: whatsappPhone,
        items: data.items,
      });
      clearCart();
      setFullName("");
      setWhatsappPhone("");
      setEmail("");
      setCity("");
      setAddress("");
      setNotes("");
      setStep("confirmed");
    } catch {
      setErrorMessage(
        "Network error while submitting your pre-order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const currentStepIdx = STEPS.findIndex((s) => s.id === step);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Pre-order cart"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 bg-ink/60 backdrop-blur-[3px]"
          />

          {/* Slide-over panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 36 }}
            className="relative z-10 flex h-[100dvh] w-full max-w-[460px] flex-col bg-surface-raised text-ink shadow-2xl"
          >
            {/* Header */}
            <div className="border-b border-line px-4 sm:px-6 pt-4 pb-3.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {step === "checkout" && (
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage(null);
                        setStep("cart");
                      }}
                      aria-label="Back to cart"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line hover:bg-ground cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                  <div>
                    <h2 className="m-0 font-display text-xl font-semibold text-ink">
                      {step === "cart" && `Pre-order cart (${totalItems})`}
                      {step === "checkout" && "Delivery details"}
                      {step === "confirmed" && "Pre-order confirmed"}
                    </h2>
                    {step !== "confirmed" && (
                      <p className="m-0 text-xs text-ink-muted">
                        No account needed · Pay on delivery
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close cart"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-line text-ink hover:bg-ground cursor-pointer"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* 3-Step Visual Progress Indicator */}
              <ol
                aria-label="Pre-order progress"
                className="mt-3.5 grid grid-cols-3 gap-2 list-none p-0 m-0"
              >
                {STEPS.map((s, idx) => {
                  const isDone = idx < currentStepIdx;
                  const isActive = idx === currentStepIdx;
                  return (
                    <li
                      key={s.id}
                      className={`flex items-center gap-1.5 rounded-[10px] px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                        isActive
                          ? "bg-forest text-lime"
                          : isDone
                            ? "bg-leaf-soft text-lime-ink"
                            : "bg-ground text-ink-muted"
                      }`}
                    >
                      <span
                        className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full font-mono text-[10px] ${
                          isActive
                            ? "bg-lime text-on-lime"
                            : isDone
                              ? "bg-lime-ink text-white"
                              : "bg-line text-ink-muted"
                        }`}
                      >
                        {isDone ? (
                          <Check className="h-2.5 w-2.5" aria-hidden="true" />
                        ) : (
                          s.num
                        )}
                      </span>
                      <span className="truncate">{s.label}</span>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
              {/* STEP 1: CART */}
              {step === "cart" && (
                <>
                  {items.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-4 py-12 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-sunk text-water">
                        <ShoppingBag className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="m-0 font-display text-xl font-semibold text-ink">
                          Your pre-order cart is empty
                        </p>
                        <p className="m-0 max-w-xs text-sm text-ink-muted">
                          Choose Phytaros Mini or Phytaros Tower to reserve your
                          hydroponic tower.
                        </p>
                      </div>
                      <div className="mt-2 flex flex-wrap justify-center gap-2">
                        {SITE_CONFIG.products.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => addItem(product.id, false)}
                            className="inline-flex min-h-[42px] items-center rounded-[10px] border border-line-strong bg-ground px-4 text-sm font-semibold text-ink hover:border-forest cursor-pointer"
                          >
                            + {product.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {items.map((item) => {
                        const product = getProductById(item.productId);
                        if (!product) return null;
                        return (
                          <div
                            key={item.productId}
                            className="flex flex-col gap-3 rounded-[16px] border border-line bg-ground p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="m-0 font-display text-lg font-semibold text-ink">
                                  {product.name}
                                </p>
                                <p className="m-0 font-mono text-xs text-water">
                                  {product.blocks} BLOCKS · {product.plantSites}{" "}
                                  PLANT SITES
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeItem(item.productId)}
                                aria-label={`Remove ${product.name}`}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-sunk hover:text-danger cursor-pointer"
                              >
                                <Trash2
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <div className="inline-flex items-center rounded-[10px] border border-line bg-surface-raised">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.productId,
                                      item.quantity - 1
                                    )
                                  }
                                  aria-label={`Decrease ${product.name} quantity`}
                                  className="inline-flex h-9 w-9 items-center justify-center text-ink hover:bg-ground rounded-l-[10px] cursor-pointer"
                                >
                                  <Minus
                                    className="h-3.5 w-3.5"
                                    aria-hidden="true"
                                  />
                                </button>
                                <span className="min-w-8 text-center font-mono text-sm font-semibold">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.productId,
                                      item.quantity + 1
                                    )
                                  }
                                  aria-label={`Increase ${product.name} quantity`}
                                  className="inline-flex h-9 w-9 items-center justify-center text-ink hover:bg-ground rounded-r-[10px] cursor-pointer"
                                >
                                  <Plus
                                    className="h-3.5 w-3.5"
                                    aria-hidden="true"
                                  />
                                </button>
                              </div>

                              <p className="m-0 font-mono text-base font-semibold text-ink">
                                {formatPriceMad(
                                  product.priceMad * item.quantity
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })}

                      {/* Order conditions info box */}
                      <div className="mt-2 flex flex-col gap-2 rounded-[16px] border border-lime-ink/15 bg-leaf-soft/75 p-4 text-sm text-ink">
                        <p className="m-0 flex items-center gap-2 font-medium">
                          <Truck
                            className="h-4 w-4 text-lime-ink shrink-0"
                            aria-hidden="true"
                          />
                          {SITE_CONFIG.preorder.deliveryLabel}
                        </p>
                        <p className="m-0 flex items-center gap-2">
                          <Clock
                            className="h-4 w-4 text-lime-ink shrink-0"
                            aria-hidden="true"
                          />
                          Estimated delivery:{" "}
                          {SITE_CONFIG.preorder.estimatedDelivery}
                        </p>
                        <p className="m-0 flex items-center gap-2">
                          <MessageCircle
                            className="h-4 w-4 text-lime-ink shrink-0"
                            aria-hidden="true"
                          />
                          {SITE_CONFIG.preorder.paymentLabel} · Confirmed via
                          WhatsApp
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* STEP 2: CHECKOUT FORM */}
              {step === "checkout" && (
                <form
                  id="preorder-checkout-form"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4"
                >
                  <div className="rounded-[14px] border border-line bg-ground px-4 py-3 text-sm">
                    <div className="flex items-center justify-between font-semibold text-ink">
                      <span>
                        {totalItems} {totalItems === 1 ? "tower" : "towers"} ·
                        Delivery included
                      </span>
                      <span className="font-mono">
                        {formatPriceMad(totalMad)}
                      </span>
                    </div>
                    <p className="m-0 mt-1 text-xs text-ink-muted">
                      Est. delivery: {SITE_CONFIG.preorder.estimatedDelivery}
                    </p>
                  </div>

                  {errorMessage && (
                    <div
                      role="alert"
                      className="rounded-[12px] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
                    >
                      {errorMessage}
                    </div>
                  )}

                  {/* Honeypot field */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="preorder-website">Website</label>
                    <input
                      id="preorder-website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="fullName"
                      className="text-sm font-semibold text-ink"
                    >
                      Full name *
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="e.g. Youssef El Amrani"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="whatsappPhone"
                      className="text-sm font-semibold text-ink"
                    >
                      WhatsApp phone number *
                    </label>
                    <input
                      id="whatsappPhone"
                      name="whatsappPhone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="+212 6XX XXX XXX"
                      value={whatsappPhone}
                      onChange={(e) => setWhatsappPhone(e.target.value)}
                      className={INPUT_CLASS}
                    />
                    <p className="m-0 text-xs text-ink-muted">
                      We will contact you on this WhatsApp number to confirm
                      your pre-order.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-ink"
                    >
                      Email address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={INPUT_CLASS}
                    />
                    <p className="m-0 text-xs text-ink-muted">
                      Used to send your pre-order confirmation receipt.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="city"
                      className="text-sm font-semibold text-ink"
                    >
                      City *
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      autoComplete="address-level2"
                      placeholder="e.g. Tangier, Casablanca, Rabat..."
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="address"
                      className="text-sm font-semibold text-ink"
                    >
                      Delivery address *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      required
                      rows={2}
                      autoComplete="street-address"
                      placeholder="Street, building, apartment..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={TEXTAREA_CLASS}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="notes"
                      className="text-sm font-semibold text-ink"
                    >
                      Notes (optional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={2}
                      placeholder="Preferred delivery times or questions..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className={TEXTAREA_CLASS}
                    />
                  </div>
                </form>
              )}

              {/* STEP 3: CONFIRMED */}
              {step === "confirmed" && confirmation && (
                <div className="flex flex-col gap-5 py-4">
                  <div className="flex items-center gap-3 text-lime-ink">
                    <CheckCircle2
                      className="h-8 w-8 shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="m-0 font-mono text-xs font-semibold tracking-[0.08em] uppercase">
                        ORDER {confirmation.orderId}
                      </p>
                      <h3 className="m-0 font-display text-2xl font-bold text-ink">
                        Pre-order received!
                      </h3>
                    </div>
                  </div>

                  <div className="rounded-[16px] border border-lime-ink/15 bg-leaf-soft p-4 text-sm leading-relaxed text-ink">
                    <p className="m-0 font-semibold">What happens next?</p>
                    <p className="m-0 mt-1">
                      We have sent a confirmation email to{" "}
                      <strong>{confirmation.customerEmail}</strong>. Our team
                      will contact you on WhatsApp (
                      <strong>{confirmation.customerWhatsApp}</strong>) as soon
                      as possible to confirm your pre-order and coordinate
                      delivery.
                    </p>
                  </div>

                  <div className="rounded-[16px] border border-line bg-ground p-4 text-sm">
                    <p className="m-0 mb-2 font-mono text-xs font-semibold text-ink-muted">
                      PRE-ORDER SUMMARY
                    </p>
                    <div className="flex flex-col gap-2">
                      {confirmation.items.map((item) => (
                        <div
                          key={item.name}
                          className="flex justify-between text-ink"
                        >
                          <span>
                            {item.quantity}&times; {item.name}
                          </span>
                          <span className="font-mono font-semibold">
                            {formatPriceMad(item.lineTotalMad)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-between border-t border-line pt-3 font-semibold text-ink">
                      <span>Total (Delivery included · COD)</span>
                      <span className="font-mono">
                        {formatPriceMad(confirmation.totalMad)}
                      </span>
                    </div>
                    <p className="m-0 mt-2 text-xs text-ink-muted">
                      Estimated delivery: {confirmation.estimatedDelivery}
                    </p>
                  </div>

                  {confirmation.deliveryMode === "dry-run" && (
                    <p className="m-0 rounded-[10px] border border-water/30 bg-water/10 px-3.5 py-2.5 font-mono text-xs text-water">
                      Dev dry-run mode active: emails were logged to the server
                      console because RESEND_API_KEY is not set.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-line bg-surface-raised px-4 sm:px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {step === "cart" && items.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-sm text-ink-muted">
                    <span>Delivery</span>
                    <span className="font-mono font-semibold text-water">
                      INCLUDED
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink">
                      Total (Pay on delivery)
                    </span>
                    <span className="font-mono text-2xl font-semibold text-ink">
                      {formatPriceMad(totalMad)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep("checkout")}
                    className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-[12px] bg-lime px-6 text-base font-semibold text-on-lime hover:bg-lime-hover active:scale-[0.98] transition-all cursor-pointer shadow-[0_6px_18px_rgba(182,236,61,0.28)]"
                  >
                    Continue to pre-order
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              )}

              {step === "checkout" && (
                <button
                  type="submit"
                  form="preorder-checkout-form"
                  disabled={submitting}
                  className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-[12px] bg-lime px-6 text-base font-semibold text-on-lime hover:bg-lime-hover active:scale-[0.98] disabled:opacity-60 transition-all cursor-pointer shadow-[0_6px_18px_rgba(182,236,61,0.28)]"
                >
                  {submitting ? (
                    <>
                      <Loader2
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      Sending pre-order...
                    </>
                  ) : (
                    <>Confirm pre-order ({formatPriceMad(totalMad)})</>
                  )}
                </button>
              )}

              {step === "confirmed" && (
                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex min-h-[48px] w-full items-center justify-center rounded-[12px] bg-forest px-6 text-base font-semibold text-on-forest hover:bg-forest-raised transition-colors cursor-pointer"
                >
                  Back to Phytaros
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
