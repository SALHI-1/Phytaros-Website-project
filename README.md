# Phytaros — Pre-Order Website (Next.js + Cloud Run)

Zero-database pre-order e-commerce and showcase website for **Phytaros** modular hydroponic towers.

## Key Features
- **Zero database**: All product pricing, plant sites, estimated delivery timelines, and contact info live in [`src/config/site.ts`](./src/config/site.ts).
- **Session-based Pre-Order Cart**: Guests add **Phytaros Mini** (4 blocks) and/or **Phytaros Tower** (8 blocks) without creating an account (`sessionStorage`).
- **Cash on Delivery · Delivery Included**: Server-side price recalculation prevents tampering.
- **Automated Dual Email Notifications (Resend)**:
  1. **Boss / Admin email**: Full pre-order details + **1-click "Confirm on WhatsApp"** link pre-filled with the customer's order reference and items.
  2. **Customer confirmation email**: Order summary, estimated delivery, and notice that our team will contact them on WhatsApp as soon as possible.
- **Waitlist & B2B Inquiry Modal**: Handles SmartCap Waitlist, Farming-as-a-Service, and general inquiries.
- **Google Cloud Run Ready**: Standalone Next.js build + multi-stage `Dockerfile` + `/api/health` probe.

## Local Development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> Without `RESEND_API_KEY` in `.env.local`, submitting a pre-order runs in **dry-run mode** and prints the order summary + admin WhatsApp confirmation URL directly to your terminal.

## Configuring Prices, Plant Sites & Contact Info

Edit [`src/config/site.ts`](./src/config/site.ts):
- `SITE_CONFIG.products` → update `priceMad`, `plantSites`, `estimatedDelivery`.
- `SITE_CONFIG.preorder` → update `estimatedDelivery` and confirmation messaging.
- `SITE_CONFIG.contact` → update `email`, `phoneDisplay`, `whatsappNumber`, `instagramHandle`.


