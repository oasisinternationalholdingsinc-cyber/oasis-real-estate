"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent, MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { NurBanner } from "../../components/NurBanner";

/* -------------------- Listing config -------------------- */

const LISTING = {
  addressLine: "831 Partington Ave · Windsor, ON N9B 2N9",
  headline: "Modern 3-bedroom main unit with finished basement & fenced yard",
  subheadline:
    "Executive-style living for families, professionals, and mature students near the University of Windsor.",
  rentText: "$2,400/month + utilities",
  furnishedText: "Fully furnished option available (as shown in photos)",
  leaseText: "12-month preferred · long-term tenancy",
  unitText: "Main unit only · non-shared home",
  utilitiesText: "Tenant pays utilities (high-efficiency systems)",
};

type GalleryImage = { src: string; alt: string; label: string };

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
];

function useFadeInOnView<T extends HTMLElement>(threshold = 0.18) {
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
      { threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

export default function PartingtonPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [walkthroughPlaying, setWalkthroughPlaying] = useState(false);
  const [heroTiltStyle, setHeroTiltStyle] = useState<CSSProperties>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const heroFade = useFadeInOnView<HTMLDivElement>();
  const offerFade = useFadeInOnView<HTMLDivElement>();
  const galleryFade = useFadeInOnView<HTMLDivElement>();
  const fitFade = useFadeInOnView<HTMLDivElement>();
  const specsFade = useFadeInOnView<HTMLDivElement>();
  const inquiryFade = useFadeInOnView<HTMLDivElement>();

  /* Walkthrough auto-play (lightbox) */
  useEffect(() => {
    if (!walkthroughPlaying) return;
    if (lightboxIndex === null) setLightboxIndex(0);

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
      prev === null ? 0 : (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  const showNext = (e?: MouseEvent) => {
    if (e) e.stopPropagation();
    setLightboxIndex((prev) => (prev === null ? 0 : (prev + 1) % galleryImages.length));
  };

  const startWalkthrough = () => {
    setLightboxIndex(0);
    setWalkthroughPlaying(true);
  };

  const scrollToInquiry = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("partington-inquiry");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* Hero tilt (subtle) */
  const handleHeroMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const maxTilt = 5;
    const rotateX = (-y / (rect.height / 2)) * maxTilt;
    const rotateY = (x / (rect.width / 2)) * maxTilt;

    setHeroTiltStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`,
      transition: "transform 120ms ease-out",
    });
  };

  const resetHeroTilt = () => {
    setHeroTiltStyle({
      transform: "rotateX(0deg) rotateY(0deg) scale(1)",
      transition: "transform 240ms ease-out",
    });
  };

  /* Form submit */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const fullName = (formData.get("fullName") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const phone = (formData.get("phone") || "").toString().trim();
    const moveInDate = (formData.get("moveInDate") || "").toString().trim();
    const groupType = (formData.get("groupType") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();
    const consentChecked = formData.get("consent") === "on";

    if (!fullName || !email || !message) {
      setSubmitting(false);
      setSubmitStatus("error");
      setSubmitMessage("Please fill in your name, email, and a short message before submitting.");
      return;
    }

    try {
      const res = await fetch("/api/partington-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone: phone || undefined,
          moveInDate: moveInDate || undefined,
          groupType: groupType || undefined,
          message,
          consent: consentChecked,
          source: "Partington listing page",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Inquiry error:", data);
        setSubmitStatus("error");
        setSubmitMessage("Something went wrong submitting your inquiry. Please try again or email us directly.");
      } else {
        setSubmitStatus("success");
        setSubmitMessage("Thank you — your inquiry has been received. We’ll follow up with next steps and available viewing times.");
        form.reset();
      }
    } catch (err) {
      console.error("Inquiry network error:", err);
      setSubmitStatus("error");
      setSubmitMessage("We couldn't reach the server. Please check your connection or try again shortly.");
    } finally {
      setSubmitting(false);
    }
  };

  const fadeCls = (visible: boolean) =>
    visible
      ? "opacity-100 translate-y-0 transition-all duration-700"
      : "opacity-0 translate-y-6";

  return (
    <div className="min-h-screen w-full bg-black text-slate-100 overflow-x-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-amber-500/28 via-amber-500/8 to-transparent" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-16 pt-16 sm:px-6 sm:pt-14 lg:px-8 lg:pt-10">
        {/* Header (quiet frame) */}
        <header className="flex items-center justify-between gap-4 pb-4 sm:pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-amber-300 to-amber-600 shadow-lg shadow-amber-500/30">
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
            <Link href="/properties" className="hover:text-amber-300">
              All Properties
            </Link>
            <span className="rounded-full bg-amber-400/10 px-3 py-1 text-amber-200">
              831 Partington – Main Unit
            </span>
          </nav>
        </header>

        {/* Mobile back link */}
        <div className="mb-3 flex sm:hidden">
          <Link
            href="/properties"
            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-300"
          >
            <span>← Back to all properties</span>
          </Link>
        </div>

        {/* 1) HERO (cover page only: recognition + trust + ONE action) */}
        <section
          ref={heroFade.ref}
          className={`mt-1 grid w-full max-w-full gap-8 lg:gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start ${fadeCls(
            heroFade.visible
          )}`}
        >
          {/* Left */}
          <div className="w-full max-w-full">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-300">
              {LISTING.addressLine}
            </p>

            <h1 className="mt-2 max-w-full break-words text-[1.7rem] sm:text-3xl md:text-4xl font-semibold leading-snug text-slate-50">
              {LISTING.headline}
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              {LISTING.subheadline}
            </p>

            {/* One primary action */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={scrollToInquiry}
                className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-black shadow-lg shadow-amber-500/35 hover:bg-amber-300"
              >
                Book a Viewing
              </button>

              {/* Secondary action (quiet) */}
              <a
                href="#gallery"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/60 px-5 py-2.5 text-sm font-medium text-slate-200 hover:border-amber-300 hover:text-amber-200"
              >
                View Photos
              </a>
            </div>
          </div>

          {/* Right: calm proof card */}
          <div
            className="space-y-4 [perspective:1200px]"
            onMouseMove={handleHeroMouseMove}
            onMouseLeave={resetHeroTilt}
          >
            <div
              style={heroTiltStyle}
              className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-950 to-black shadow-[0_0_35px_rgba(251,191,36,0.22)] transition-transform"
            >
              <div className="relative h-60 w-full sm:h-72 md:h-80">
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
          </div>
        </section>

        {/* 2) OFFER SNAPSHOT (calm, single pricing anchor) */}
        <section
          ref={offerFade.ref}
          className={`mt-8 ${fadeCls(offerFade.visible)}`}
        >
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">
                  Offer Snapshot
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Main unit only · non-shared home · long-term preferred
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-end">
                <span className="rounded-full bg-amber-400 px-4 py-1.5 text-sm font-semibold text-black shadow-md shadow-amber-500/25">
                  Rent: {LISTING.rentText}
                </span>
                <p className="mt-2 text-[11px] text-slate-400">
                  {LISTING.furnishedText} · {LISTING.leaseText}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 text-[11px] text-slate-300 sm:grid-cols-3">
              <div>
                <p className="text-slate-500">Unit</p>
                <p className="font-medium">{LISTING.unitText}</p>
              </div>
              <div>
                <p className="text-slate-500">Layout</p>
                <p className="font-medium">3 bedrooms + finished basement</p>
              </div>
              <div>
                <p className="text-slate-500">Utilities</p>
                <p className="font-medium">{LISTING.utilitiesText}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="mt-10 h-px w-full overflow-hidden rounded-full bg-slate-900">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400/55 to-transparent" />
        </div>

        {/* 3) PROOF — GALLERY (first scroll) */}
        <section
          id="gallery"
          ref={galleryFade.ref}
          className={`mt-10 ${fadeCls(galleryFade.visible)}`}
        >
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
                Photo Gallery
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                All photos are of the actual home.
              </p>
            </div>

            <button
              type="button"
              onClick={startWalkthrough}
              className="hidden items-center gap-1 rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-[11px] text-slate-300 transition hover:border-amber-300 hover:text-amber-200 sm:inline-flex"
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
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70 text-left transition hover:border-amber-400/60 hover:shadow-[0_18px_45px_rgba(15,23,42,0.75)]"
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

        {/* 4) FIT — WHO THIS HOME SUITS (gentle filter) */}
        <section
          ref={fitFade.ref}
          className={`mt-12 ${fadeCls(fitFade.visible)}`}
        >
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
            Who This Home Suits
          </h2>
          <p className="mt-1 text-sm text-slate-300 max-w-2xl">
            Best suited for respectful, tidy tenants who appreciate a well-looked-after
            space — families or professionals with stable income and good references.
          </p>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300">
                Expectations (Executive Standard)
              </p>
              <ul className="mt-3 space-y-1.5 text-[13px]">
                <li>• No smoking inside the home</li>
                <li>• Quiet enjoyment and respectful use</li>
                <li>• Care for finishes and cleanliness</li>
                <li>• Clear communication and follow-through</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300">
                What You Get
              </p>
              <ul className="mt-3 space-y-1.5 text-[13px]">
                <li>• Renovated interior and practical layout</li>
                <li>• Efficient SMARTAIR furnace + clean air focus</li>
                <li>• Reverse osmosis drinking water system</li>
                <li>• A calm, long-term rental approach</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 5) SPECS — HIGHLIGHTS + FACTS */}
        <section
          ref={specsFade.ref}
          className={`mt-12 ${fadeCls(specsFade.visible)}`}
        >
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
            Highlights &amp; Quick Facts
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Practical details for serious tenants.
          </p>

          <div className="mt-5 grid gap-5 text-xs sm:text-sm md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] font-semibold text-amber-200">
                Main Floor &amp; Everyday Living
              </p>
              <ul className="mt-2 space-y-1.5 text-slate-300">
                <li>• Bright living room with feature wall and TV niche</li>
                <li>• Updated kitchen with modern cabinets &amp; tile backsplash</li>
                <li>• Sunroom entry with large windows and warm wood ceiling</li>
                <li>• Renovated 3-piece bathroom with walk-in shower</li>
                <li>• Durable tile flooring for easy cleaning</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] font-semibold text-amber-200">
                Basement, Mechanical &amp; Yard
              </p>
              <ul className="mt-2 space-y-1.5 text-slate-300">
                <li>• Finished basement rec room / office space</li>
                <li>• Laundry area with washer &amp; dryer</li>
                <li>• SMARTAIR high-efficiency furnace (2025) + media filter</li>
                <li>• Reverse osmosis drinking water system (Reliance installed)</li>
                <li>• Fenced backyard + front deck</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 grid gap-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-5 text-[11px] text-slate-200 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-slate-500">Rent</p>
              <p className="font-semibold text-amber-200">{LISTING.rentText}</p>
              <p className="text-slate-300">{LISTING.furnishedText}</p>
            </div>
            <div>
              <p className="text-slate-500">Home type</p>
              <p>Main unit of detached home</p>
            </div>
            <div>
              <p className="text-slate-500">Parking</p>
              <p>Driveway + street parking (subject to city rules)</p>
            </div>
            <div>
              <p className="text-slate-500">Lease &amp; utilities</p>
              <p>{LISTING.leaseText}</p>
              <p className="text-slate-300">{LISTING.utilitiesText}</p>
            </div>
          </div>
        </section>

        {/* 6) CONVERSION — INQUIRY (commitment happens here) */}
        <section
          id="partington-inquiry"
          ref={inquiryFade.ref}
          className={`mt-12 ${fadeCls(inquiryFade.visible)}`}
        >
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
            Book a Viewing / Request Details
          </h2>
          <p className="mt-1 text-sm text-slate-300 max-w-2xl">
            Share a few details and we’ll follow up with available times and next steps.
          </p>

          <form
            className="mt-5 space-y-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-5 sm:p-6"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300" htmlFor="fullName">
                  Full name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="w-full rounded-lg border border-slate-700 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-300" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full rounded-lg border border-slate-700 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300" htmlFor="phone">
                  Phone (optional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="w-full rounded-lg border border-slate-700 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-300" htmlFor="moveInDate">
                  Preferred move-in date
                </label>
                <input
                  id="moveInDate"
                  name="moveInDate"
                  type="date"
                  className="w-full rounded-lg border border-slate-700 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-300" htmlFor="groupType">
                Who will be living here?
              </label>
              <select
                id="groupType"
                name="groupType"
                className="w-full rounded-lg border border-slate-700 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400"
                defaultValue="Professionals"
              >
                <option>Professionals</option>
                <option>Family</option>
                <option>Mature students</option>
                <option>Other / Prefer not to say</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-300" htmlFor="message">
                Tell us a bit about yourself and what you’re looking for
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full rounded-lg border border-slate-700 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400"
                required
              />
            </div>

            <label className="flex items-start gap-2 text-[11px] text-slate-300">
              <input
                type="checkbox"
                name="consent"
                className="mt-1 h-4 w-4 rounded border-slate-700 bg-black"
              />
              <span>
                I understand this is an executive-style main unit and agree to be contacted
                about availability, viewing times, and next steps.
              </span>
            </label>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-black shadow-lg shadow-amber-500/30 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Submitting..." : "Submit Inquiry"}
              </button>

              {submitStatus === "error" && submitMessage && (
                <p className="text-[11px] text-rose-300">{submitMessage}</p>
              )}
            </div>

            {submitStatus === "success" && (
              <NurBanner
                title="Viewing request received"
                body={
                  submitMessage ??
                  "Your request has been received. We’ll email you shortly to confirm a time or provide alternatives."
                }
              />
            )}

            <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
              <a
                href="/forms/Oasis_Tenant_Application_831_Partington_2Page_FINAL.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-amber-400/70 bg-black/70 px-5 py-2 text-[11px] font-semibold text-amber-200 hover:bg-amber-500/10"
              >
                Download Application (PDF)
              </a>
              <button
                type="button"
                onClick={startWalkthrough}
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/60 px-5 py-2 text-[11px] font-medium text-slate-200 hover:border-amber-300 hover:text-amber-200"
              >
                ▶ Walkthrough mode
              </button>
            </div>

            <div className="mt-4 space-y-1 text-[10px] text-slate-500">
              <p className="font-semibold">Screening note</p>
              <p>
                Income verification, references, and credit checks may apply. We aim for a quiet,
                respectful environment for all.
              </p>
            </div>
          </form>
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-slate-900 pt-4 text-[10px] text-slate-500">
          <p>
            © {new Date().getFullYear()} Oasis International Real Estate Inc. · Executive Rentals · Windsor, Ontario.
          </p>
          <p className="mt-1">
            Listing is for the <span className="font-semibold">main unit only</span> at 831 Partington Ave.
            Details may change without notice; please inquire for the most current information.
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
                <p className="font-semibold">{galleryImages[lightboxIndex].label}</p>
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
                  onClick={() => setWalkthroughPlaying((prev) => !prev)}
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
