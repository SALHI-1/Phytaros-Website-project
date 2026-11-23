"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Clock, MessageCircle, Truck } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { SITE_CONFIG } from "@/config/site";

const SLIDE_DURATION_MS = 5000;

const HERO_SLIDES = [
  {
    id: "balcony-herbs",
    src: "/images/345862446407460503.jpeg",
    alt: "Hydroponic herb tower on a sunlit urban balcony",
    objectPosition: "object-[center_42%]",
    cropBottom: false,
  },
  {
    id: "greenhouse-row",
    src: "/images/718816790570082184.jpeg",
    alt: "Row of modular white hydroponic towers growing crisp lettuce in a bright greenhouse",
    objectPosition: "object-[center_30%]",
    cropBottom: true,
  },
  {
    id: "lush-lettuce",
    src: "/images/Goût des Cultures Aéroponiques _ Saveur des Légumes Hydroponiques.jpeg",
    alt: "Vertical hydroponic tower overflowing with fresh curly green lettuce",
    objectPosition: "object-[center_46%]",
    cropBottom: false,
  },
  {
    id: "outdoor-park",
    src: "/images/Indoor Oasis.jpeg",
    alt: "Outdoor vertical farm park of hydroponic towers at sunset",
    objectPosition: "object-[center_62%]",
    cropBottom: false,
  },
  {
    id: "leafy-closeup",
    src: "/images/What is Tower Garden Made From_ _ Tower Garden Plastic.jpeg",
    alt: "Close-up of vibrant green and purple leafy greens growing on white hydroponic towers",
    objectPosition: "object-center",
    cropBottom: false,
  },
] as const;

export function HeroCarousel() {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_DURATION_MS);
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    setActiveIndex((prev) =>
      delta < 0
        ? (prev + 1) % HERO_SLIDES.length
        : (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
    );
  };

  return (
    <section
      id="top"
      aria-label="Phytaros hero showcase"
      className="relative bg-forest text-on-forest overflow-hidden md:min-h-[660px] lg:min-h-[740px] flex flex-col justify-center"
    >
      {/* MOBILE VISUAL STAGE (< md): Pure images, natural portrait proportion */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative md:hidden h-[340px] sm:h-[420px] w-full overflow-hidden bg-forest"
      >
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={`mobile-${slide.id}`}
              aria-hidden={!isActive}
              className={`absolute inset-x-0 top-0 ${
                slide.cropBottom ? "-bottom-8" : "bottom-0"
              } transition-opacity duration-700 ease-in-out will-change-[opacity] ${
                isActive ? "opacity-100 z-[1]" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={idx === 0}
                sizes="100vw"
                className={`object-cover ${slide.objectPosition} select-none`}
              />
            </div>
          );
        })}

        {/* Soft bottom melt into the forest copy block */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-28 bg-gradient-to-t from-forest via-forest/70 to-transparent"
        />
      </div>

      {/* DESKTOP RIGHT-ALIGNED CAROUSEL (md+): Keeps portrait/square photos crisp without over-zooming */}
      <div
        className="pointer-events-none hidden md:block absolute inset-y-0 right-0 w-[62%] lg:w-[58%] z-0 overflow-hidden"
        aria-hidden="true"
      >
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={`desktop-${slide.id}`}
              className={`absolute inset-x-0 top-0 ${
                slide.cropBottom ? "-bottom-10" : "bottom-0"
              } transition-opacity duration-1000 ease-in-out will-change-[opacity] ${
                isActive ? "opacity-100 z-[1]" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={idx === 0}
                sizes="(min-width: 1024px) 58vw, 62vw"
                className={`object-cover ${slide.objectPosition} select-none`}
              />
            </div>
          );
        })}

        {/* Soft left & vertical feather seamlessly melting images into #0D281E */}
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background:
              "linear-gradient(90deg, rgba(13,40,30,1) 0%, rgba(13,40,30,0.88) 16%, rgba(13,40,30,0.38) 42%, rgba(13,40,30,0.12) 100%)",
          }}
        />
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background:
              "linear-gradient(180deg, rgba(13,40,30,0.35) 0%, rgba(13,40,30,0) 20%, rgba(13,40,30,0) 80%, rgba(13,40,30,0.65) 100%)",
          }}
        />
      </div>

      {/* FOREGROUND HERO COPY & CTAs */}
      <div className="relative z-10 mx-auto w-full max-w-[1136px] px-4 sm:px-8 pt-4 pb-12 md:py-20 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex max-w-[560px] flex-col gap-4 sm:gap-5 md:gap-6"
        >
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-lime/30 bg-forest-raised/85 md:bg-forest/80 backdrop-blur-sm px-3 py-1 text-[11px] leading-4 font-semibold tracking-[0.08em] text-lime uppercase">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-lime"
            />
            Hydroponic towers · Made in Tangier
          </span>

          <h1 className="m-0 font-display text-[clamp(38px,10vw,78px)] leading-[0.95] font-bold tracking-[-0.03em] text-on-forest md:drop-shadow-[0_2px_16px_rgba(0,0,0,0.35)]">
            {SITE_CONFIG.brand.tagline}
          </h1>

          <p className="m-0 max-w-[31em] text-base sm:text-lg leading-relaxed sm:leading-7 text-on-forest/90">
            Modular towers that grow herbs, greens and fruit on a balcony, with
            no soil. Start with one tower — and grow toward a whole farm park.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <a
              href="#catalog"
              className="inline-flex min-h-[50px] w-full sm:w-auto items-center justify-center gap-2 rounded-[12px] bg-lime border border-lime px-6 text-base font-semibold text-on-lime hover:bg-lime-hover active:scale-[0.98] transition-all no-underline shadow-[0_8px_24px_rgba(182,236,61,0.3)]"
            >
              Choose your tower
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#story"
              className="inline-flex min-h-[50px] w-full sm:w-auto items-center justify-center rounded-[12px] border border-white/25 bg-forest-raised/70 md:bg-forest/65 backdrop-blur-sm px-6 text-base font-semibold text-on-forest hover:border-white/50 hover:bg-forest-raised transition-colors no-underline"
            >
              Read our story
            </a>
          </div>

          <p className="m-0 pt-1 font-mono text-xs sm:text-[13px] leading-5 text-on-forest-muted">
            4 OR 8 BLOCKS · FOOD-CONTACT PP · SMARTCAP READY
          </p>

          {/* Pre-order assurance strip */}
          <div className="mt-1 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:gap-x-5 sm:gap-y-2 border-t border-white/15 pt-4 text-sm text-on-forest/95">
            <span className="inline-flex items-center gap-2">
              <Truck
                className="h-4 w-4 shrink-0 text-lime"
                aria-hidden="true"
              />
              Delivery included
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock
                className="h-4 w-4 shrink-0 text-lime"
                aria-hidden="true"
              />
              Est. {SITE_CONFIG.preorder.estimatedDelivery}
            </span>
            <span className="inline-flex items-center gap-2">
              <MessageCircle
                className="h-4 w-4 shrink-0 text-lime"
                aria-hidden="true"
              />
              Pay on delivery · WhatsApp confirmation
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
