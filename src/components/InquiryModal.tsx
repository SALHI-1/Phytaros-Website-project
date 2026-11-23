"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCart, type InquiryModalType } from "@/context/CartContext";

const MODAL_COPY: Record<
  Exclude<InquiryModalType, null>,
  { eyebrow: string; title: string; subtitle: string; cta: string }
> = {
  "smartcap-waitlist": {
    eyebrow: "SMARTCAP WAITLIST",
    title: "Be first when SmartCap launches.",
    subtitle:
      "Leave your details and we’ll let you know as soon as SmartCap and the Retrofit kit open for pre-order.",
    cta: "Join waitlist",
  },
  "farming-as-a-service": {
    eyebrow: "FOR BUSINESSES & CAMPUSES",
    title: "Farming-as-a-Service.",
    subtitle:
      "Tell us about your site — restaurants, schools, hotels, or offices — and our team will reach out.",
    cta: "Send request",
  },
  general: {
    eyebrow: "CONTACT PHYTAROS",
    title: "Let’s talk.",
    subtitle:
      "Home grower, commercial partner or investor — drop us a message and we’ll get back to you quickly.",
    cta: "Send message",
  },
};

export function InquiryModal() {
  const { inquiryModalType, closeInquiry } = useCart();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [ownsTower, setOwnsTower] = useState<"none" | "phytaros" | "other">(
    "none"
  );
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!inquiryModalType) return;
    setError(null);
    setSent(false);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeInquiry();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [inquiryModalType, closeInquiry]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inquiryModalType) return;
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: inquiryModalType,
          fullName,
          email,
          whatsappPhone,
          organization,
          ownsTower,
          message,
          website,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to submit right now.");
        return;
      }
      setSent(true);
      setFullName("");
      setEmail("");
      setWhatsappPhone("");
      setOrganization("");
      setMessage("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const copy = inquiryModalType ? MODAL_COPY[inquiryModalType] : null;

  return (
    <AnimatePresence>
      {inquiryModalType && copy && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={copy.title}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeInquiry}
            className="fixed inset-0 bg-ink/55 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex max-h-[92dvh] w-full max-w-[480px] flex-col overflow-hidden rounded-t-[20px] sm:rounded-[20px] border border-line bg-surface-raised text-ink shadow-2xl"
          >
            <div className="flex shrink-0 items-start justify-between gap-4 bg-forest px-5 sm:px-6 py-4 sm:py-5 text-on-forest">
              <div>
                <p className="m-0 text-xs font-semibold tracking-[0.08em] text-lime uppercase">
                  {copy.eyebrow}
                </p>
                <h2 className="m-0 mt-1 font-display text-xl sm:text-2xl font-bold">
                  {copy.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeInquiry}
                aria-label="Close modal"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/20 text-on-forest hover:bg-white/10 cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 sm:px-6 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              {sent ? (
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <CheckCircle2
                    className="h-10 w-10 text-lime-ink"
                    aria-hidden="true"
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="m-0 font-display text-xl font-semibold text-ink">
                      Message received!
                    </h3>
                    <p className="m-0 text-sm text-ink-muted">
                      Thank you for reaching out. Our team will get back to you
                      shortly.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeInquiry}
                    className="mt-2 inline-flex min-h-[44px] items-center rounded-[12px] bg-forest px-6 text-sm font-semibold text-on-forest hover:bg-forest-raised cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <p className="m-0 text-sm text-ink-muted">{copy.subtitle}</p>

                  {error && (
                    <div
                      role="alert"
                      className="rounded-[10px] border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger"
                    >
                      {error}
                    </div>
                  )}

                  {/* Honeypot */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="inq-name"
                      className="text-sm font-semibold text-ink"
                    >
                      Full name *
                    </label>
                    <input
                      id="inq-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-11 rounded-[10px] border border-line-strong/80 bg-surface-raised px-3.5 text-base text-ink focus:border-water focus:ring-2 focus:ring-water/15 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="inq-email"
                        className="text-sm font-semibold text-ink"
                      >
                        Email *
                      </label>
                      <input
                        id="inq-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 rounded-[10px] border border-line-strong/80 bg-surface-raised px-3.5 text-base text-ink focus:border-water focus:ring-2 focus:ring-water/15 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="inq-phone"
                        className="text-sm font-semibold text-ink"
                      >
                        WhatsApp (optional)
                      </label>
                      <input
                        id="inq-phone"
                        type="tel"
                        placeholder="+212 6XX..."
                        value={whatsappPhone}
                        onChange={(e) => setWhatsappPhone(e.target.value)}
                        className="h-11 rounded-[10px] border border-line-strong/80 bg-surface-raised px-3.5 text-base text-ink focus:border-water focus:ring-2 focus:ring-water/15 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {inquiryModalType === "smartcap-waitlist" && (
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="inq-tower"
                        className="text-sm font-semibold text-ink"
                      >
                        Which tower do you plan to use it with?
                      </label>
                      <select
                        id="inq-tower"
                        value={ownsTower}
                        onChange={(e) =>
                          setOwnsTower(
                            e.target.value as "none" | "phytaros" | "other"
                          )
                        }
                        className="h-11 rounded-[10px] border border-line-strong bg-surface-raised px-3 text-base text-ink"
                      >
                        <option value="phytaros">A Phytaros tower</option>
                        <option value="other">
                          Another / DIY tower (Retrofit kit)
                        </option>
                        <option value="none">Not sure yet</option>
                      </select>
                    </div>
                  )}

                  {inquiryModalType === "farming-as-a-service" && (
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="inq-org"
                        className="text-sm font-semibold text-ink"
                      >
                        Company / School / Site name
                      </label>
                      <input
                        id="inq-org"
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        className="h-11 rounded-[10px] border border-line-strong/80 bg-surface-raised px-3.5 text-base text-ink focus:border-water focus:ring-2 focus:ring-water/15 focus:outline-none transition-all"
                      />
                    </div>
                  )}

                  {inquiryModalType !== "smartcap-waitlist" && (
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="inq-msg"
                        className="text-sm font-semibold text-ink"
                      >
                        Message
                      </label>
                      <textarea
                        id="inq-msg"
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us what you’re looking to build..."
                        className="rounded-[10px] border border-line-strong bg-surface-raised p-3 text-base text-ink"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-1 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[12px] bg-lime px-6 text-base font-semibold text-on-lime hover:brightness-95 disabled:opacity-60 transition-all cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2
                          className="h-4 w-4 animate-spin"
                          aria-hidden="true"
                        />
                        Sending...
                      </>
                    ) : (
                      copy.cta
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
