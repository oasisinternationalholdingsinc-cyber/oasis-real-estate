"use client";

import Image from "next/image";
import Link from "next/link";

export default function PartingtonPage() {
  return (
    <div className="min-h-screen w-full bg-black text-slate-100 overflow-x-hidden">
      {/* Same ambient glow style as homepage */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-amber-500/35 via-amber-500/8 to-transparent" />

      {/* PAGE WRAPPER – same spacing as homepage so nothing clips */}
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-16 pt-16 sm:px-6 sm:pt-14 lg:px-8 lg:pt-10">
        {/* NAVBAR (matches home) */}
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
            <span className="text-amber-300">831 Partington</span>
            <a href="#inquire" className="rounded-full bg-amber-400 px-4 py-1.5 text-xs font-semibold text-black shadow-md shadow-amber-500/40 hover:bg-amber-300">
              Book a Viewing
            </a>
          </nav>
        </header>

        {/* HERO */}
        <section className="mt-4 grid w-full max-w-full gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.05fr)] lg:items-start">
          {/* LEFT: Text */}
          <div className="w-full max-w-full">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-300">
              831 Partington Ave · Windsor, ON N9B 2N9
            </p>

            <h1 className="mt-3 max-w-full break-words text-3xl font-semibold leading-snug text-slate-50 sm:text-4xl md:text-5xl">
              Modern 3-bedroom executive home with finished basement
              <span className="mt-2 block text-[1.02rem] font-normal text-slate-200 sm:text-xl">
                Minutes from the University of Windsor · Professionally managed
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              A carefully renovated, move-in ready home for families,
              professionals, or mature students who care about where they live.
              Updated mechanicals, clean finishes, and a landlord who treats the
              property like a long-term investment, not a disposable rental.
            </p>

            {/* Quick facts pills */}
            <div className="mt-5 flex flex-wrap gap-2 text-[11px] sm:text-xs">
              <span className="rounded-full border border-amber-400/70 bg-black/70 px-3 py-1 text-amber-200">
                3 bedrooms + finished basement
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 text-slate-200">
                1 bathroom · fenced yard
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 text-slate-200">
                Driveway + street parking
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 text-slate-200">
                New furnace & modern finishes
              </span>
            </div>
          </div>

          {/* RIGHT: Main photo card */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-black shadow-[0_0_40px_rgba(251,191,36,0.3)]">
              <div className="relative h-64 w-full sm:h-72 md:h-80">
                <Image
                  src="/images/partington/front-exterior-renovated.jpg"
                  alt="Front view of 831 Partington Ave – renovated exterior with wood accents and landscaped front."
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 420px, 100vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
              <div className="flex items-center justify-between px-4 pb-4 pt-3 text-[11px] text-slate-300">
                <span>Front exterior · 1 of X photos</span>
                <span className="text-amber-200">Tap for full gallery (coming soon)</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-[11px] text-slate-300">
              <p className="font-semibold text-amber-200">Who this home is for</p>
              <p className="mt-2">
                Best suited for respectful, tidy tenants who appreciate a well-kept space:
                families, professionals, or mature students with stable income and good references.
              </p>
            </div>
          </div>
        </section>

        {/* HIGHLIGHTS */}
        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
            Home Highlights
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Renovated interior, modern finishes, and thoughtful layout.
          </p>

          <div className="mt-5 grid gap-5 md:grid-cols-2 text-xs sm:text-sm">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <h3 className="text-[11px] font-semibold text-amber-200 sm:text-xs">
                Main Floor
              </h3>
              <ul className="mt-2 space-y-1.5 text-slate-300">
                <li>• Bright living room with feature wall and TV niche</li>
                <li>• Modern kitchen with updated cabinets & tile backsplash</li>
                <li>• Glossy tile flooring for easy cleaning</li>
                <li>• Renovated 3-piece bathroom with walk-in shower</li>
                <li>• Front sunroom entry with wood ceiling and large windows</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <h3 className="text-[11px] font-semibold text-amber-200 sm:text-xs">
                Lower Level & Exterior
              </h3>
              <ul className="mt-2 space-y-1.5 text-slate-300">
                <li>• Finished basement rec room / office space</li>
                <li>• Laundry area with washer & dryer</li>
                <li>• Fenced backyard with stone walkway</li>
                <li>• Front deck for morning coffee or late-night wind-down</li>
                <li>• New furnace installed and maintained</li>
              </ul>
            </div>
          </div>
        </section>

        {/* QUICK FACTS */}
        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
            Quick Facts
          </h2>
          <dl className="mt-4 grid gap-4 text-[11px] text-slate-200 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-slate-500">Home type</dt>
              <dd>Detached 3-bedroom with finished basement</dd>
            </div>
            <div>
              <dt className="text-slate-500">Parking</dt>
              <dd>Driveway + street (subject to city rules)</dd>
            </div>
            <div>
              <dt className="text-slate-500">Lease</dt>
              <dd>12-month preferred</dd>
            </div>
            <div>
              <dt className="text-slate-500">Utilities</dt>
              <dd>Tenant pays all utilities</dd>
            </div>
          </dl>
        </section>

        {/* INQUIRY FORM */}
        <section id="inquire" className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
            Book a Viewing / Request Details
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Share a few details and we&apos;ll follow up with available times, next
            steps, and any questions you have about 831 Partington Ave.
          </p>

          <form className="mt-5 space-y-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300">Full name</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-700 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300">Email</label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-slate-700 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  className="w-full rounded-lg border border-slate-700 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300">
                  Preferred move-in date
                </label>
                <input
                  type="date"
                  className="w-full rounded-lg border border-slate-700 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-300">
                Who will be living here?
              </label>
              <select className="w-full rounded-lg border border-slate-700 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400">
                <option>Professionals</option>
                <option>Family</option>
                <option>Mature students</option>
                <option>Other / Prefer not to say</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-300">
                Tell us a bit about yourself & what you&apos;re looking for
              </label>
              <textarea
                rows={4}
                className="w-full rounded-lg border border-slate-700 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400"
              />
            </div>

            <label className="flex items-start gap-2 text-[11px] text-slate-300">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-700 bg-black"
              />
              <span>
                I understand this is an executive rental and agree to be
                contacted about availability, viewing times, and next steps.
              </span>
            </label>

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-black shadow-lg shadow-amber-500/40 hover:bg-amber-300"
            >
              Submit Inquiry
            </button>

            <p className="mt-3 text-[10px] text-slate-500">
              This simple form does not replace a full application. Standard
              income, reference, and credit checks may apply.
            </p>
          </form>
        </section>

        {/* FOOTER */}
        <footer className="mt-10 border-t border-slate-900 pt-4 text-[10px] text-slate-500">
          <p>
            © {new Date().getFullYear()} Oasis International Real Estate Inc. ·
            Executive Rentals · Windsor, Ontario.
          </p>
          <p className="mt-1">
            This listing is for the main unit at 831 Partington Ave. Details may
            change without notice; please inquire for the most current
            information.
          </p>
        </footer>
      </div>
    </div>
  );
}
