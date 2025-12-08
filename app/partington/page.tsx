"use client";

import { useState } from "react";
import Image from "next/image";

type GalleryImage = {
  src: string;
  alt: string;
  label: string;
};

const galleryImages: GalleryImage[] = [
  {
    src: "/images/partington/front-exterior-renovated.jpg",
    alt: "Front view of 831 Partington Ave with landscaped planter and wood exterior.",
    label: "Front Exterior",
  },
  {
    src: "/images/partington/front-deck-renovated.jpg",
    alt: "Large front deck with railing, flowers, and walkway leading to 831 Partington Ave.",
    label: "Front Deck & Walkway",
  },
  {
    src: "/images/partington/livingroom-modern-renovation.jpg",
    alt: "Spacious living room with modern tile floors, red sectional sofa, and recessed lighting.",
    label: "Living Room – Full View",
  },
  {
    src: "/images/partington/livingroom-feature-wall.jpg",
    alt: "Feature wall with large built-in TV, fireplace, and black stone accent.",
    label: "Living Room Feature Wall",
  },
  {
    src: "/images/partington/kitchen-modern-updated.jpg",
    alt: "Modern kitchen with white counters, dark cabinets, and accent lighting.",
    label: "Modern Kitchen",
  },
  {
    src: "/images/partington/bathroom-renovated.jpg",
    alt: "Renovated bathroom with glass shower, vanity, and marble-style tile.",
    label: "Renovated Bathroom",
  },
  {
    src: "/images/partington/bedroom-bright-cozy.jpg",
    alt: "Bright bedroom with bed, window, and glossy tile floors.",
    label: "Bedroom",
  },
  {
    src: "/images/partington/sunroom-large-windows.jpg",
    alt: "Sunroom hallway with wood ceiling, large windows, and tile floor.",
    label: "Sunroom / Entry",
  },
  {
    src: "/images/partington/backyard-private.jpg",
    alt: "Private backyard with lawn, stone path, and fenced perimeter.",
    label: "Backyard – Grass & Stone Path",
  },
  {
    src: "/images/partington/backyard-private-fenced.jpg",
    alt: "Wide view of fenced backyard with trees and stone patio area.",
    label: "Backyard – Fenced Yard",
  },
  {
    src: "/images/partington/basement-laundry-renovated.jpg",
    alt: "Laundry area with washer, dryer, and wood countertop.",
    label: "Laundry Area",
  },
];

