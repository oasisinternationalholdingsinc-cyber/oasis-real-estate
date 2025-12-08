// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = "www.oasisintlrealestate.com"; // TODO: replace with your real domain

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Oasis International Real Estate | Executive Rentals in Windsor",
    template: "%s | Oasis International Real Estate",
  },
  description:
    "Premium, modern executive rentals in Windsor, Ontario. Explore renovated homes like 831 Partington Ave, ideal for families, professionals, and mature students.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Oasis International Real Estate | Executive Rentals in Windsor",
    description:
      "Premium, modern executive rentals in Windsor, Ontario. Explore renovated homes like 831 Partington Ave near the University of Windsor.",
    url: BASE_URL,
    siteName: "Oasis International Real Estate",
    images: [
      {
        url: "/images/partington/front-exterior-renovated.jpg",
        width: 1200,
        height: 630,
        alt: "Oasis International Real Estate – Executive Home in Windsor",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oasis International Real Estate",
    description:
      "Executive rentals and premium renovated homes in Windsor, Ontario.",
    images: ["/images/partington/front-exterior-renovated.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
