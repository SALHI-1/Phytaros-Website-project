"use client";

import { useState } from "react";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  Clock,
  Droplets,
  Instagram,
  Leaf,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import {
  SITE_CONFIG,
  formatPriceMad,
  type ProductId,
} from "@/config/site";
import { useCart } from "@/context/CartContext";
import { HeroCarousel } from "@/components/HeroCarousel";
import {
  ConceptIllustration,
  PhytarosParkIllustration,
  SmartCapIllustration,
  TowerIllustration,
} from "@/components/Illustrations";
import {
  Reveal,
  StaggerGrid,
  StaggerItem,
} from "@/components/MotionPrimitives";

const TRUST_METRICS = [
  {
    icon: Droplets,
    value: "Up to 90%",
    label: "Less water than soil",
    accent: "text-water",
  },
  {
    icon: Leaf,
    value: "0% soil",
    label: "Clean balcony & kitchen growing",
    accent: "text-lime-ink",
  },
  {
    icon: ShieldCheck,
    value: "Food-contact PP",
    label: "UV-stabilised · Made in Tangier",
    accent: "text-terracotta",
  },
  {
    icon: Truck,
    value: "Delivery included",
    label: "Pay on delivery · WhatsApp confirm",
    accent: "text-water",
  },
] as const;

function SectionEyebrow({
  children,
  dark = false,
  terracotta = false,
}: {
  children: string;
  dark?: boolean;
  terracotta?: boolean;
}) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-3.5 py-1 text-[11px] leading-4 font-semibold tracking-[0.08em] uppercase ${
        dark
          ? "border-lime/25 bg-white/5 text-lime"
          : terracotta
            ? "border-terracotta/25 bg-terracotta-soft text-terracotta"
            : "border-line bg-surface-raised/80 text-lime-ink"
      }`}
    >
      {children}
    </span>
  );
}

export function LandingPage() {
  const { addItem, items, openCart, openInquiry } = useCart();
  const [recentlyAdded, setRecentlyAdded] = useState<ProductId | null>(null);

  const handleAddToCart = (productId: ProductId) => {
    addItem(productId, true);
    setRecentlyAdded(productId);
    window.setTimeout(() => {
      setRecentlyAdded((prev) => (prev === productId ? null : prev));
    }, 1500);
  };

  return (
    <main className="overflow-x-clip">
      {/* 1. CINEMATIC FULL-BLEED HERO CAROUSEL */}
      <HeroCarousel />

      {/* TRUST & IMPACT METRICS BAR */}
      <section
        aria-label="Key Phytaros highlights"
        className="border-b border-line bg-surface-raised px-4 sm:px-8 py-6 sm:py-7"
      >
        <div className="mx-auto grid max-w-[1136px] grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {TRUST_METRICS.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.value}
                className="flex items-start gap-3 rounded-[14px] bg-ground/75 border border-line/70 px-3.5 py-3 sm:px-4"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-surface-raised border border-line">
                  <Icon
                    className={`h-4 w-4 ${metric.accent}`}
                    aria-hidden="true"
                  />
                </div>
                <div className="min-w-0">
                  <p className="m-0 font-mono text-xs sm:text-sm font-semibold text-ink">
                    {metric.value}
                  </p>
                  <p className="m-0 mt-0.5 text-xs leading-snug text-ink-muted">
                    {metric.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. OUR STORY */}
      <section
        id="story"
        className="bg-ground text-ink px-4 sm:px-8 py-14 sm:py-24"
      >
        <div className="mx-auto max-w-[1136px]">
          <Reveal className="mb-8 sm:mb-12 flex flex-col gap-3 sm:gap-4">
            <SectionEyebrow>Our story</SectionEyebrow>
            <h2 className="m-0 font-display text-[clamp(30px,7vw,48px)] leading-[1.08] font-bold tracking-[-0.02em] text-ink">
              It started with water.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
            <Reveal className="flex flex-col gap-4 sm:gap-5 text-base sm:text-lg leading-relaxed text-ink lg:col-span-7">
              <p className="m-0">
                Morocco grows more food every year with less and less water. We
                asked a simple question: how much fresh food can you grow on one
                square metre, with no soil and very little water?
              </p>
              <p className="m-0">
                Phytaros began as SPACETREE, an idea aimed at Spain. We moved
                the start to Morocco, where water scarcity is daily life, where
                we can make the towers ourselves, and which sits a short
                crossing from Europe.
              </p>
              <p className="m-0">
                Today we print our modular tower blocks in Tangier and are
                setting up our company in Barcelona, so Phytaros can grow on
                both sides of the strait.
              </p>
            </Reveal>

            <Reveal
              delay={0.1}
              className="flex flex-col gap-3.5 rounded-[20px] border border-terracotta/20 bg-gradient-to-br from-leaf-soft via-leaf-soft to-terracotta-soft/75 p-6 sm:p-8 shadow-card lg:col-span-5"
            >
              <SectionEyebrow terracotta>Built like equipment</SectionEyebrow>
              <p className="m-0 font-display text-2xl sm:text-[28px] leading-snug sm:leading-[34px] font-semibold tracking-[-0.01em] text-ink">
                Founded in Tangier by a manufacturing quality engineer.
              </p>
              <p className="m-0 text-sm sm:text-base leading-relaxed text-ink">
                We build towers the way industrial parts are built: measured,
                tested and repeatable.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. THE JOURNEY */}
      <section
        id="journey"
        className="bg-surface-sunk text-ink px-4 sm:px-8 py-14 sm:py-24 border-y border-line/70"
      >
        <div className="mx-auto max-w-[1136px]">
          <Reveal className="mb-8 sm:mb-12 flex flex-col gap-3 sm:gap-4">
            <SectionEyebrow>The journey</SectionEyebrow>
            <h2 className="m-0 font-display text-[clamp(30px,7vw,48px)] leading-[1.08] font-bold tracking-[-0.02em] text-ink">
              From idea to farm park.
            </h2>
          </Reveal>

          <StaggerGrid className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {SITE_CONFIG.journey.map((milestone) => (
              <StaggerItem key={milestone.step} className="flex">
                <div
                  className={
                    milestone.current
                      ? "flex w-full flex-col gap-2.5 sm:gap-3 rounded-[16px] sm:rounded-[20px] bg-lime p-4 sm:p-6 text-on-lime shadow-card ring-1 ring-forest/15"
                      : "flex w-full flex-col gap-2.5 sm:gap-3 rounded-[16px] sm:rounded-[20px] border border-line bg-surface-raised p-4 sm:p-6 transition-all hover:-translate-y-0.5 hover:shadow-card"
                  }
                >
                  <p
                    className={`m-0 font-mono text-xs sm:text-[13px] leading-5 font-semibold ${
                      milestone.current ? "text-on-lime" : "text-water"
                    }`}
                  >
                    {milestone.step}
                  </p>
                  <h3 className="m-0 font-display text-base sm:text-xl leading-snug sm:leading-7 font-semibold text-ink">
                    {milestone.title}
                  </h3>
                  <p
                    className={`m-0 text-xs sm:text-sm leading-relaxed ${
                      milestone.current ? "text-on-lime" : "text-ink-muted"
                    }`}
                  >
                    {milestone.description}
                  </p>
                  {milestone.current && (
                    <span className="mt-auto self-start rounded-[6px] bg-forest px-2 py-1 text-[10px] sm:text-[11px] font-semibold tracking-[0.06em] text-lime">
                      WE ARE HERE
                    </span>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* 4. PRINCIPLES */}
      <section
        id="principles"
        className="bg-ground text-ink px-4 sm:px-8 py-14 sm:py-24"
      >
        <div className="mx-auto max-w-[1136px]">
          <Reveal className="mb-8 sm:mb-12 flex flex-col gap-3 sm:gap-4">
            <SectionEyebrow>What we build on</SectionEyebrow>
            <h2 className="m-0 font-display text-[clamp(30px,7vw,48px)] leading-[1.08] font-bold tracking-[-0.02em] text-ink">
              Three ideas behind every tower.
            </h2>
          </Reveal>

          <StaggerGrid className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3 lg:gap-8">
            {SITE_CONFIG.principles.map((item) => (
              <StaggerItem key={item.step} className="flex">
                <div className="flex w-full flex-col gap-3 rounded-[20px] border border-line bg-surface-raised p-5 sm:p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong/60 hover:shadow-card">
                  <span className="inline-flex w-fit items-center rounded-[8px] bg-surface-sunk px-2.5 py-1 font-mono text-xs font-semibold text-water">
                    {item.step}
                  </span>
                  <h3 className="m-0 font-display text-lg sm:text-xl leading-7 font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="m-0 text-sm sm:text-base leading-relaxed text-ink-muted">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* 5. PRE-ORDER CATALOG */}
      <section
        id="catalog"
        className="bg-ground text-ink px-4 sm:px-8 pt-6 pb-16 sm:pt-10 sm:pb-24"
      >
        <div className="mx-auto max-w-[1136px]">
          <Reveal className="mb-8 sm:mb-12 flex flex-col gap-3 sm:gap-4">
            <SectionEyebrow>The catalog · Pre-order now</SectionEyebrow>
            <h2 className="m-0 font-display text-[clamp(30px,7vw,48px)] leading-[1.08] font-bold tracking-[-0.02em] text-ink">
              Start with one tower.
            </h2>
            <p className="m-0 max-w-[38em] text-base sm:text-lg leading-relaxed sm:leading-7 text-ink-muted">
              Two sizes today, one block system. Printed to order in Tangier —
              delivery is included in the price, and you pay on delivery after
              we confirm your order on WhatsApp.
            </p>
          </Reveal>

          {/* 2 Pre-order Product Cards */}
          <StaggerGrid className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
            {SITE_CONFIG.products.map((product) => {
              const inCartQty =
                items.find((i) => i.productId === product.id)?.quantity ?? 0;
              const isJustAdded = recentlyAdded === product.id;

              return (
                <StaggerItem key={product.id} className="flex">
                  <article
                    className={`relative flex w-full flex-col overflow-hidden rounded-[22px] bg-surface-raised transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${
                      product.popular
                        ? "border-2 border-forest shadow-card ring-4 ring-lime/20"
                        : "border border-line"
                    }`}
                  >
                    <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-10 rounded-full bg-surface-raised/95 border border-line px-3 py-1 font-mono text-[11px] font-semibold tracking-[0.08em] text-water backdrop-blur-xs">
                      PRE-ORDER
                    </div>

                    {product.popular && (
                      <span className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10 inline-flex items-center gap-1 rounded-full bg-lime px-3 py-1 text-[11px] sm:text-xs font-semibold tracking-[0.06em] text-on-lime shadow-sm">
                        <Sparkles className="h-3 w-3" aria-hidden="true" />
                        MOST POPULAR
                      </span>
                    )}

                    <div
                      className={`relative flex h-[260px] sm:h-[360px] lg:h-[400px] items-end justify-center p-6 sm:p-8 overflow-hidden ${
                        product.popular
                          ? "bg-gradient-to-b from-leaf-soft/55 via-surface-sunk to-surface-sunk"
                          : "bg-surface-sunk"
                      }`}
                    >
                      <TowerIllustration
                        blocks={product.blocks as 4 | 8}
                        variant="card"
                        className={`relative z-10 block h-auto w-full transition-transform duration-500 hover:scale-[1.02] ${
                          product.blocks === 8
                            ? "max-w-[140px] sm:max-w-[205px] lg:max-w-[225px]"
                            : "max-w-[160px] sm:max-w-[225px] lg:max-w-[245px]"
                        }`}
                      />
                    </div>

                    <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
                      <p className="m-0 text-xs leading-4 font-semibold tracking-[0.08em] text-lime-ink uppercase">
                        {product.eyebrow}
                      </p>
                      <h3 className="m-0 font-display text-2xl sm:text-[28px] leading-snug sm:leading-[34px] font-semibold tracking-[-0.01em] text-ink">
                        {product.name}
                      </h3>
                      <p className="m-0 font-mono text-xs sm:text-[13px] leading-5 font-semibold text-water">
                        {product.blocks} BLOCKS · {product.plantSites} PLANT
                        SITES
                      </p>
                      <p className="m-0 text-sm sm:text-base leading-relaxed text-ink-muted">
                        {product.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                        {product.crops.map((crop) => (
                          <span
                            key={crop}
                            className="inline-block rounded-full bg-leaf-soft px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs sm:text-sm leading-5 font-medium text-ink"
                          >
                            {crop}
                          </span>
                        ))}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 rounded-[12px] border border-line/70 bg-ground px-3.5 py-2.5 text-xs text-ink-muted">
                        <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                          <Truck
                            className="h-3.5 w-3.5 text-water shrink-0"
                            aria-hidden="true"
                          />
                          Delivery included
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock
                            className="h-3.5 w-3.5 text-water shrink-0"
                            aria-hidden="true"
                          />
                          Est. {product.estimatedDelivery}
                        </span>
                        <span>Pay on delivery</span>
                      </div>

                      <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-line pt-4">
                        <div>
                          <p className="m-0 font-mono text-2xl sm:text-[28px] leading-8 font-semibold tracking-[-0.02em] text-ink">
                            {formatPriceMad(product.priceMad)}
                          </p>
                          <p className="m-0 text-xs text-ink-muted">
                            All-inclusive · Cash on delivery
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {inCartQty > 0 && (
                            <button
                              type="button"
                              onClick={openCart}
                              className="inline-flex min-h-[48px] shrink-0 items-center gap-1.5 rounded-[12px] border border-line-strong px-3.5 text-sm font-semibold text-ink hover:bg-ground transition-colors cursor-pointer"
                            >
                              <ShoppingBag
                                className="h-4 w-4 text-water"
                                aria-hidden="true"
                              />
                              <span>{inCartQty}</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleAddToCart(product.id)}
                            className={`inline-flex min-h-[48px] flex-1 sm:flex-none items-center justify-center gap-2 rounded-[12px] px-5 sm:px-6 text-base font-semibold active:scale-[0.98] transition-all cursor-pointer ${
                              product.popular
                                ? "bg-lime border border-lime text-on-lime hover:bg-lime-hover"
                                : "bg-forest border border-forest text-on-forest hover:bg-forest-raised"
                            }`}
                          >
                            {isJustAdded ? (
                              <>
                                <Check
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                />
                                Added
                              </>
                            ) : (
                              <>Add to pre-order</>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                </StaggerItem>
              );
            })}
          </StaggerGrid>

          {/* The Full Range — Mobile stacked cards */}
          <Reveal className="mt-10 md:hidden rounded-[20px] border border-line bg-surface-raised p-5 shadow-xs">
            <h3 className="m-0 mb-4 font-display text-xl font-semibold text-ink">
              The full range
            </h3>
            <div className="flex flex-col divide-y divide-line">
              {SITE_CONFIG.fullRange.map((row) => (
                <div
                  key={row.product}
                  className="flex flex-col gap-1.5 py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-base font-semibold text-ink">
                      {row.product}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold ${
                        row.available
                          ? "bg-water/10 text-water"
                          : "bg-surface-sunk text-ink-muted"
                      }`}
                    >
                      {row.status}
                    </span>
                  </div>
                  <p className="m-0 text-xs font-medium text-lime-ink">
                    {row.audience}
                  </p>
                  <p className="m-0 text-sm leading-relaxed text-ink-muted">
                    {row.summary}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* The Full Range — Desktop/Tablet semantic table */}
          <Reveal className="mt-12 hidden md:block overflow-x-auto rounded-[20px] border border-line bg-surface-raised shadow-xs">
            <table className="w-full border-collapse text-ink">
              <caption className="px-5 pt-5 pb-2 text-left font-display text-xl font-semibold text-ink">
                The full range
              </caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="border-b border-line-strong px-5 py-3.5 text-left text-xs font-semibold tracking-[0.08em] text-ink-muted"
                  >
                    PRODUCT
                  </th>
                  <th
                    scope="col"
                    className="border-b border-line-strong px-5 py-3.5 text-left text-xs font-semibold tracking-[0.08em] text-ink-muted"
                  >
                    FOR
                  </th>
                  <th
                    scope="col"
                    className="border-b border-line-strong px-5 py-3.5 text-left text-xs font-semibold tracking-[0.08em] text-ink-muted"
                  >
                    WHAT IT IS
                  </th>
                  <th
                    scope="col"
                    className="border-b border-line-strong px-5 py-3.5 text-left text-xs font-semibold tracking-[0.08em] text-ink-muted"
                  >
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody>
                {SITE_CONFIG.fullRange.map((row) => (
                  <tr
                    key={row.product}
                    className="border-b border-line last:border-b-0 hover:bg-ground/70 transition-colors"
                  >
                    <td className="px-5 py-4 align-top text-base font-semibold text-ink">
                      {row.product}
                    </td>
                    <td className="px-5 py-4 align-top text-base text-ink-muted">
                      {row.audience}
                    </td>
                    <td className="px-5 py-4 align-top text-base text-ink-muted">
                      {row.summary}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold ${
                          row.available
                            ? "bg-water/12 text-water"
                            : "bg-surface-sunk text-ink-muted"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {/* 6. SMARTCAP */}
      <section
        id="smartcap"
        className="bg-forest text-on-forest px-4 sm:px-8 py-14 sm:py-24 overflow-hidden"
      >
        <div className="mx-auto grid max-w-[1136px] grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-7">
            <div className="mb-8 sm:mb-10 flex flex-col gap-3 sm:gap-4">
              <SectionEyebrow dark>The brain on top</SectionEyebrow>
              <h2 className="m-0 font-display text-[clamp(30px,7vw,48px)] leading-[1.08] font-bold tracking-[-0.02em] text-on-forest">
                SmartCap.
              </h2>
              <p className="m-0 max-w-[34em] text-base sm:text-lg leading-relaxed sm:leading-7 text-on-forest-muted">
                A detachable cap that turns any tower into a smart one — ours,
                or one you already own with the retrofit kit.
              </p>
            </div>

            <div className="flex flex-col">
              {SITE_CONFIG.smartCapFeatures.map((feat) => (
                <div
                  key={feat.verb}
                  className="flex gap-4 sm:gap-6 border-t border-white/12 py-4 sm:py-5"
                >
                  <p className="m-0 w-20 sm:w-24 shrink-0 font-display text-lg sm:text-xl font-semibold text-lime">
                    {feat.verb}
                  </p>
                  <p className="m-0 text-sm sm:text-base leading-relaxed text-on-forest">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-6 sm:pt-8">
              <button
                type="button"
                onClick={() => openInquiry("smartcap-waitlist")}
                className="inline-flex min-h-[50px] w-full sm:w-auto items-center justify-center gap-2 rounded-[12px] bg-lime border border-lime px-6 text-base font-semibold text-on-lime hover:bg-lime-hover active:scale-[0.98] transition-all cursor-pointer"
              >
                Join the SmartCap waitlist
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </Reveal>

          <Reveal
            delay={0.12}
            className="flex justify-center lg:col-span-5"
          >
            <SmartCapIllustration className="block h-auto w-full max-w-[290px] sm:max-w-[400px] lg:max-w-[460px]" />
          </Reveal>
        </div>
      </section>

      {/* 7. SERVICES */}
      <section
        id="services"
        className="bg-ground text-ink px-4 sm:px-8 py-14 sm:py-24"
      >
        <div className="mx-auto max-w-[1136px]">
          <Reveal className="mb-8 sm:mb-12 flex flex-col gap-3 sm:gap-4">
            <SectionEyebrow>Services</SectionEyebrow>
            <h2 className="m-0 font-display text-[clamp(30px,7vw,48px)] leading-[1.08] font-bold tracking-[-0.02em] text-ink">
              Keep growing, without the guesswork.
            </h2>
          </Reveal>

          <StaggerGrid className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3 lg:gap-8">
            {SITE_CONFIG.services.map((service) => (
              <StaggerItem key={service.title} className="flex">
                <div className="flex w-full flex-col gap-2.5 sm:gap-3 rounded-[20px] border border-line bg-surface-raised p-5 sm:p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card">
                  <p className="m-0 font-mono text-xs leading-5 font-semibold text-water">
                    {service.eyebrow}
                  </p>
                  <h3 className="m-0 font-display text-lg sm:text-xl leading-7 font-semibold text-ink">
                    {service.title}
                  </h3>
                  <p className="m-0 text-sm sm:text-base leading-relaxed text-ink-muted">
                    {service.description}
                  </p>
                  {service.priceNote && (
                    <p className="mt-auto pt-3 font-mono text-xs font-semibold text-ink-muted">
                      {service.priceNote}
                    </p>
                  )}
                  {service.ctaLabel && (
                    <div className="mt-auto pt-3">
                      <button
                        type="button"
                        onClick={() => openInquiry("farming-as-a-service")}
                        className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-[12px] bg-forest px-6 text-base font-semibold text-on-forest hover:bg-forest-raised active:scale-[0.98] transition-all cursor-pointer"
                      >
                        {service.ctaLabel}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* 8. HOW IT WORKS */}
      <section
        id="how"
        className="bg-surface-sunk text-ink px-4 sm:px-8 py-14 sm:py-24 border-y border-line/70"
      >
        <div className="mx-auto max-w-[1136px]">
          <Reveal className="mb-8 sm:mb-12 flex flex-col gap-3 sm:gap-4">
            <SectionEyebrow>How it works</SectionEyebrow>
            <h2 className="m-0 font-display text-[clamp(30px,7vw,48px)] leading-[1.08] font-bold tracking-[-0.02em] text-ink">
              Stack. Plant. Top up.
            </h2>
          </Reveal>

          <StaggerGrid className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3 lg:gap-8">
            {SITE_CONFIG.howItWorks.map((step) => (
              <StaggerItem key={step.step} className="flex">
                <div className="flex w-full flex-col gap-2.5 sm:gap-3 rounded-[20px] border border-line bg-surface-raised p-6 sm:p-8 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-card">
                  <p className="m-0 font-mono text-3xl sm:text-[40px] leading-none font-semibold text-water">
                    {step.step}
                  </p>
                  <h3 className="m-0 font-display text-lg sm:text-xl leading-7 font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="m-0 text-sm sm:text-base leading-relaxed text-ink-muted">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* 9. THE FUTURE · PHYTAROS PARK */}
      <section
        id="future"
        className="bg-ground text-ink px-4 sm:px-8 py-14 sm:py-24"
      >
        <div className="mx-auto max-w-[1136px]">
          <Reveal className="mb-8 sm:mb-12 flex flex-col gap-3 sm:gap-4">
            <SectionEyebrow>The future · Phytaros Park</SectionEyebrow>
            <h2 className="m-0 font-display text-[clamp(30px,7vw,48px)] leading-[1.08] font-bold tracking-[-0.02em] text-ink">
              From one tower to a farm park.
            </h2>
            <p className="m-0 max-w-[34em] text-base sm:text-lg leading-relaxed sm:leading-7 text-ink-muted">
              For campuses, schools and large farms, we sell the park, not just
              the tower: a managed growing system that runs itself.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <Reveal className="rounded-[20px] border border-line bg-surface-sunk p-4 sm:p-8 shadow-xs lg:col-span-7">
              <PhytarosParkIllustration className="block h-auto w-full max-w-[640px] mx-auto" />
              <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-x-5 sm:gap-y-2 pt-4 text-xs sm:text-sm text-ink-muted">
                <span className="inline-flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-3 w-3 shrink-0 rounded-full bg-water"
                  />
                  Central node
                </span>
                <span className="inline-flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-3 w-3 shrink-0 rounded-full bg-forest"
                  />
                  Tower
                </span>
                <span className="inline-flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="w-4 shrink-0 border-t-[3px] border-dotted border-lime-ink"
                  />
                  Sentinel route
                </span>
                <span className="inline-flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="w-4 shrink-0 border-t-[3px] border-dashed border-line-strong"
                  />
                  Park boundary
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="flex flex-col lg:col-span-5">
              {SITE_CONFIG.parkGlossary.map((entry) => (
                <div
                  key={entry.term}
                  className="flex flex-col gap-1.5 border-t border-line py-4 sm:py-5"
                >
                  <h3 className="m-0 font-display text-lg sm:text-xl leading-7 font-semibold text-ink">
                    {entry.term}
                  </h3>
                  <p className="m-0 text-sm sm:text-base leading-relaxed text-ink-muted">
                    {entry.description}
                  </p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* 10. TECHNOLOGY ON THE HORIZON */}
      <section
        id="tech"
        className="bg-forest text-on-forest px-4 sm:px-8 py-14 sm:py-24"
      >
        <div className="mx-auto max-w-[1136px]">
          <Reveal className="mb-8 sm:mb-12 flex flex-col gap-3 sm:gap-4">
            <SectionEyebrow dark>Technology on the horizon</SectionEyebrow>
            <h2 className="m-0 font-display text-[clamp(30px,7vw,48px)] leading-[1.08] font-bold tracking-[-0.02em] text-on-forest">
              A park that runs itself.
            </h2>
          </Reveal>

          <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {SITE_CONFIG.futureTech.map((tech) => (
              <StaggerItem key={tech.step} className="flex">
                <div className="bg-forest-raised flex w-full flex-col gap-2.5 sm:gap-3 rounded-[20px] p-5 sm:p-6 border border-white/10 hover:border-lime/40 transition-colors">
                  <p className="m-0 font-mono text-[13px] leading-5 font-semibold text-lime">
                    {tech.step}
                  </p>
                  <h3 className="m-0 font-display text-lg sm:text-xl leading-7 font-semibold text-on-forest">
                    {tech.title}
                  </h3>
                  <p className="m-0 text-sm sm:text-base leading-relaxed text-on-forest-muted">
                    {tech.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* 11. CONCEPTS WE'RE EXPLORING */}
      <section
        id="concepts"
        className="bg-surface-sunk text-ink px-4 sm:px-8 py-14 sm:py-24 border-b border-line/70"
      >
        <div className="mx-auto max-w-[1136px]">
          <Reveal className="mb-8 sm:mb-12 flex flex-col gap-3 sm:gap-4">
            <SectionEyebrow>Concepts we’re exploring</SectionEyebrow>
            <h2 className="m-0 font-display text-[clamp(30px,7vw,48px)] leading-[1.08] font-bold tracking-[-0.02em] text-ink">
              What comes next.
            </h2>
          </Reveal>

          <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {SITE_CONFIG.concepts.map((concept) => (
              <StaggerItem key={concept.id} className="flex">
                <div className="flex w-full flex-col gap-2.5 sm:gap-3 rounded-[20px] border border-line bg-surface-raised p-5 sm:p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card">
                  <div className="flex justify-center rounded-[12px] bg-ground p-3.5 sm:p-4">
                    <ConceptIllustration
                      kind={concept.id}
                      className="block h-auto w-full max-w-[120px] sm:max-w-[160px]"
                    />
                  </div>
                  <p className="m-0 font-mono text-xs sm:text-[13px] leading-5 font-semibold text-water">
                    CONCEPT
                  </p>
                  <h3 className="m-0 font-display text-lg sm:text-xl leading-7 font-semibold text-ink">
                    {concept.title}
                  </h3>
                  <p className="m-0 text-sm sm:text-base leading-relaxed text-ink-muted">
                    {concept.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* 12. ROADMAP */}
      <section
        id="roadmap"
        className="bg-ground text-ink px-4 sm:px-8 py-14 sm:py-24"
      >
        <div className="mx-auto max-w-[1136px]">
          <Reveal className="mb-8 sm:mb-12 flex flex-col gap-3 sm:gap-4">
            <SectionEyebrow>Roadmap</SectionEyebrow>
            <h2 className="m-0 font-display text-[clamp(30px,7vw,48px)] leading-[1.08] font-bold tracking-[-0.02em] text-ink">
              Where we’re going.
            </h2>
          </Reveal>

          <StaggerGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
            {SITE_CONFIG.roadmap.map((item) => (
              <StaggerItem key={item.phase}>
                <div
                  className={`flex flex-col gap-2 border-t-4 pt-4 sm:pt-5 ${
                    item.highlight ? "border-lime" : "border-forest"
                  }`}
                >
                  <p
                    className={`m-0 font-mono text-[13px] leading-5 font-semibold ${
                      item.highlight ? "text-lime-ink" : "text-water"
                    }`}
                  >
                    {item.phase}
                  </p>
                  <p className="m-0 text-sm sm:text-base leading-relaxed text-ink">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* 13. CONTACT CTA */}
      <section id="contact" className="bg-ground px-4 sm:px-8 pb-16 sm:pb-24">
        <Reveal className="mx-auto flex max-w-[1136px] flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8 rounded-[24px] bg-forest px-5 py-10 sm:px-12 sm:py-16 border border-white/10 shadow-card">
          <div className="flex flex-col gap-3 sm:gap-4 max-w-xl">
            <SectionEyebrow dark>Grow with us</SectionEyebrow>
            <h2 className="m-0 font-display text-[clamp(30px,7vw,48px)] leading-[1.08] font-bold tracking-[-0.02em] text-on-forest">
              Start with one tower.
            </h2>
            <p className="m-0 text-base sm:text-lg leading-relaxed sm:leading-7 text-on-forest-muted">
              Whether you’re a home grower, a partner or an investor, we’d like
              to hear from you.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#catalog"
              className="inline-flex min-h-[50px] w-full sm:w-auto items-center justify-center gap-2 rounded-[12px] bg-lime border border-lime px-6 text-base font-semibold text-on-lime hover:bg-lime-hover active:scale-[0.98] transition-all no-underline"
            >
              Choose your tower
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={() => openInquiry("general")}
              className="inline-flex min-h-[50px] w-full sm:w-auto items-center justify-center rounded-[12px] border border-white/25 bg-white/5 px-6 text-base font-semibold text-on-forest hover:border-white/50 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Contact us
            </button>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="bg-forest text-on-forest border-t border-white/10 px-4 sm:px-8 pt-14 pb-24 md:pb-12">
        <div className="mx-auto max-w-[1136px]">
          <div className="grid grid-cols-1 gap-10 pb-12 border-b border-white/10 sm:grid-cols-2 lg:grid-cols-12">
            {/* Brand column */}
            <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-4">
              <a
                href="#top"
                className="w-fit font-display text-2xl font-bold tracking-tight text-on-forest no-underline hover:text-lime transition-colors"
              >
                {SITE_CONFIG.brand.name}
              </a>
              <p className="m-0 max-w-sm text-sm leading-relaxed text-on-forest-muted">
                Modular hydroponic towers engineered in Tangier. Grow fresh
                herbs, greens, and fruit upward with no soil and up to 90% less
                water.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="rounded-full border border-white/15 bg-forest-raised px-3 py-1 font-mono text-[11px] text-on-forest/90">
                  Made in Tangier
                </span>
                <span className="rounded-full border border-white/15 bg-forest-raised px-3 py-1 font-mono text-[11px] text-on-forest/90">
                  Delivery included
                </span>
                <span className="rounded-full border border-white/15 bg-forest-raised px-3 py-1 font-mono text-[11px] text-lime">
                  Pay on delivery
                </span>
              </div>
            </div>

            {/* Explore links */}
            <div className="flex flex-col gap-3 lg:col-span-2 lg:col-start-6">
              <p className="m-0 font-mono text-[11px] font-semibold tracking-[0.1em] text-lime uppercase">
                Explore
              </p>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-sm">
                {SITE_CONFIG.navigation.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-on-forest-muted hover:text-on-forest transition-colors no-underline"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products & actions */}
            <div className="flex flex-col gap-3 lg:col-span-3">
              <p className="m-0 font-mono text-[11px] font-semibold tracking-[0.1em] text-lime uppercase">
                Pre-order &amp; Services
              </p>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-sm">
                {SITE_CONFIG.products.map((product) => (
                  <li key={product.id}>
                    <a
                      href="#catalog"
                      className="inline-flex items-center gap-2 text-on-forest-muted hover:text-on-forest transition-colors no-underline"
                    >
                      <span>{product.name}</span>
                      <span className="font-mono text-[11px] text-on-forest-muted/70">
                        {product.blocks} blocks
                      </span>
                    </a>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => openInquiry("smartcap-waitlist")}
                    className="bg-transparent border-0 p-0 text-left text-sm text-on-forest-muted hover:text-lime transition-colors cursor-pointer"
                  >
                    SmartCap waitlist
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openInquiry("farming-as-a-service")}
                    className="bg-transparent border-0 p-0 text-left text-sm text-on-forest-muted hover:text-lime transition-colors cursor-pointer"
                  >
                    Farming-as-a-Service
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={openCart}
                    className="bg-transparent border-0 p-0 text-left text-sm font-medium text-lime hover:underline cursor-pointer"
                  >
                    Open pre-order cart
                  </button>
                </li>
              </ul>
            </div>

            {/* Studios & Contact */}
            <div className="flex flex-col gap-3 lg:col-span-2">
              <p className="m-0 font-mono text-[11px] font-semibold tracking-[0.1em] text-lime uppercase">
                Connect
              </p>
              <div className="flex flex-col gap-2.5 text-sm text-on-forest-muted">
                {SITE_CONFIG.brand.locations.map((loc) => (
                  <span key={loc} className="inline-flex items-center gap-2">
                    <MapPin
                      className="h-3.5 w-3.5 shrink-0 text-lime/80"
                      aria-hidden="true"
                    />
                    <span>{loc}</span>
                  </span>
                ))}
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="inline-flex items-center gap-2 text-on-forest-muted hover:text-on-forest transition-colors no-underline break-all"
                >
                  <Mail
                    className="h-3.5 w-3.5 shrink-0 text-lime/80"
                    aria-hidden="true"
                  />
                  <span>{SITE_CONFIG.contact.email}</span>
                </a>
                <span className="inline-flex items-center gap-2">
                  <Phone
                    className="h-3.5 w-3.5 shrink-0 text-lime/80"
                    aria-hidden="true"
                  />
                  <span>{SITE_CONFIG.contact.phoneDisplay}</span>
                </span>
                <a
                  href={SITE_CONFIG.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-on-forest-muted hover:text-lime transition-colors no-underline"
                >
                  <Instagram
                    className="h-3.5 w-3.5 shrink-0 text-lime/80"
                    aria-hidden="true"
                  />
                  <span>{SITE_CONFIG.contact.instagramHandle}</span>
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 text-xs text-on-forest-muted">
            <p className="m-0">
              &copy; {new Date().getFullYear()} {SITE_CONFIG.brand.name}. All
              rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-mono text-[11px] text-on-forest-muted/80">
                Tangier &middot; Barcelona
              </span>
              <a
                href="#top"
                className="inline-flex items-center gap-1.5 rounded-[10px] border border-white/15 px-3 py-1.5 text-xs font-medium text-on-forest hover:border-lime hover:text-lime transition-colors no-underline"
              >
                Back to top
                <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
