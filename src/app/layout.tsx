import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Instrument_Sans,
  JetBrains_Mono,
} from "next/font/google";
import { SITE_CONFIG } from "@/config/site";
import { Providers } from "@/components/Providers";
// @ts-expect-error CSS is processed by Next.js and has no TypeScript module declaration.
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-bricolage",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: SITE_CONFIG.brand.metaTitle,
  description: SITE_CONFIG.brand.metaDescription,
  openGraph: {
    title: SITE_CONFIG.brand.metaTitle,
    description: SITE_CONFIG.brand.metaDescription,
    type: "website",
    locale: "en_US",
    siteName: SITE_CONFIG.brand.name,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen bg-ground text-ink font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
