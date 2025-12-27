"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://www.oasisintlrealestate.com";
const PHONE_DISPLAY = "519-288-8882";
const PHONE_TEL = "tel:+15192888882";
const WEBSITE = "https://www.oasisintlrealestate.com";

// Single source of truth for featured listing
const FEATURED = {
  title: "831 Partington Ave – Windsor, ON",
  href: "/properties/partington",
  rentText: "$2,200/month + utilities",
  furnishedText: "Fully furnished option available",
  subtitle:
    "Modern 3-bedroom main unit with finished basement, fenced yard, and renovated interior. Minutes from the University of Windsor.",
  imageSrc: "/images/partington/front-exterior-renovated.jpg",
  imageAlt:
    "Front view of 831 Partington Ave with landscaped planter and wood exterior.",
};

export default function OasisHomePage() {
  return (
    <>
      {/* SEO / JSON-LD */}
      <Script
        id="oasis-real-estate-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: "Oasis International Real Estate Inc.",
            description:
              "Owner-operated executive rental homes in Windsor, Ontario.",
            url: BASE_URL,
            address: {
              "@type": "PostalAddress",
              addressLocality: "Windsor",
              addressRegion: "ON",
              addressCountry: "CA",
            },
          }),
        }}
      />

      <div className="min-h-screen w-full bg-black text-slate-100 overflow-x-hidden">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-amber-500/30 via-amber-500/10 to-transparent" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-16 pt-16 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="flex items-center justify-between pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-amber-300 to-amber-600 shadow-lg">
                <span className="text-sm font-semibold text-black">O</span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                  Oasis International Real Estate
                </p>
                <p className="text-[11px] text-slate-400">
                  Executive Rentals · Windsor, Ontario
                </p>
              </div>
            </div>

            <nav className="hidden gap-6 text-xs font-medium text-slate-300 sm:flex">
              <Link href="/" className="hover:text-amber-300">
                Home
              </Link>
              <Link href="/properties" className="hover:text-amber-300">
                Properties
              </Link>
              <Link href={FEATURED.href} className="hover:text-amber-300">
                831 Partington
              </Link>
              <a href="#contact" className="hover:text-amber-300">
                Contact
              </a>
            </nav>
          </header>

          {/* Hero */}
          <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-300">
                Owner-Operated Executive Rentals
              </p>

              <h1 className="mt-3 text-3xl font-semibold leading-snug sm:text-4xl">
                Well-kept homes for tenants who care.
              </h1>

              <p className="mt-4 max-w-xl text-sm text-slate-300 sm:text-base">
                We renovate, inspect, and maintain our homes with pride — built
                for long-term tenants who value respect, cleanliness, and clear
                communication.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={FEATURED.href}
                  className="rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-black shadow-lg hover:bg-amber-300"
                >
                  View Featured Home
                </Link>

                <Link
                  href="/properties"
                  className="rounded-full border border-slate-700 px-5 py-2.5 text-sm text-slate-200 hover:border-amber-300 hover:text-amber-200"
                >
                  Browse Properties
                </Link>
              </div>
            </div>

            {/* Featured Card */}
            <Link
              href={FEATURED.href}
              className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-black shadow-[0_0_40px_rgba(251,191,36,0.25)]"
            >
              <div className="relative h-72 w-full">
                <Image
                  src={FEATURED.imageSrc}
                  alt={FEATURED.imageAlt}
                  fill
                  className="object-cover transition group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              <div className="absolute right-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-semibold text-black">
                {FEATURED.rentText}
              </div>

              <div className="p-4">
                <p className="text-sm font-semibold text-amber-200">
                  {FEATURED.title}
                </p>
                <p className="mt-1 text-[11px] text-slate-300">
                  {FEATURED.subtitle}
                </p>
                <p className="mt-2 text-[11px] text-slate-400">
                  Furnishing: {FEATURED.furnishedText}
                </p>
              </div>
            </Link>
          </section>

          {/* Contact */}
          <section id="contact" className="mt-16">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
                Contact
              </h2>

              <p className="mt-2 text-sm text-slate-300">
                Interested in this home or future Oasis rentals? Reach out
                directly — we respond personally.
              </p>

              <div className="mt-4 text-sm">
                <p>
                  Phone:{" "}
                  <a
                    href={PHONE_TEL}
                    className="text-amber-300 hover:underline"
                  >
                    {PHONE_DISPLAY}
                  </a>
                </p>
                <p className="mt-1">
                  Email:{" "}
                  <a
                    href="mailto:oasisintlrealestate@gmail.com"
                    className="text-amber-300 hover:underline"
                  >
                    oasisintlrealestate@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-12 border-t border-slate-900 pt-4 text-[10px] text-slate-500">
            <p>
              © {new Date().getFullYear()} Oasis International Real Estate Inc. ·
              Executive Rentals · Windsor, Ontario
            </p>
            <p className="mt-1">
              <a href={PHONE_TEL} className="text-amber-300 hover:underline">
                {PHONE_DISPLAY}
              </a>{" "}
              ·{" "}
              <a
                href={WEBSITE}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:underline"
              >
                oasisintlrealestate.com
              </a>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
