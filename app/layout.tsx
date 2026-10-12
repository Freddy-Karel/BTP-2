import type { Metadata } from "next";
import { Manrope, Outfit } from "next/font/google";
import AdminBar from "@/components/AdminBar";
import TrackPageView from "@/components/TrackPageView";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://alliance-mobtp.ga",
  ),
  title: "ALLIANCE M.O BTP | Bâtiment & Travaux Publics — Libreville, Gabon",
  description:
    "ALLIANCE M.O BTP — entreprise gabonaise de bâtiment tout corps d'état, rénovation, réhabilitation et travaux publics. Basée à Libreville (Ancienne Sobraga).",
  keywords: [
    "BTP Gabon",
    "construction Libreville",
    "rénovation",
    "travaux publics",
    "ALLIANCE M.O BTP",
  ],
  icons: {
    icon: [
      { url: "/brand/favicon.ico" },
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "ALLIANCE M.O BTP | Bâtiment & Travaux Publics",
    description:
      "Bâtiment, rénovation et travaux publics à Libreville, Gabon. Une entreprise de confiance.",
    locale: "fr_GA",
    type: "website",
    images: [{ url: "/brand/logo-full.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ALLIANCE M.O BTP",
    description:
      "Bâtiment, rénovation et travaux publics à Libreville, Gabon.",
    images: ["/brand/logo-full.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <TrackPageView />
        <AdminBar />
      </body>
    </html>
  );
}
