"use client";

import Image from "next/image";
import Link from "next/link";

const LISTINGS = [
  {
    id: "partington",
    title: "831 Partington Ave – Windsor, ON",
    href: "/properties/partington",
    rentText: "$2,200/month + utilities",
    subtitle:
      "Modern 3-bedroom main unit with finished basement, fenced yard, and renovated interior. Minutes from the University of Windsor.",
    imageSrc: "/images/partington/front-exterior-renovated.jpg",
    imageAlt:
      "Front exterior of 831 Partington Ave with landscaped planter and wood exterior.",
    tags: ["Main Unit", "Fenced Yard"],
  },
];

const PHONE_DISPLAY = "519-288-8882";
const PHONE_TEL = "tel:+15192888882";
const WEBSITE = "https://www.oasisintlrealestate.com";

export default function PropertiesPage() {
  const availableCount = LISTINGS.length;

  return (
    <div className="min-h-screen w-full bg-black text-slate-100 overflow-x-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-amber-500/35 via-amber-500/8 to-transparent" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-16 pt-16 sm:px-6 sm:pt-14 lg:px-8 lg:pt-10">
        {/* Header (match Partington/Home OS shell) */}
        <header className="flex items-center justify-between gap-4 pb-4 sm:pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-amber-300 to-amber-600 shadow-lg shadow-amber-500/40">
              <span className="text-sm font-semibold text-black">O</span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.20em] text-amber-300">
                Oasis International Real Estate Inc.
              </p>
              <p className="text-[11px] text-slate-400">
                Executive Rentals · Windsor, Ontario
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-xs font-medium text-slate-300 sm:flex">
            <Link href="/" className="hover:text-amber-300">
              Oasis Home
            </Link>
            <span className="rounded-full bg-amber-400/10 px-3 py-1 text-amber-200">
              All Properties
            </span>
            <a
              href="#waitlist"
              className="rounded-full bg-amber-400 px-4 py-1.5 text-xs font-semibold text-black shadow-md shadow-amber-500/40 hover:bg-amber-300"
            >
              Join Waitlist
            </a>
          </nav>
        </header>

        {/* Mobile back */}
        <div className="mb-3 flex sm:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-300"
          >
            <span>← Back to home</span>
          </Link>
        </div>

        {/* Hero */}
        <section className="mt-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-300">
            Inventory Console
          </p>

          <h1 className="mt-3 text-3xl font-semibold leading-snug text-slate-50 sm:text-4xl">
            Available Properties
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            A small, curated portfolio of executive rentals — maintained to the
            Oasis Standard.
          </p>

          {/* Status strip */}
          <div className="mt-6 grid gap-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-4 text-[11px] text-slate-200 sm:grid-cols-3">
            <div>
              <p className="text-slate-500">Current availability</p>
              <p className="font-semibold text-amber-200">
                {availableCount} home{availableCount === 1 ? "" : "s"}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Location</p>
              <p className="font-semibold">Windsor, Ontario</p>
            </div>
            <div>
              <p className="text-slate-500">Standard</p>
              <p className="font-semibold">
                Owner-operated · long-term · executive screening
              </p>
            </div>
          </div>
        </section>

        {/* Listings grid */}
        <section className="mt-10">
          <div className="grid gap-5 md:grid-cols-2">
            {LISTINGS.map((p) => (
              <Link
                key={p.id}
                href={p.href}
                className="group block overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/70 transition hover:border-amber-400/70 hover:shadow-[0_22px_55px_rgba(15,23,42,0.85)]"
              >
                <div className="relative h-56 w-full sm:h-64">
                  <Image
                    src={p.imageSrc}
                    alt={p.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 520px, 100vw"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  <div className="absolute right-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-semibold text-black shadow-lg shadow-amber-500/40">
                    {p.rentText}
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-sm font-semibold text-amber-200">
                    {p.title}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-300">
                    {p.subtitle}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2 text-[10px]">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-slate-700 bg-black/40 px-2.5 py-1 text-slate-200"
                      >
                        {t}
                      </span>
                    ))}
                    <span className="ml-auto text-[10px] font-semibold text-amber-200">
                      View listing →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Oasis Standard */}
        <section className="mt-10">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-300">
              The Oasis Standard
            </p>
            <ul className="mt-3 grid gap-2 text-[11px] text-slate-300 sm:grid-cols-2">
              <li>• Professionally cleaned & inspected between tenancies</li>
              <li>• Clear expectations around care, noise, and respect</li>
              <li>• Direct owner contact — no call-centre handoffs</li>
              <li>• Long-term tenancy mindset (not short-term churn)</li>
            </ul>
          </div>
        </section>

        {/* Waitlist */}
        <section id="waitlist" className="mt-12">
          <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-br from-slate-950 via-slate-950 to-black p-6 shadow-[0_0_40px_rgba(251,191,36,0.22)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-300">
              Don’t see a fit?
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-50">
              Join the waitlist
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Tell us what you’re looking for and we’ll notify you when an Oasis
              home matches your needs.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
              <a
                href="mailto:oasisintlrealestate@gmail.com?subject=Oasis%20Waitlist%20Request"
                className="inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-2 font-semibold text-black shadow-lg shadow-amber-500/40 hover:bg-amber-300"
              >
                Email Waitlist Request
              </a>
              <a
                href="/forms/Oasis_Tenant_Application_831_Partington_2Page_FINAL.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-amber-400/70 bg-black/60 px-5 py-2 font-semibold text-amber-200 hover:bg-amber-500/10"
              >
                Download Application (PDF)
              </a>
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

          <p className="mt-1">
            Oasis maintains a curated portfolio. Availability changes; inquire
            for the most current information.
          </p>
        </footer>
      </div>
    </div>
  );
}
