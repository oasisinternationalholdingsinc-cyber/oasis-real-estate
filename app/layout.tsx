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

// ✅ MUST include protocol or Next will throw ERR_INVALID_URL
const BASE_URL = "https://www.oasisintlrealestate.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Oasis International Real Estate",
    template: "%s | Oasis International Real Estate",
  },
  description:
    "Executive rental properties in Windsor, Ontario. Professionally managed homes with modern finishes and thoughtful details.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Oasis International Real Estate – Executive Rentals in Windsor",
    description:
      "Explore modern, professionally managed executive rental properties in Windsor, Ontario.",
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
