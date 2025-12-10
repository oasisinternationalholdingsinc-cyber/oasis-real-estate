"use client";

import { useState, useEffect, useRef, MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";

/* -------------------- Helpers -------------------- */

type GalleryImage = {
  src: string;
  alt: string;
  label: string;
};

function useFadeInOnView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.18 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

const galleryImages: GalleryImage[] = [
  {
    src: "/images/partington/front-exterior-renovated.jpg",
    alt: "Front exterior of 831 Partington Ave with modern renovation.",
    label: "Front Exterior – Renovated",
  },
  {
    src: "/images/partington/front-deck-renovated.jpg",
    alt: "Front deck with updated wood and railing.",
    label: "Front Entry Deck",
  },
  {
    src: "/images/partington/sunroom-large-windows.jpg",
    alt: "Sunroom with large windows and warm wood ceiling.",
    label: "Sunroom Entry",
  },
  {
    src: "/images/partington/livingroom-feature-wall.jpg",
    alt: "Living room with feature wall and TV niche.",
    label: "Living Room – Feature Wall",
  },
  {
    src: "/images/partington/livingroom-modern-renovation.jpg",
    alt: "Modern renovated living room with tile floors.",
    label: "Living Room – Open View",
  },
  {
    src: "/images/partington/kitchen-modern-updated.jpg",
    alt: "Updated kitchen with modern cabinets and backsplash.",
    label: "Kitchen – Modern Update",
  },
  {
    src: "/images/partington/bedroom-bright-cozy.jpg",
    alt: "Bright cozy bedroom with window and tile floors.",
    label: "Primary Bedroom",
  },
  {
    src: "/images/partington/bathroom-renovated.jpg",
    alt: "Renovated bathroom with walk-in shower.",
    label: "Bathroom – Renovated",
  },
  {
    src: "/images/partington/basement-laundry-renovated.jpg",
    alt: "Basement laundry area with washer and dryer.",
    label: "Basement Laundry",
  },
  {
    src: "/images/partington/backyard-private-fenced.jpg",
    alt: "Private fenced backyard with stone walkway.",
    label: "Backyard – Fenced",
  },
  {
    src: "/images/partington/backyard-private.jpg",
    alt: "Backyard view with grass and mature trees.",
    label: "Backyard – Rear View",
  },
  // Future mechanical shots (you can replace placeholders later):
  // {
  //   src: "/images/partington/furnace-high-efficiency.jpg",
  //   alt: "SMARTAIR 1000 high-efficiency furnace with media filter.",
  //   label: "High-Efficiency SMARTAIR Furnace",
  // },
  // {
  //   src: "/images/partington/reverse-osmosis-system.jpg",
  //   alt: "Reliance reverse osmosis water system under kitchen sink.",
  //   label: "Reverse Osmosis Water System",
  // },
];

export default function PartingtonPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [walkthroughPlaying, setWalkthroughPlaying] = useState(false);
  const [heroTiltStyle, setHeroTiltStyle] = useState<React.CSSProperties>({});

  /* ----- Walkthrough auto-play ----- */
  useEffect(() => {
    if (!walkthroughPlaying) return;
    if (lightboxIndex === null) {
      setLightboxIndex(0);
    }

    const id = setInterval(() => {
      setLightboxIndex((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % galleryImages.length;
      });
    }, 2600);

    return () => clearInterval(id);
  }, [walkthroughPlaying, lightboxIndex]);

  const openLightboxAt = (index: number) => {
    setLightboxIndex(index);
    setWalkthroughPlaying(false);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setWalkthroughPlaying(false);
  };

  const showPrev = (e?: MouseEvent) => {
    if (e) e.stopPropagation();
    setLightboxIndex((prev) =>
      prev === null
        ? 0
        : (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  const showNext = (e?: MouseEvent) => {
    if (e) e.stopPropagation();
    setLightboxIndex((prev) =>
      prev === null ? 0 : (prev + 1) % galleryImages.length
    );
  };

  const startWalkthrough = () => {
    setLightboxIndex(0);
    setWalkthroughPlaying(true);
  };

  /* ----- Smooth scroll to inquiry ----- */
  const scrollToInquiry = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("partington-inquiry");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  /* ----- Hero tilt effect ----- */
  const handleHeroMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const maxTilt = 6;
    const rotateX = (-y / (rect.height / 2)) * maxTilt;
    const rotateY = (x / (rect.width / 2)) * maxTilt;

    setHeroTiltStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
      transition: "transform 100ms ease-out",
    });
  };

  const resetHeroTilt = () => {
    setHeroTiltStyle({
      transform: "rotateX(0deg) rotateY(0deg) scale(1)",
      transition: "transform 220ms ease-out",
    });
  };

  /* ----- Fade-in hooks ----- */
  const heroFade = useFadeInOnView<HTMLDivElement>();
  const galleryFade = useFadeInOnView<HTMLDivElement>();
  const highlightsFade = useFadeInOnView<HTMLDivElement>();
  const quickFactsFade = useFadeInOnView<HTMLDivElement>();
  const inquiryFade = useFadeInOnView<HTMLDivElement>();

  return (
    <div className="min-h-screen w-full bg-black text-slate-100 overflow-x-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-amber-500/35 via-amber-500/8 to-transparent" />

      {/* Page wrapper */}
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-16 pt-16 sm:px-6 sm:pt-14 lg:px-8 lg:pt-10">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 pb-6">
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
            <Link href="/#properties" className="hover:text-amber-300">
              All Properties
            </Link>
            <span className="rounded-full bg-amber-400/10 px-3 py-1 text-amber-200">
              831 Partington – Main Unit
            </span>
          </nav>
        </header>

        {/* Hero */}
        <section
          ref={heroFade.ref}
          className={`mt-2 grid w-full max-w-full gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1.05fr)] lg:items-start ${
            heroFade.visible
              ? "opacity-100 translate-y-0 transition-all duration-700"
              : "opacity-0 translate-y-6"
          }`}
        >
          {/* Hero left */}
          <div className="w-full max-w-full">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-300">
              831 Partington Ave · Windsor, ON N9B 2N9
            </p>

            <h1 className="mt-3 max-w-full break-words text-3xl font-semibold leading-snug text-slate-50 sm:text-4xl md:text-5xl">
              Modern 3-bedroom main unit with finished basement & fenced yard
              <span className="mt-2 block text-[1.02rem] font-normal text-slate-200 sm:text-xl">
                Executive-style living for families, professionals, and mature
                students near the University of Windsor.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              This is the{" "}
              <span className="font-semibold text-amber-200">
                main unit of 831 Partington Ave
              </span>
              — a carefully renovated home with upgraded mechanical systems,
              clean air and water, and a quiet, efficient SMARTAIR furnace. It
              is managed as a long-term asset by Oasis, not a short-term crash
              pad.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
              <button
                onClick={scrollToInquiry}
                className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 px-5 py-2 text-sm font-semibold text-black shadow-lg shadow-amber-500/50 transition hover:from-amber-300 hover:to-amber-400"
              >
                <span className="mr-1.5">Book a Viewing</span>
                <span className="text-[11px] opacity-80 group-hover:opacity-100">
                  • Executive screening
                </span>
              </button>

              <a
                href="/forms/Oasis_Tenant_Application_831_Partington_OnePage.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-amber-400/60 bg-black/40 px-4 py-2 text-sm font-medium text-amber-100 shadow-[0_0_0_1px_rgba(15,23,42,1)] transition hover:border-amber-300 hover:text-amber-300"
              >
                Download Application (PDF)
              </a>

              <button
                type="button"
                onClick={startWalkthrough}
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-[11px] text-slate-300 transition hover:border-amber-300 hover:text-amber-200"
              >
                ▶ Start Walkthrough
              </button>
            </div>

            {/* Quick chips */}
            <div className="mt-5 flex flex-wrap gap-2 text-[11px] sm:text-xs">
              <span className="rounded-full border border-amber-400/70 bg-black/70 px-3 py-1 text-amber-200">
                Main unit · 3 bedrooms + finished basement
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 text-slate-200">
                1 bathroom · fenced backyard
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 text-slate-200">
                Driveway + street parking
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 text-slate-200">
                Tenant pays utilities (high-efficiency systems)
              </span>
            </div>
          </div>

          {/* Hero right – image with tilt */}
          <div
            className="space-y-4 [perspective:1200px]"
            onMouseMove={handleHeroMouseMove}
            onMouseLeave={resetHeroTilt}
          >
            <div
              style={heroTiltStyle}
              className="overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-black shadow-[0_0_40px_rgba(251,191,36,0.3)] transition-transform"
            >
              <div className="relative h-64 w-full sm:h-72 md:h-80">
                <Image
                  src="/images/partington/front-exterior-renovated.jpg"
                  alt="Front exterior of 831 Partington Ave."
                  fill
                  className="object-cover"
                  sizes="(min-width:1024px) 420px, 100vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>
              <div className="flex items-center justify-between px-4 pb-4 pt-3 text-[11px] text-slate-300">
                <span>Front exterior · 1 of {galleryImages.length} photos</span>
                <button
                  type="button"
                  onClick={() => openLightboxAt(0)}
                  className="text-amber-200 underline-offset-4 hover:underline"
                >
                  Open gallery
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-[11px] text-slate-300">
              <p className="font-semibold text-amber-200">Who this home suits</p>
              <p className="mt-2">
                Best suited for respectful, tidy tenants who appreciate a
                well-looked-after space: families, professionals, or mature
                students with stable income and good references. No smoking
                inside the home; quiet enjoyment for you and the neighbours is
                important.
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="mt-10 h-px w-full overflow-hidden rounded-full bg-slate-900">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400/60 to-transparent animate-pulse" />
        </div>

        {/* Gallery */}
        <section
          ref={galleryFade.ref}
          className={`mt-10 ${
            galleryFade.visible
              ? "opacity-100 translate-y-0 transition-all duration-700"
              : "opacity-0 translate-y-6"
          }`}
        >
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
                Photo Gallery
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                A full walk-through of the main unit at 831 Partington Ave. All
                photos are of the actual home.
              </p>
            </div>
            <button
              type="button"
              onClick={startWalkthrough}
              className="hidden items-center gap-1 rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1.5 text-[11px] text-slate-300 transition hover:border-amber-300 hover:text-amber-200 sm:inline-flex"
            >
              ▶ Walkthrough mode
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((img, index) => (
              <button
                key={img.src}
                type="button"
                onClick={() => openLightboxAt(index)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 text-left shadow-sm transition hover:border-amber-400/70 hover:shadow-[0_18px_45px_rgba(15,23,42,0.75)]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(min-width:1024px) 320px, 50vw"
                  />
                </div>
                <div className="px-3 py-2 text-xs text-slate-200 sm:text-sm">
                  {img.label}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Highlights */}
        <section
          ref={highlightsFade.ref}
          className={`mt-12 ${
            highlightsFade.visible
              ? "opacity-100 translate-y-0 transition-all duration-700"
              : "opacity-0 translate-y-6"
          }`}
        >
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
            Home Highlights – Main Unit
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            A renovated main unit with modern finishes, upgraded mechanicals,
            and a layout that works for real life.
          </p>

          <div className="mt-5 grid gap-5 text-xs sm:text-sm md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <h3 className="text-[11px] font-semibold text-amber-200 sm:text-xs">
                Main Floor & Everyday Living
              </h3>
              <ul className="mt-2 space-y-1.5 text-slate-300">
                <li>• Bright living room with feature wall and TV niche</li>
                <li>• Updated kitchen with modern cabinets & tile backsplash</li>
                <li>• Sunroom entry with large windows and warm wood ceiling</li>
                <li>• Renovated 3-piece bathroom with walk-in shower</li>
                <li>• Tile flooring for easy cleaning and durability</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <h3 className="text-[11px] font-semibold text-amber-200 sm:text-xs">
                Basement, Mechanical & Yard
              </h3>
              <ul className="mt-2 space-y-1.5 text-slate-300">
                <li>• Finished basement rec room / office space</li>
                <li>• Laundry area with washer & dryer in place</li>
                <li>
                  • New SMARTAIR high-efficiency furnace with commercial media
                  air filter
                </li>
                <li>
                  • Reverse osmosis (RO) drinking water system installed by
                  Reliance, with dedicated faucet at the kitchen sink
                </li>
                <li>• Fenced backyard and front deck for outdoor time</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Quick facts */}
        <section
          ref={quickFactsFade.ref}
          className={`mt-10 ${
            quickFactsFade.visible
              ? "opacity-100 translate-y-0 transition-all duration-700"
              : "opacity-0 translate-y-6"
          }`}
        >
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
            Quick Facts – Main Unit
          </h2>
          <dl className="mt-4 grid gap-4 text-[11px] text-slate-200 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-slate-500">Home type</dt>
              <dd>Main unit of detached home · 3 bedrooms + finished basement</dd>
            </div>
            <div>
              <dt className="text-slate-500">Parking</dt>
              <dd>Driveway + street parking (subject to city rules)</dd>
            </div>
            <div>
              <dt className="text-slate-500">Mechanical</dt>
              <dd>
                SMARTAIR high-efficiency furnace (2025) · media filter · smart
                thermostat
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Water system</dt>
              <dd>Reverse osmosis drinking water (Reliance installed)</dd>
            </div>
            <div>
              <dt className="text-slate-500">Lease & utilities</dt>
              <dd>12-month preferred · tenant pays utilities</dd>
            </div>
            <div>
              <dt className="text-slate-500">Ideal tenants</dt>
              <dd>
                Families, professionals, or mature students; quiet, respectful
                use only
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Pets / smoking</dt>
              <dd>No smoking inside; pets considered case-by-case</dd>
            </div>
            <div>
              <dt className="text-slate-500">Availability</dt>
              <dd>Reach out for current availability & rent</dd>
            </div>
          </dl>
        </section>

        {/* Inquiry form */}
        <section
          id="partington-inquiry"
          ref={inquiryFade.ref}
          className={`mt-12 ${
            inquiryFade.visible
              ? "opacity-100 translate-y-0 transition-all duration-700"
              : "opacity-0 translate-y-6"
          }`}
        >
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
            Book a Viewing / Request Details
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Share a few details below and we&apos;ll follow up with available
            times, next steps, and any questions about the{" "}
            <span className="font-semibold text-amber-200">
              main unit at 831 Partington Ave
            </span>
            .
          </p>

          {/* For now this is client-side only. Later you can wire to Supabase + Resend. */}
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
                Tell us a bit about yourself and what you&apos;re looking for
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
                I understand this is an executive-style main unit and agree to
                be contacted about availability, viewing times, and next steps.
              </span>
            </label>

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-black shadow-lg shadow-amber-500/40 hover:bg-amber-300"
            >
              Submit Inquiry
            </button>

            <div className="mt-3 space-y-1 text-[10px] text-slate-500">
              <p className="font-semibold">Screening note</p>
              <p>
                This home is maintained to an executive standard. Income
                verification, references, and credit checks may apply. We aim
                for a quiet, respectful environment for all.
              </p>
            </div>
          </form>
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-slate-900 pt-4 text-[10px] text-slate-500">
          <p>
            © {new Date().getFullYear()} Oasis International Real Estate Inc. ·
            Executive Rentals · Windsor, Ontario.
          </p>
          <p className="mt-1">
            Listing is for the{" "}
            <span className="font-semibold">main unit only</span> at 831
            Partington Ave. Details may change without notice; please inquire
            for the most current information.
          </p>
        </footer>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs text-slate-200 hover:bg-black"
          >
            ✕ Close
          </button>

          <div
            className="flex max-h-[90vh] max-w-4xl flex-col gap-3 px-4 text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-700 bg-black">
              <Image
                src={galleryImages[lightboxIndex].src}
                alt={galleryImages[lightboxIndex].alt}
                fill
                className="object-contain"
                sizes="(min-width:1024px) 800px, 100vw"
              />
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div>
                <p className="font-semibold">
                  {galleryImages[lightboxIndex].label}
                </p>
                <p className="text-slate-300">
                  Photo {lightboxIndex + 1} of {galleryImages.length}
                  {walkthroughPlaying && " · Walkthrough mode"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={showPrev}
                  className="rounded-full border border-slate-600 bg-black/60 px-3 py-1 text-xs hover:border-amber-300 hover:text-amber-200"
                >
                  ◀ Prev
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="rounded-full border border-slate-600 bg-black/60 px-3 py-1 text-xs hover:border-amber-300 hover:text-amber-200"
                >
                  Next ▶
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setWalkthroughPlaying((prev) => !prev || lightboxIndex === null)
                  }
                  className="rounded-full border border-slate-600 bg-black/60 px-3 py-1 text-xs hover:border-amber-300 hover:text-amber-200"
                >
                  {walkthroughPlaying ? "Pause walkthrough" : "Play walkthrough"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
