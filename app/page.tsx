"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://www.oasisintlrealestate.com";
const PHONE_DISPLAY = "519-288-8882";
const PHONE_TEL = "tel:+15192888882";
const WEBSITE_DISPLAY = "oasisintlrealestate.com";
const WEBSITE = "https://www.oasisintlrealestate.com";

// ✅ Featured listing should be the AVAILABLE unit (1-bed addition)
const FEATURED = {
  title: "831 Partington Ave – Windsor, ON",
  href: "/properties/831-partington-1bed",
  rentText: "$1,100/month + utilities",
  furnishedText: "Not furnished",
  subtitle:
    "Bright 1-bedroom addition with full bathroom, kitchen, and living room — designed to feel open, spacious, and well-lit. Private entrance.",
  imageSrc: "/images/831-partington-1bed/831-partington-1bed-living-room.png",
  imageAlt:
    "Bright living room with kitchen view in the 1-bedroom addition at 831 Partington Ave.",
};

// ✅ Keep main unit listed for reuse, but clearly marked not available
const MAIN_UNIT = {
  title: "831 Partington Ave – Windsor, ON",
  href: "/properties/partington",
  statusText: "Main Unit Rented",
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
            description: "Owner-operated executive rental homes in Windsor, Ontario.",
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
          <header className="flex items-center justify-between gap-4 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-amber-300 to-amber-600 shadow-lg shadow-amber-500/30">
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

            <nav className="hidden items-center gap-6 text-xs font-medium text-slate-300 sm:flex">
              <Link href="/" className="hover:text-amber-300">
                Home
              </Link>
              <Link href="/properties" className="hover:text-amber-300">
                Properties
              </Link>

              {/* Featured is the available unit */}
              <Link href={FEATURED.href} className="hover:text-amber-300">
                831 Partington — 1 Bed
              </Link>

              {/* Keep main unit accessible but clearly marked */}
              <Link href={MAIN_UNIT.href} className="hover:text-amber-300">
                831 Partington{" "}
                <span className="ml-2 rounded-full border border-slate-700 bg-black/50 px-2 py-[2px] text-[10px] font-semibold text-slate-200">
                  {MAIN_UNIT.statusText}
                </span>
              </Link>

              <a href="#contact" className="hover:text-amber-300">
                Contact
              </a>

              <Link
                href={`${FEATURED.href}#partington-inquiry`}
                className="rounded-full bg-amber-400 px-4 py-1.5 text-xs font-semibold text-black shadow-md shadow-amber-500/30 hover:bg-amber-300"
              >
                Book a Viewing
              </Link>
            </nav>
          </header>

          {/* Hero */}
          <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-300">
                Owner-Operated Executive Rentals
              </p>

              <h1 className="mt-3 text-3xl font-semibold leading-snug text-slate-50 sm:text-4xl">
                Well-kept homes for tenants who care.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                We renovate, inspect, and maintain our homes with pride — built for
                long-term tenants who value respect, cleanliness, and clear communication.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={FEATURED.href}
                  className="rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-black shadow-lg shadow-amber-500/35 hover:bg-amber-300"
                >
                  View Featured Home
                </Link>

                <Link
                  href="/properties"
                  className="rounded-full border border-slate-700 bg-slate-950/60 px-5 py-2.5 text-sm text-slate-200 hover:border-amber-300 hover:text-amber-200"
                >
                  Browse Properties
                </Link>
              </div>

              <dl className="mt-8 grid gap-4 text-[11px] text-slate-300 sm:grid-cols-3">
                <div>
                  <dt className="text-slate-500">Who we rent to</dt>
                  <dd className="font-medium">Families, professionals, mature students</dd>
                </div>
                <div>
                  <dt className="text-slate-500">How we operate</dt>
                  <dd className="font-medium">
                    Owner-operated · clear standards · quick response
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Where we are</dt>
                  <dd className="font-medium">Windsor, Ontario · near UofW</dd>
                </div>
              </dl>

              {/* Calm, enterprise note */}
              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-[11px] text-slate-300">
                <p className="font-semibold text-amber-200">Availability update</p>
                <p className="mt-1">
                  The <span className="text-slate-100">3-bedroom main unit</span> at 831 Partington is{" "}
                  <span className="font-semibold text-slate-100">rented</span>. The{" "}
                  <span className="text-slate-100">1-bedroom addition</span> is currently{" "}
                  <span className="font-semibold text-amber-200">available</span>.
                </p>
              </div>
            </div>

            {/* Featured Card (AVAILABLE 1-bed) */}
            <Link
              href={FEATURED.href}
              className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-black shadow-[0_0_40px_rgba(251,191,36,0.25)] hover:border-amber-400/60"
            >
              <div className="relative h-72 w-full">
                <Image
                  src={FEATURED.imageSrc}
                  alt={FEATURED.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              <div className="absolute right-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-semibold text-black shadow-md shadow-amber-500/25">
                {FEATURED.rentText}
              </div>

              <div className="absolute left-4 top-4 rounded-full border border-amber-400/60 bg-black/55 px-3 py-1 text-[10px] font-semibold text-amber-200">
                Now Available
              </div>

              <div className="p-4">
                <p className="text-sm font-semibold text-amber-200">{FEATURED.title}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-300">
                  {FEATURED.subtitle}
                </p>
                <p className="mt-2 text-[11px] text-slate-400">
                  Furnishing: {FEATURED.furnishedText}
                </p>
                <p className="mt-3 text-[11px] text-slate-400">
                  Open full listing → photos, details, and viewing request form
                </p>
              </div>
            </Link>
          </section>

          {/* Divider */}
          <div className="mt-10 h-px w-full overflow-hidden rounded-full bg-slate-900">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400/55 to-transparent" />
          </div>

          {/* Institutional standards paragraph (short, calm) */}
          <section className="mt-10">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-300">
                The Oasis Standard
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
                Oasis International Real Estate Inc. is an owner-operated portfolio focused on
                long-term tenancy, consistent maintenance, and clear expectations. Homes are
                inspected and professionally prepared between tenancies, with a straightforward
                screening process designed to protect the property and ensure a quiet, respectful
                living environment for all residents.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="mt-14">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
                Contact
              </h2>

              <p className="mt-2 text-sm text-slate-300">
                Interested in this home or future Oasis rentals? Reach out directly — we respond
                personally.
              </p>

              <div className="mt-4 space-y-1 text-sm">
                <p>
                  Phone:{" "}
                  <a href={PHONE_TEL} className="text-amber-300 hover:underline">
                    {PHONE_DISPLAY}
                  </a>
                </p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:oasisintlrealestate@gmail.com"
                    className="text-amber-300 hover:underline"
                  >
                    oasisintlrealestate@gmail.com
                  </a>
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                  <Link
                    href={`${FEATURED.href}#partington-inquiry`}
                    className="inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-2 text-[11px] font-semibold text-black shadow-lg shadow-amber-500/30 hover:bg-amber-300"
                  >
                    Request a Viewing
                  </Link>
                  <a
                    href="/forms/Oasis_Tenant_Application_831_Partington_2Page_FINAL.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-amber-400/70 bg-black/70 px-5 py-2 text-[11px] font-semibold text-amber-200 hover:bg-amber-500/10"
                  >
                    Download Application (PDF)
                  </a>
                </div>

                <p className="mt-3 text-[11px] text-slate-500">
                  Note: The 3-bedroom main unit at 831 Partington is currently rented. Please
                  inquire for the 1-bedroom addition or future availability.
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-12 border-t border-slate-900 pt-4 text-[10px] text-slate-500">
            <p>
              © {new Date().getFullYear()} Oasis International Real Estate Inc. · Executive Rentals ·
              Windsor, Ontario
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
                {WEBSITE_DISPLAY}
              </a>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
