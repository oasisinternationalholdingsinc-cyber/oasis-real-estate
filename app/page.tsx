"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://www.oasisintlrealestate.com";

// Single source of truth for featured listing card
const FEATURED = {
  title: "831 Partington Ave – Windsor, ON",
  href: "/properties/partington",
  rentText: "$2,400/month + utilities",
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
      {/* SEO / JSON-LD for brand */}
      <Script
        id="oasis-real-estate-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: "Oasis International Real Estate Inc.",
            description:
              "Oasis International Real Estate Inc. offers carefully maintained executive rental homes in Windsor, Ontario.",
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
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-amber-500/28 via-amber-500/8 to-transparent" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-16 pt-14 sm:px-6 sm:pt-12 lg:px-8 lg:pt-10">
          {/* Header (quiet frame) */}
          <header className="flex items-center justify-between gap-4 pb-4 sm:pb-6">
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
              <Link href={FEATURED.href} className="hover:text-amber-300">
                831 Partington
              </Link>
              <a href="#contact" className="hover:text-amber-300">
                Contact
              </a>

              {/* Primary nav CTA stays, but links to listing (commitment happens there) */}
              <Link
                href={`${FEATURED.href}#partington-inquiry`}
                className="rounded-full bg-amber-400 px-4 py-1.5 text-xs font-semibold text-black shadow-md shadow-amber-500/30 hover:bg-amber-300"
              >
                Book a Viewing
              </Link>
            </nav>
          </header>

          {/* HERO (launcher: recognition + trust + inevitable next step) */}
          <section className="mt-2 grid w-full max-w-full gap-9 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center">
            {/* Left: simple message + ONE primary action */}
            <div className="w-full max-w-full">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-300">
                Executive Rentals · Owner-Operated
              </p>

              <h1 className="mt-3 max-w-full break-words text-3xl font-semibold leading-snug text-slate-50 sm:text-4xl">
                Well-kept homes for tenants who care as much as we do.
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                We renovate, inspect, and maintain our homes with pride — built
                for long-term tenants who value cleanliness, respect, and clear
                communication.
              </p>

              {/* One dominant action */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={FEATURED.href}
                  className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-black shadow-lg shadow-amber-500/35 hover:bg-amber-300"
                >
                  View Featured Home
                </Link>

                <Link
                  href="/properties"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/60 px-5 py-2.5 text-sm font-medium text-slate-200 hover:border-amber-300 hover:text-amber-200"
                >
                  Browse Properties
                </Link>
              </div>

              {/* Quiet pillars (supporting, not competing) */}
              <dl className="mt-8 grid gap-4 text-[11px] text-slate-300 sm:grid-cols-3">
                <div>
                  <dt className="text-slate-500">Who we rent to</dt>
                  <dd className="font-medium">
                    Families, professionals, mature students
                  </dd>
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
            </div>

            {/* Right: proof anchor (featured card) */}
            <div className="space-y-4">
              <Link
                href={FEATURED.href}
                className="group relative block overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-950 to-black shadow-[0_0_35px_rgba(251,191,36,0.22)] hover:border-amber-400/60"
              >
                <div className="relative h-64 w-full sm:h-72 md:h-80">
                  <Image
                    src={FEATURED.imageSrc}
                    alt={FEATURED.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 420px, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-110"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                </div>

                {/* Featured label (quiet) */}
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-[10px] font-semibold text-amber-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.85)]" />
                  Featured Executive Rental
                </div>

                {/* Price pill (single strong pricing signal) */}
                <div className="absolute right-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-semibold text-black shadow-md shadow-amber-500/25">
                  {FEATURED.rentText}
                </div>

                <div className="px-4 pb-4 pt-3">
                  <p className="text-xs font-semibold text-amber-200">
                    {FEATURED.title}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-300">
                    {FEATURED.subtitle}
                  </p>
                  <p className="mt-2 text-[11px] text-slate-300">
                    <span className="text-amber-200 font-semibold">
                      Furnishing:
                    </span>{" "}
                    {FEATURED.furnishedText}
                  </p>

                  <p className="mt-3 text-[11px] text-slate-400">
                    Open full listing → photos, details, and viewing request form
                  </p>
                </div>
              </Link>
            </div>
          </section>

          {/* Divider */}
          <div className="mt-10 h-px w-full overflow-hidden rounded-full bg-slate-900">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400/55 to-transparent" />
          </div>

          {/* Standards (below fold; fit module, not hero) */}
          <section className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
              The Oasis Standard
            </h2>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              A premium, quiet rental experience built on care, clarity, and
              consistent expectations — for tenants who value the same.
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
                <p className="text-[11px] font-semibold text-amber-200">
                  Clean &amp; Inspected
                </p>
                <p className="mt-2 text-slate-300">
                  Professionally cleaned and checked between tenancies — no
                  shortcuts.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
                <p className="text-[11px] font-semibold text-amber-200">
                  Clear Expectations
                </p>
                <p className="mt-2 text-slate-300">
                  Respect, reasonable noise, and property care — aligned from day
                  one.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
                <p className="text-[11px] font-semibold text-amber-200">
                  Direct Communication
                </p>
                <p className="mt-2 text-slate-300">
                  You know who you’re dealing with — owner-operated, responsive,
                  and respectful.
                </p>
              </div>
            </div>
          </section>

          {/* Process (short + calm) */}
          <section className="mt-14">
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
              How It Works
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Simple steps from viewing to move-in — no chaos, no surprises.
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
                <p className="text-[11px] font-semibold text-amber-200">
                  1. View the listing
                </p>
                <p className="mt-2 text-slate-300">
                  Explore photos, details, and suitability notes for the home.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
                <p className="text-[11px] font-semibold text-amber-200">
                  2. Request a viewing
                </p>
                <p className="mt-2 text-slate-300">
                  Use the property inquiry form — we respond with next steps and
                  available times.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
                <p className="text-[11px] font-semibold text-amber-200">
                  3. Screening &amp; move-in
                </p>
                <p className="mt-2 text-slate-300">
                  Standard verification may apply. Once approved, we sign, align
                  expectations, and hand over a clean home.
                </p>
              </div>
            </div>
          </section>

          {/* Contact / Waitlist (conversion lives near bottom) */}
          <section id="contact" className="mt-16">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 px-5 py-6 sm:px-7 sm:py-7">
              <div className="grid gap-7 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-start">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
                    Contact / Waitlist
                  </h2>
                  <p className="mt-1 text-sm text-slate-300">
                    Interested in the featured home or future Oasis rentals?
                    Email us your name, desired move-in date, and who would be
                    living in the home — we’ll respond personally.
                  </p>

                  <div className="mt-4 space-y-1 text-xs">
                    <p className="text-slate-400">Email</p>
                    <a
                      href="mailto:oasisintlrealestate@gmail.com?subject=Oasis%20Executive%20Rental%20Inquiry"
                      className="text-amber-300 hover:underline"
                    >
                      oasisintlrealestate@gmail.com
                    </a>
                  </div>

                  {/* Late-stage actions here, not hero */}
                  <div className="mt-5 flex flex-wrap gap-2 text-[11px]">
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
                </div>

                <div className="rounded-2xl border border-slate-800 bg-black/40 p-4 text-[11px] text-slate-300">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300">
                    Our Commitment
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    <li>• Honest expectations from day one</li>
                    <li>• Reasonable, evidence-based standards</li>
                    <li>• Respectful communication and responsiveness</li>
                    <li>• Homes we’re proud to stand behind</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-10 border-t border-slate-900 pt-4 text-[10px] text-slate-500">
            <p>
              © {new Date().getFullYear()} Oasis International Real Estate Inc. ·
              Executive Rentals · Windsor, Ontario.
            </p>
            <p className="mt-1">
              Oasis International Real Estate Inc. operates separately from the
              Oasis Digital Parliament governance platform. This site is focused
              solely on physical real estate and executive rentals.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
