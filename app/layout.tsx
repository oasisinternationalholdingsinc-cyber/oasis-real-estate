import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

// ✅ Full URL with protocol so `new URL` works during build
const BASE_URL = "https://www.oasisintlrealestate.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Oasis International Real Estate",
    template: "%s | Oasis International Real Estate",
  },
  description:
    "Curated executive rentals in Windsor, Ontario, maintained to a modern, health-focused standard.",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "Oasis International Real Estate – Executive Rentals in Windsor",
    description:
      "Explore modern, professionally managed executive rentals with upgraded mechanicals, clean air, and clean water.",
    url: BASE_URL,
    siteName: "Oasis International Real Estate",
    images: [
      {
        url: "/images/partington/front-exterior-renovated.jpg",
        width: 1200,
        height: 630,
        alt: "Oasis International Real Estate – 831 Partington Ave",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oasis International Real Estate – Executive Rentals in Windsor",
    description:
      "Modern, executive-style rental properties in Windsor, Ontario.",
    images: ["/images/partington/front-exterior-renovated.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-slate-100`}
      >
        {children}
      </body>
    </html>
  );
}