export default function PartingtonPage() {
  const [active, setActive] = useState<GalleryImage>(galleryImages[0]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<null | "ok" | "error">(null);

  // Lightbox state
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setSent(null);

    const formData = new FormData(e.currentTarget);
    const body = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/partington-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed");

      setSent("ok");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      setSent("error");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-slate-100">
      {/* Top gradient backdrop */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-amber-500/30 via-amber-500/5 to-transparent" />

      {/* Page wrapper */}
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-16 sm:px-6 sm:pt-14 lg:px-8 lg:pt-10">
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
            <a href="#gallery" className="hover:text-amber-300">
              Gallery
            </a>
            <a href="#features" className="hover:text-amber-300">
              Features
            </a>
            <a href="#location" className="hover:text-amber-300">
              Location
            </a>
            <a
              href="#inquire"
              className="rounded-full bg-amber-400 px-4 py-1.5 text-xs font-semibold text-black shadow-md shadow-amber-500/40 hover:bg-amber-300"
            >
              Book a Viewing
            </a>
          </nav>
        </header>

        {/* HERO */}
        <section className="mt-4 grid gap-10 lg:mt-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
          {/* Left: Text */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-300">
              831 Partington Ave · Windsor, ON N9B 2N9
            </p>

            {/* Two-line mobile-friendly heading */}
            <h1 className="mt-3 text-3xl font-semibold leading-snug text-slate-50 sm:text-4xl">
              <span className="block">
                Modern 3-Bedroom Executive Home with Finished Basement
              </span>
              <span className="mt-1 block text-[1.05rem] font-normal text-slate-200 sm:text-xl">
                Minutes from the University of Windsor
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
              A fully renovated, move-in ready home in one of Windsor&apos;s most
              convenient neighbourhoods. Ideal for families, professionals, or
              mature students looking for a clean, modern space close to the
              University of Windsor, transit, and riverside trails.
            </p>

            {/* Badges */}
            <div className="mt-5 flex flex-wrap gap-3 text-[11px]">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/60 bg-emerald-500/10 px-3 py-1 text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                Available Immediately (Flexible Start Date)
              </span>
              <span className="inline-flex items-center rounded-full border border-amber-400/60 bg-amber-500/10 px-3 py-1 text-amber-200">
                Executive rental · Inquire for pricing
              </span>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap gap-3 text-xs">
              <a
                href="#inquire"
                className="inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-2 text-[11px] font-semibold text-black shadow-lg shadow-amber-500/40 hover:bg-amber-300"
              >
                Book a Viewing
              </a>
              <a
                href="#gallery"
                className="inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-900/40 px-5 py-2 text-[11px] font-medium text-slate-200 hover:border-amber-400 hover:text-amber-200"
              >
                View Gallery
              </a>
            </div>

            {/* Quick specs */}
            <dl className="mt-7 grid gap-3 text-[11px] text-slate-300 sm:grid-cols-3">
              <div>
                <dt className="text-slate-500">Layout</dt>
                <dd className="font-medium">
                  3 bedrooms · 1 full bath · finished basement
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Parking</dt>
                <dd className="font-medium">
                  Driveway + street parking (subject to city rules)
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Utilities</dt>
                <dd className="font-medium">Tenant responsible for all utilities</dd>
              </div>
            </dl>
          </div>

          {/* Right: Hero image card */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-amber-500/20 via-amber-400/5 to-emerald-400/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-black shadow-[0_0_45px_rgba(251,191,36,0.35)]">
              <button
                type="button"
                className="relative block h-64 w-full sm:h-72 md:h-80"
                onClick={() => setLightbox(active)}
                aria-label="Open image in full screen"
              >
                <Image
                  src={active.src}
                  alt={active.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 380px, 100vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              </button>

              <div className="flex items-center justify-between px-4 pb-3 pt-3">
                <div>
                  <p className="text-[11px] font-medium text-amber-200">
                    {active.label}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Tap a thumbnail below to explore more rooms, or tap the big
                    photo to view full screen.
                  </p>
                </div>
                <span className="rounded-full bg-black/60 px-3 py-1 text-[10px] text-slate-200">
                  {galleryImages.indexOf(active) + 1} / {galleryImages.length}
                </span>
              </div>

              {/* Thumbnails row (scrollable on mobile) */}
              <div className="flex gap-2 overflow-x-auto px-3 pb-3 pt-1">
                {galleryImages.slice(0, 5).map((img) => (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => setActive(img)}
                    className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl border transition ${
                      active.src === img.src
                        ? "border-amber-400 shadow-md shadow-amber-500/40"
                        : "border-slate-700 hover:border-amber-300/70"
                    }`}
                    aria-label={img.label}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section id="gallery" className="mt-14">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
                Photo Gallery
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Get a feel for the space. All photos are of the actual home at
                831 Partington Ave.
              </p>
            </div>
          </div>

          {/* Responsive gallery grid */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {galleryImages.map((img) => (
              <button
                key={img.src}
                type="button"
                onClick={() => {
                  setActive(img);
                  setLightbox(img);
                }}
                className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40"
              >
                <div className="relative h-44 w-full sm:h-44 md:h-40 lg:h-44">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1024px) 260px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-300 group-hover:scale-105 group-hover:brightness-110"
                  />
                </div>
                <div className="flex items-center justify-between px-3 pb-2 pt-2 text-[11px]">
                  <span className="font-medium text-slate-100">{img.label}</span>
                  <span className="text-[10px] text-slate-500 group-hover:text-amber-300">
                    Tap to open
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="mt-16">
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
            Home Highlights
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Renovated with modern finishes and thoughtful touches throughout.
          </p>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-xs">
              <p className="text-[11px] font-semibold text-amber-200">
                Main Floor
              </p>
              <ul className="mt-2 space-y-1.5 text-slate-300">
                <li>Open living room with large feature wall &amp; TV niche</li>
                <li>Modern kitchen with updated cabinets and tile backsplash</li>
                <li>Bright bedroom with glossy tile floors</li>
                <li>Renovated 3-piece bathroom with walk-in shower</li>
                <li>Sunroom entry with wood ceiling and large windows</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-xs">
              <p className="text-[11px] font-semibold text-amber-200">
                Lower Level &amp; Yard
              </p>
              <ul className="mt-2 space-y-1.5 text-slate-300">
                <li>Finished basement living space (ideal rec room or office)</li>
                <li>Dedicated laundry area with washer &amp; dryer</li>
                <li>Private fenced backyard with stone walkway</li>
                <li>Front deck perfect for morning coffee or evening wind-down</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-xs">
              <p className="text-[11px] font-semibold text-amber-200">
                Location &amp; Lifestyle
              </p>
              <ul className="mt-2 space-y-1.5 text-slate-300">
                <li>Short drive or bus to the University of Windsor</li>
                <li>Quiet residential street with mature trees</li>
                <li>Easy access to transit, shopping, and riverside</li>
                <li>Ideal for respectful tenants who value a well-kept home</li>
              </ul>
            </div>
          </div>
        </section>

        {/* LOCATION */}
        <section id="location" className="mt-16">
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
            Location Snapshot
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            831 Partington Ave, Windsor, Ontario N9B 2N9
          </p>

          <div className="mt-4 grid gap-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-300">
              <p>
                Located in a convenient pocket of Windsor, this home sits close
                to the University of Windsor, major bus routes, and everyday
                amenities. It offers the best of both worlds: a quiet residential
                feel with easy access to campus, downtown, and the riverfront.
              </p>
              <ul className="mt-3 space-y-1.5">
                <li>• Approx. 5–10 minutes to University of Windsor (by car)</li>
                <li>• Close to groceries, cafes, and essential services</li>
                <li>• Residential street with mature trees and sidewalks</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-xs">
              <p className="text-[11px] font-semibold text-amber-200">
                Quick Facts
              </p>
              <dl className="mt-2 space-y-1.5 text-slate-300">
                <div className="flex justify-between gap-4">
                  <dt>Home type</dt>
                  <dd className="text-right">Detached 3-bedroom with basement</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Parking</dt>
                  <dd className="text-right">
                    Driveway + street (subject to city rules)
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Lease</dt>
                  <dd className="text-right">12-month preferred</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Utilities</dt>
                  <dd className="text-right">
                    Tenant responsible for all utilities
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* INQUIRY FORM */}
        <section id="inquire" className="mt-16">
          <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-br from-slate-950 via-slate-950 to-black px-5 py-6 shadow-[0_0_45px_rgba(251,191,36,0.25)] sm:px-7 sm:py-7">
            <div className="grid gap-7 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-start">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
                  Book a Viewing / Request Details
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                  Share a few details below and we&apos;ll follow up with next
                  steps, viewing times, and any questions you may have about 831
                  Partington Ave.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-4 space-y-3 text-xs"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[11px] text-slate-300">
                        Full name
                      </label>
                      <input
                        name="fullName"
                        required
                        className="w-full rounded-lg border border-slate-700 bg-black/60 px-3 py-2 text-xs text-slate-100 outline-none ring-amber-400/60 focus:border-amber-400 focus:ring"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] text-slate-300">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full rounded-lg border border-slate-700 bg-black/60 px-3 py-2 text-xs text-slate-100 outline-none ring-amber-400/60 focus:border-amber-400 focus:ring"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[11px] text-slate-300">
                        Phone (optional)
                      </label>
                      <input
                        name="phone"
                        className="w-full rounded-lg border border-slate-700 bg-black/60 px-3 py-2 text-xs text-slate-100 outline-none ring-amber-400/60 focus:border-amber-400 focus:ring"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] text-slate-300">
                        Preferred move-in date
                      </label>
                      <input
                        type="date"
                        name="moveInDate"
                        className="w-full rounded-lg border border-slate-700 bg-black/60 px-3 py-2 text-xs text-slate-100 outline-none ring-amber-400/60 focus:border-amber-400 focus:ring"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[11px] text-slate-300">
                        Who will be living here?
                      </label>
                      <select
                        name="groupType"
                        className="w-full rounded-lg border border-slate-700 bg-black/60 px-3 py-2 text-xs text-slate-100 outline-none ring-amber-400/60 focus:border-amber-400 focus:ring"
                      >
                        <option value="Professionals">Professionals</option>
                        <option value="Family">Family</option>
                        <option value="Students">Mature students</option>
                        <option value="Other">Other / Prefer not to say</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] text-slate-300">
                        How did you hear about this listing?
                      </label>
                      <input
                        name="source"
                        placeholder="Facebook, Marketplace, referral, etc."
                        className="w-full rounded-lg border border-slate-700 bg-black/60 px-3 py-2 text-xs text-slate-100 outline-none ring-amber-400/60 focus:border-amber-400 focus:ring"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] text-slate-300">
                      Tell us a bit about yourself and what you&apos;re looking
                      for
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      className="w-full rounded-lg border border-slate-700 bg-black/60 px-3 py-2 text-xs text-slate-100 outline-none ring-amber-400/60 focus:border-amber-400 focus:ring"
                    />
                  </div>

                  <div className="flex items-start gap-2 text-[11px] text-slate-400">
                    <input
                      type="checkbox"
                      name="consent"
                      required
                      className="mt-0.5 h-3 w-3 rounded border-slate-600 bg-black/60 text-amber-400 focus:ring-amber-400"
                    />
                    <span>
                      I understand this is an executive rental and I agree to be
                      contacted about availability, viewing times, and next
                      steps.
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={sending}
                      className="inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-2 text-[11px] font-semibold text-black shadow-lg shadow-amber-500/40 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {sending ? "Sending..." : "Submit Inquiry"}
                    </button>
                    {sent === "ok" && (
                      <span className="text-[11px] text-emerald-300">
                        Thank you — we received your inquiry.
                      </span>
                    )}
                    {sent === "error" && (
                      <span className="text-[11px] text-rose-300">
                        Something went wrong. Please try again.
                      </span>
                    )}
                  </div>
                </form>
              </div>

              <div className="rounded-2xl border border-amber-500/40 bg-black/50 p-4 text-[11px] text-slate-300">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300">
                  Quick Screening Note
                </p>
                <p className="mt-2">
                  This home has been renovated with care and is best suited for
                  respectful, tidy tenants who appreciate a well-kept space.
                </p>
                <ul className="mt-3 space-y-1.5">
                  <li>• Ideal for families, professionals, or mature students</li>
                  <li>• No large parties or disruptive behaviour</li>
                  <li>• Standard income, reference, and credit checks may apply</li>
                  <li>• Long-term renters preferred</li>
                </ul>
                <p className="mt-3 text-[10px] text-slate-500">
                  Sharing a bit about your group in the form helps us respond
                  faster and suggest the best viewing options.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-10 border-t border-slate-900 pt-4 text-[10px] text-slate-500">
          <p>
            © {new Date().getFullYear()} Oasis International Real Estate Inc. ·
            Executive Rentals · Windsor, Ontario.
          </p>
          <p className="mt-1">
            This listing is for the main unit at 831 Partington Ave. Details may
            change without notice; please inquire for the most up-to-date
            information.
          </p>
        </footer>
      </div>

      {/* LIGHTBOX OVERLAY */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs text-slate-100 hover:text-amber-300"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
          >
            Close ✕
          </div>
          <div
            className="relative w-full max-w-4xl max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={lightbox.src}
                alt={lightbox.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <p className="mt-3 text-center text-xs text-slate-200">
              {lightbox.label}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
