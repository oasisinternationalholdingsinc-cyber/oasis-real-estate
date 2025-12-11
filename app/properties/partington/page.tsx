"use client";

import { useState, useEffect, useRef } from "react";
import type { CSSProperties, MouseEvent, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { NurBanner } from "../../components/NurBanner";

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

// 🔸 If you took more photos, just append them here with the same shape.
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

// 🔸 If you have a video file or YouTube URL, plug it here.
const WALKTHROUGH_VIDEO_MP4 = ""; // e.g. "/videos/partington-walkthrough.mp4"
const WALKTHROUGH_VIDEO_YOUTUBE = ""; // e.g. "https://www.youtube.com/embed/XXXXXXXX"

/* -------------------- Main Page -------------------- */

export default function PartingtonPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [walkthroughPlaying, setWalkthroughPlaying] = useState(false);
  const [heroTiltStyle, setHeroTiltStyle] = useState<CSSProperties>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(
    null
  );
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

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
  const scrollToInquiry = (
    e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
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

  /* ----- Form submit handler ----- */
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
      setSubmitMessage(
        "Please fill in your name, email, and a short message before submitting."
      );
      return;
    }

    try {
      const res = await fetch("/api/partington-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        setSubmitMessage(
          "Something went wrong submitting your inquiry. Please try again or email us directly."
        );
      } else {
        setSubmitStatus("success");
        setSubmitMessage(
          "Thank you — your inquiry has been received. We’ll follow up with next steps and available viewing times."
        );
        form.reset();
      }
    } catch (err) {
      console.error("Inquiry network error:", err);
      setSubmitStatus("error");
      setSubmitMessage(
        "We couldn't reach the server. Please check your connection or try again shortly."
      );
    } finally {
      setSubmitting(false);
    }
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
        {/* ... header, hero, gallery, highlights, quick facts ... (unchanged) */}

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

          <form
            className="mt-5 space-y-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-5 sm:p-6"
            onSubmit={handleSubmit}
          >
            {/* all your existing fields stay the same */}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-black shadow-lg shadow-amber-500/40 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
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
                  "Nūr has logged your request to view 831 Partington. We’ll email you shortly to confirm a time or provide alternatives."
                }
              />
            )}

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

        {/* Footer, lightbox, etc. remain exactly as you had them */}
        {/* ... */}
      </div>

      {/* Lightbox */}
      {/* ... your existing lightbox code unchanged ... */}
    </div>
  );
}
