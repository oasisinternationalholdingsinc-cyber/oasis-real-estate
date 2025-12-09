"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://www.oasisintlrealestate.com";

export default function OasisHomePage() {
  return (
    <>
      {/* SEO / JSON-LD for the brand */}
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
        {/* Soft ambient glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-amber-500/35 via-amber-500/8 to-transparent" />

        {/* PAGE WRAPPER */}
        <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-16 pt-16 sm:px-6 sm:pt-14 lg:px-8 lg:pt-10">
          {/* NAVBAR */}
          <header className="flex items-center justify-between gap-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-amber-300 to-amber-600 shadow-lg shadow-amber-500/40">
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
              <Link
                href="/properties/partington"
                className="hover:text-amber-300"
              >
                831 Partington
              </Link>
              <a href="#contact" className="hover:text-amber-300">
                Contact
              </a>
              <Link
                href="/properties/partington#inquire"
                className="rounded-full bg-amber-400 px-4 py-1.5 text-xs font-semibold text-black shadow-md shadow-amber-500/40 hover:bg-amber-300"
              >
                Book a Viewing
              </Link>
            </nav>
          </header>

          {/* HERO SECTION */}
          <section className="mt-4 grid w-full max-w-full gap-10 lg:mt-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.05fr)] lg:items-center">
            {/* LEFT: BRAND STORY */}
            <div className="w-full max-w-full">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-300">
                Executive Rentals · Owner-Operated
              </p>

              <h1 className="mt-3 max-w-full break-words text-3xl font-semibold leading-snug text-slate-50 sm:text-4xl">
                <span className="block">
                  Well-kept homes for tenants who care as much as we do.
                </span>
                <span className="mt-2 block text-[1.02rem] font-normal text-slate-200 sm:text-xl">
                  Oasis International Real Estate Inc. · Windsor, Ontario
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
                Oasis homes are renovated, inspected, and maintained with pride.
                We focus on long-term executive rentals for families,
                professionals, and mature students who value cleanliness,
                respect, and clear communication.
              </p>

              {/* HERO CTAS */}
              <div className="mt-6 flex flex-wrap gap-3 text-xs">
                <Link
                  href="/properties/partington"
                  className="inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-2 text-[11px] font-semibold text-black shadow-lg shadow-amber-500/40 hover:bg-amber-300"
                >
                  View 831 Partington
                </Link>
                <a
                  href="/forms/Oasis_Tenant_Application_831_Partington_2Page_FINAL.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-amber-400/70 bg-black/70 px-5 py-2 text-[11px] font-semibold text-amber-200 hover:bg-amber-500/10"
                >
                  Download Application (PDF)
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/60 px-5 py-2 text-[11px] font-medium text-slate-200 hover:border-amber-400 hover:text-amber-200"
                >
                  Join Our Waitlist
                </a>
              </div>

              {/* HERO QUICK PILLARS */}
              <dl className="mt-7 grid gap-4 text-[11px] text-slate-300 sm:grid-cols-3">
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

            {/* RIGHT: FEATURED PROPERTY SNAPSHOT */}
            <div className="space-y-4">
              <Link
                href="/properties/partington"
                className="group relative block overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-black shadow-[0_0_45px_rgba(251,191,36,0.35)]"
              >
                <div className="relative h-64 w-full sm:h-72 md:h-80">
                  <Image
                    src="/images/partington/front-exterior-renovated.jpg"
                    alt="Front view of 831 Partington Ave with landscaped planter and wood exterior."
                    fill
                    sizes="(min-width: 1024px) 420px, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-110"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>

                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-[10px] font-semibold text-amber-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                  Featured Executive Rental
                </div>

                <div className="flex items-center justify-between px-4 pb-4 pt-3">
                  <div>
                    <p className="text-xs font-semibold text-amber-200">
                      831 Partington Ave – Windsor, ON
                    </p>
                    <p className="text-[11px] text-slate-300">
                      Modern 3-bedroom home with finished basement, fenced
                      yard, and renovated interior. Minutes from the University
                      of Windsor.
                    </p>
                  </div>
                  <div className="hidden text-right text-[11px] text-slate-400 sm:block">
                    <p className="font-semibold text-amber-200">
                      View full listing
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Photos, details &amp; inquiry form
                    </p>
                  </div>
                </div>
              </Link>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-[11px] text-slate-300">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300">
                  What “Oasis Standard” Means
                </p>
                <ul className="mt-2 space-y-1.5">
                  <li>• Professionally cleaned and inspected between tenancies</li>
                  <li>• Clear expectations around care, noise, and respect</li>
                  <li>• Direct access to the owner for issues and repairs</li>
                  <li>• No “slumlord” shortcuts – we live by our reputation</li>
                </ul>
              </div>
            </div>
          </section>

          {/* WHY OASIS SECTION */}
          <section className="mt-16">
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
              Why Tenants Choose Oasis
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              We treat rental housing like a long-term partnership, not a
              transaction.
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
                <p className="text-[11px] font-semibold text-amber-200">
                  Respectful, Screened Tenants
                </p>
                <p className="mt-2 text-slate-300">
                  We look for tenants who care about their environment:
                  consistent income, good references, and a track record of
                  caring for their homes.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
                <p className="text-[11px] font-semibold text-amber-200">
                  Renovated &amp; Well-Maintained Homes
                </p>
                <p className="mt-2 text-slate-300">
                  Updated interiors, solid mechanics, and ongoing investment in
                  the property – not just “good enough to rent”.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
                <p className="text-[11px] font-semibold text-amber-200">
                  Clear Communication
                </p>
                <p className="mt-2 text-slate-300">
                  You always know who you&apos;re dealing with. No giant call
                  centres – just direct, respectful communication with the
                  owner.
                </p>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="mt-16">
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
              How the Process Works
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Simple, transparent steps from first contact to move-in.
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
                <p className="text-[11px] font-semibold text-amber-200">
                  1. View the Listing
                </p>
                <p className="mt-2 text-slate-300">
                  Start with the full photo tour and details for{" "}
                  <Link
                    href="/properties/partington"
                    className="text-amber-300 hover:underline"
                  >
                    831 Partington
                  </Link>
                  . Make sure the layout, location, and style fit what you&apos;re
                  looking for.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
                <p className="text-[11px] font-semibold text-amber-200">
                  2. Book a Viewing &amp; Apply
                </p>
                <p className="mt-2 text-slate-300">
                  Use the inquiry form on the property page and/or complete the{" "}
                  <a
                    href="/forms/Oasis_Tenant_Application_831_Partington_2Page_FINAL.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-300 hover:underline"
                  >
                    Oasis tenant application
                  </a>
                  . We&apos;ll follow up with available times and next steps.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
                <p className="text-[11px] font-semibold text-amber-200">
                  3. Screening &amp; Move-In
                </p>
                <p className="mt-2 text-slate-300">
                  Standard income, reference, and credit checks may apply. Once
                  approved, we sign the lease, review expectations, and hand you
                  the keys to a clean, ready home.
                </p>
              </div>
            </div>
          </section>

          {/* CONTACT / WAITLIST */}
          <section id="contact" className="mt-16">
            <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-br from-slate-950 via-slate-950 to-black px-5 py-6 shadow-[0_0_40px_rgba(251,191,36,0.22)] sm:px-7 sm:py-7">
              <div className="grid gap-7 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-start">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
                    Join the Oasis Waitlist
                  </h2>
                  <p className="mt-1 text-sm text-slate-300">
                    Interested in 831 Partington or future Oasis properties in
                    Windsor? Share a few details and we&apos;ll keep you posted
                    when options match what you&apos;re looking for.
                  </p>

                  <p className="mt-4 text-xs text-slate-300">
                    For now, we keep this simple: send us an email with your
                    name, desired move-in date, and who would be living in the
                    home. We&apos;ll respond personally.
                  </p>

                  <div className="mt-4 space-y-1 text-xs">
                    <p className="text-slate-400">Email</p>
                    <a
                      href="mailto:notifications@oasisintlrealestate.com?subject=Oasis%20Executive%20Rental%20Inquiry"
                      className="text-amber-300 hover:underline"
                    >
                      notifications@oasisintlrealestate.com
                    </a>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                    <Link
                      href="/properties/partington#inquire"
                      className="inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-2 text-[11px] font-semibold text-black shadow-lg shadow-amber-500/40 hover:bg-amber-300"
                    >
                      Go to Partington Inquiry Form
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

                <div className="rounded-2xl border border-amber-500/40 bg-black/60 p-4 text-[11px] text-slate-300">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300">
                    Our Commitment to Tenants
                  </p>
                  <p className="mt-2">
                    We&apos;re building Oasis for the long term. That means:
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    <li>• No surprise rent hikes mid-lease</li>
                    <li>• Reasonable, evidence-based standards for care</li>
                    <li>• Honest expectations on both sides from day one</li>
                    <li>• Homes that we&apos;d be proud to live in ourselves</li>
                  </ul>
                  <p className="mt-3 text-[10px] text-slate-500">
                    If you treat your home with respect and want a landlord who
                    does the same in return, we built this for you.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="mt-10 border-t border-slate-900 pt-4 text-[10px] text-slate-500">
            <p>
              © {new Date().getFullYear()} Oasis International Real Estate Inc.
              · Executive Rentals · Windsor, Ontario.
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
