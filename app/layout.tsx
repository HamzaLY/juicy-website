import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { brand } from "@/content/site";
import { CartProvider } from "@/components/cart/CartProvider";
import { ProductDialogProvider } from "@/components/menu/ProductDialogProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { PageEffects } from "@/components/layout/PageEffects";
import "./globals.css";

// Fonts are self-hosted from the Fontsource packages (SIL Open Font License), so pages never call Google.
const display = localFont({
  src: [{ path: "../node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-standard-normal.woff2", weight: "200 800", style: "normal" }],
  variable: "--font-bricolage",
  display: "swap",
  fallback: ["Arial Black", "system-ui", "sans-serif"],
  declarations: [{ prop: "font-stretch", value: "75% 100%" }],
});

const body = localFont({
  src: [
    { path: "../node_modules/@fontsource/instrument-sans/files/instrument-sans-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../node_modules/@fontsource/instrument-sans/files/instrument-sans-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../node_modules/@fontsource/instrument-sans/files/instrument-sans-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-instrument",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "sans-serif"],
});

const mono = localFont({
  src: [
    { path: "../node_modules/@fontsource/dm-mono/files/dm-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../node_modules/@fontsource/dm-mono/files/dm-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-dm-mono",
  display: "swap",
  fallback: ["ui-monospace", "Cascadia Mono", "monospace"],
});

// DEPLOY STEP: set NEXT_PUBLIC_SITE_URL to the live address so Open Graph and canonical URLs are absolute.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brand.name}: ${brand.tagline}`,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: brand.name,
    title: `${brand.name}: ${brand.tagline}`,
    description: brand.description,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#FF7A1A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks JS as available before paint, so scroll reveals never hide content for no-JS visitors. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-ink px-5 py-3 font-semibold text-pulp focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <CartProvider>
          <ProductDialogProvider>
            <Nav />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer />
            <CartDrawer />
          </ProductDialogProvider>
        </CartProvider>
        <PageEffects />
      </body>
    </html>
  );
}
