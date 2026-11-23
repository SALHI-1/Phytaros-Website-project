/**
 * Phytaros — Central Site & Pre-Order Configuration (Zero Database)
 * -----------------------------------------------------------------
 * Update prices, plant sites, estimated delivery timelines, and contact
 * details here. Both the UI and the server-side `/api/preorder` route read
 * from this file so prices can never be tampered with from the browser.
 */

export type ProductId = "phytaros-mini" | "phytaros-tower";

export interface PreorderProduct {
  id: ProductId;
  name: string;
  eyebrow: string;
  blocks: number;
  plantSites: number;
  /** Final price in MAD — delivery is included (Cash on Delivery). */
  priceMad: number;
  estimatedDelivery: string;
  description: string;
  crops: string[];
  popular?: boolean;
  dimensionsNote: string;
}

export const SITE_CONFIG = {
  brand: {
    name: "Phytaros",
    tagline: "Grow a garden upward.",
    shortDescription: "Modular hydroponic towers. Grown in Morocco.",
    metaTitle: "Phytaros — Modular Hydroponic Towers | Pre-Order",
    metaDescription:
      "Modular hydroponic towers made in Tangier in food-contact polypropylene. Pre-order Phytaros Mini or Phytaros Tower with delivery included and pay on delivery.",
    locations: ["Tangier, Morocco", "Barcelona, Spain"],
  },

  contact: {
    // Replace with final business details before deploying to production
    email: "hello@phytaros.com",
    phoneDisplay: "+212 600 000 000",
    whatsappNumber: "212600000000",
    instagramHandle: "@phytaros",
    instagramUrl: "https://instagram.com/phytaros",
  },

  preorder: {
    currency: "MAD" as const,
    paymentLabel: "Pay on delivery (Cash on Delivery)",
    deliveryLabel: "Delivery included in total price",
    estimatedDelivery: "2–3 weeks (printed to order in Tangier)",
    whatsappFollowUp:
      "Our team will contact you on WhatsApp as soon as possible to confirm your pre-order and coordinate delivery.",
    maxQuantityPerItem: 10,
  },

  /**
   * The two pre-orderable tower models.
   * Server-side `/api/preorder` uses these exact prices to compute order totals.
   */
  products: [
    {
      id: "phytaros-mini",
      name: "Phytaros Mini",
      eyebrow: "FOR BALCONIES AND KITCHENS",
      blocks: 4,
      plantSites: 16, // Update if needed
      priceMad: 1690, // Update with final MAD price (delivery included)
      estimatedDelivery: "2–3 weeks",
      description:
        "A compact tower for herbs, mint, lettuce and strawberries. Fits a balcony corner or a bright kitchen.",
      crops: ["Basil", "Mint", "Lettuce", "Strawberries"],
      dimensionsNote: "Compact footprint · SmartCap ready",
    },
    {
      id: "phytaros-tower",
      name: "Phytaros Tower",
      eyebrow: "FOR TERRACES AND ROOFTOPS",
      blocks: 8,
      plantSites: 32, // Matches design system spec sample (8 blocks · 32 plant sites)
      priceMad: 2690, // Update with final MAD price (delivery included)
      estimatedDelivery: "2–3 weeks",
      description:
        "Our full-height tower for a family’s herbs and salad greens. Cherry tomatoes and herbs grow especially well in it.",
      crops: ["Cherry tomatoes", "Herbs", "Leafy greens"],
      popular: true,
      dimensionsNote: "Full height · SmartCap ready",
    },
  ] satisfies PreorderProduct[],

  navigation: [
    { label: "Story", href: "#story" },
    { label: "Catalog", href: "#catalog" },
    { label: "SmartCap", href: "#smartcap" },
    { label: "The future", href: "#future" },
    { label: "Roadmap", href: "#roadmap" },
  ],

  journey: [
    {
      step: "01",
      title: "SPACETREE",
      description: "The first concept, aimed at Spain.",
      current: false,
    },
    {
      step: "02",
      title: "Morocco first",
      description: "Launch where water is scarce and production is close.",
      current: false,
    },
    {
      step: "03",
      title: "First towers",
      description:
        "Modular blocks printed in food-contact PP on our own 3D printers.",
      current: true,
    },
    {
      step: "04",
      title: "Barcelona company",
      description: "Registering in Spain with the Bcombinator accelerator.",
      current: true,
    },
    {
      step: "05",
      title: "Pilot farm",
      description: "Year 2: about 30 towers with Spanish partner companies.",
      current: false,
    },
    {
      step: "06",
      title: "5 hectares",
      description:
        "End of 2027: our own farm site for first production trials.",
      current: false,
    },
  ],

  principles: [
    {
      step: "01",
      title: "Modular by design",
      description:
        "Click a block on to grow taller. If one block is damaged, replace that block, not the whole tower.",
    },
    {
      step: "02",
      title: "Food-safe materials",
      description:
        "UV-stabilised, food-contact polypropylene, made for years of sun and water.",
    },
    {
      step: "03",
      title: "Smart, not complicated",
      description:
        "SmartCap watches the plants and doses nutrients, so growing doesn’t need an expert.",
    },
  ],

  fullRange: [
    {
      product: "Phytaros Mini",
      audience: "Homes, balconies",
      summary: "4-block starter tower",
      status: "PRE-ORDER OPEN",
      available: true,
    },
    {
      product: "Phytaros Tower",
      audience: "Terraces, rooftops",
      summary: "8-block full-height tower",
      status: "PRE-ORDER OPEN",
      available: true,
    },
    {
      product: "SmartCap",
      audience: "Any Phytaros tower",
      summary: "Detachable smart top: camera, AI, dosing",
      status: "IN DEVELOPMENT",
      available: false,
    },
    {
      product: "Retrofit kit",
      audience: "Towers you already own",
      summary: "SmartCap and app for third-party and DIY towers",
      status: "IN DEVELOPMENT",
      available: false,
    },
    {
      product: "Deco tower",
      audience: "Flowers and ornamentals",
      summary: "Made from recycled customer plastic; not for food",
      status: "PLANNED",
      available: false,
    },
    {
      product: "Pro tower",
      audience: "Farmers",
      summary: "Single-sealed tower for field use",
      status: "PLANNED",
      available: false,
    },
  ],

  smartCapFeatures: [
    {
      verb: "Sees",
      description:
        "On-device computer vision spots stress and disease early.",
    },
    {
      verb: "Thinks",
      description:
        "Edge AI runs on the cap itself, so it reacts without the cloud.",
    },
    {
      verb: "Doses",
      description: "Automatic nutrient dosing keeps the water right.",
    },
  ],

  services: [
    {
      eyebrow: "REFILL",
      title: "EcoPods",
      description:
        "Biodegradable seed pods. Drop one into each plant site, top up the water and grow.",
      priceNote: "Coming soon",
      ctaLabel: null,
    },
    {
      eyebrow: "SUBSCRIPTION",
      title: "Phytaros app",
      description:
        "Plant guides, alerts and your tower’s data in one place.",
      priceNote: "Launching with SmartCap",
      ctaLabel: null,
    },
    {
      eyebrow: "FOR BUSINESSES",
      title: "Farming-as-a-Service",
      description:
        "We install, run and maintain the towers at your site. You get the harvest.",
      priceNote: null,
      ctaLabel: "Talk to us",
    },
  ],

  howItWorks: [
    {
      step: "01",
      title: "Stack",
      description: "Click the blocks together on the reservoir.",
    },
    {
      step: "02",
      title: "Plant",
      description: "Drop an EcoPod into each plant site.",
    },
    {
      step: "03",
      title: "Top up",
      description: "Add water and nutrients. SmartCap tells you when.",
    },
  ],

  parkGlossary: [
    {
      term: "Park",
      description:
        "The full deployable unit, installed and run as managed infrastructure.",
    },
    {
      term: "Grove",
      description: "A cluster of 12–16 towers sharing one central node.",
    },
    {
      term: "Canopy",
      description: "The park’s AI operating system.",
    },
    {
      term: "Sentinel",
      description: "A roaming multispectral camera that detects disease early.",
    },
  ],

  futureTech: [
    {
      step: "01",
      title: "Fleet learning",
      description:
        "Every park learns from the others, without sharing raw data.",
    },
    {
      step: "02",
      title: "Live digital twin",
      description: "A real-time model of every tower and grove.",
    },
    {
      step: "03",
      title: "Predictive agronomy",
      description: "See harvests and problems coming before they show.",
    },
    {
      step: "04",
      title: "Crop-recipe marketplace",
      description: "Growers share and sell recipes that work.",
    },
    {
      step: "05",
      title: "Grove Copilot",
      description:
        "Ask the park in plain language: “What needs attention today?”",
    },
    {
      step: "06",
      title: "Water and carbon reports",
      description:
        "Automatic reporting of water use and carbon for customers and funders.",
    },
  ],

  concepts: [
    {
      id: "sculpture" as const,
      title: "Sculpture tower",
      description:
        "A futuristic, adaptable indoor tower for flowers, mint and herbs — a design piece for living rooms and offices.",
    },
    {
      id: "loop" as const,
      title: "Closed plastic loop",
      description:
        "Bring back bottles and caps for a discount. We turn them into Deco towers for flowers.",
    },
    {
      id: "field" as const,
      title: "Pro field tower",
      description:
        "A single-sealed tower built for farmers and outdoor fields.",
    },
    {
      id: "sun" as const,
      title: "Off-grid park",
      description:
        "An early idea: solar-powered parks for schools and farms without reliable power.",
    },
  ],

  roadmap: [
    {
      phase: "NOW",
      highlight: true,
      description:
        "Selling towers online to households. Planning baseline: 30 towers a month.",
    },
    {
      phase: "YEAR 2",
      highlight: false,
      description:
        "A pilot farm of about 30 towers in Spain with partner companies, running within six months.",
    },
    {
      phase: "END OF 2027",
      highlight: false,
      description:
        "Five hectares of farmland: our pilot farm and first production trials.",
    },
    {
      phase: "THEN",
      highlight: false,
      description:
        "Parks for campuses, schools and farms, and expansion across Europe.",
    },
  ],
} as const;

export function getProductById(id: string): PreorderProduct | undefined {
  return SITE_CONFIG.products.find((product) => product.id === id);
}

export function formatPriceMad(amount: number): string {
  return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${SITE_CONFIG.preorder.currency}`;
}
