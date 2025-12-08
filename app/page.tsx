// app/partington/page.tsx
"use client";

import { FormEvent, useState } from "react";

type EmploymentType = "professional" | "student" | "family" | "other";

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  moveInDate: string;
  employmentType: EmploymentType;
  budget: string;
  pets: string;
  message: string;
}

const initialFormState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  moveInDate: "",
  employmentType: "professional",
  budget: "",
  pets: "",
  message: "",
};

export default function PartingtonPage() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (status !== "idle") {
      setStatus("idle");
      setStatusMessage(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    setStatusMessage(null);

    try {
      const res = await fetch("/api/partington-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to submit form");
      }

      setStatus("success");
      setStatusMessage(
        "Thank you for your interest. We’ve received your information and will follow up with qualified applicants."
      );
      setForm(initialFormState);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setStatusMessage("Something went wrong. Please try again or email oasisintlrealestate@gmail.com directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-slate-100">
      {/* Top nav */}
      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-black/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 shadow-lg shadow-amber-500/40" />
            <div className="flex flex-col leading-tight">
              <span className="text-xs uppercase tracking-[0.2em] text-amber-300">
                Oasis International Real Estate
              </span>
              <span className="text-sm text-slate-300">Executive Rentals — Windsor</span>
            </div>
          </div>
          <nav className="flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-slate-400">
            <a href="#gallery" className="hover:text-amber-300 transition">
              Gallery
            </a>
            <a href="#features" className="hover:text-amber-300 transition">
              Features
            </a>
            <a href="#location" className="hover:text-amber-300 transition">
              Location
            </a>
            <a
              href="#contact"
              className="rounded-full border border-amber-400/80 px-4 py-1 text-amber-200 hover:bg-amber-400 hover:text-black transition"
            >
              Book Viewing
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10">
        {/* HERO */}
        <section className="mb-12 grid gap-10 md:grid-cols-[1.2fr,1fr] md:items-center">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
              831 Partington Ave • Windsor, ON N9B 2N9
            </p>
            <h1 className="mb-4 text-3xl font-semibold text-slate-50 md:text-4xl">
              Modern 3-Bedroom Executive Home with Finished Basement –{" "}
              <span className="text-amber-300">Minutes from University</span>
            </h1>
            <p className="mb-4 max-w-xl text-sm text-slate-300">
              A newly renovated, spacious residence offering comfort, privacy, and premium living in one of Windsor’s
              most convenient neighbourhoods. Ideal for families, professionals, and mature students looking for a
              clean, modern home close to everything.
            </p>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/50 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                Available Immediately (Flexible Start Date)
              </span>
              <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-slate-300">
                $2,500 / month • 12-month lease
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:bg-amber-300 transition"
              >
                Book a Viewing
              </a>
              <a
                href="#gallery"
                className="inline-flex items-center justify-center rounded-full border border-amber-400/70 px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200 hover:bg-amber-400 hover:text-black transition"
              >
                View Gallery
              </a>
            </div>
          </div>

          {/* Hero image mock / slot */}
          <div className="relative h-64 overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-br from-zinc-900 via-zinc-800 to-amber-900/40 shadow-[0_0_80px_rgba(245,158,11,0.35)] md:h-80">
            {/* Replace this with real next/image later */}
            <div className="absolute inset-0 bg-[url('/images/partington/front-exterior.jpg')] bg-cover bg-center opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-amber-200/80">Executive Rental</p>
                <p className="text-sm font-medium text-slate-50">Spacious home with finished basement</p>
              </div>
              <div className="rounded-full bg-black/70 px-3 py-1 text-xs text-amber-200 border border-amber-400/60">
                Oasis • 831 Partington
              </div>
            </div>
          </div>
        </section>

        {/* HIGHLIGHTS */}
        <section className="mb-12 rounded-3xl border border-zinc-800 bg-black/60 p-5">
          <div className="grid gap-4 text-sm text-slate-200 md:grid-cols-3">
            <div className="flex items-start gap-3 border-zinc-800 md:border-r">
              <div className="mt-1 h-8 w-8 rounded-full bg-amber-400/10 text-lg flex items-center justify-center">
                🛏
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Layout</p>
                <p className="text-sm font-medium">3 bedrooms + 1 full bathroom</p>
                <p className="text-xs text-slate-400">Bright, comfortable rooms for families or shared living.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border-zinc-800 md:border-r">
              <div className="mt-1 h-8 w-8 rounded-full bg-amber-400/10 text-lg flex items-center justify-center">
                🏡
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Finished Basement</p>
                <p className="text-sm font-medium">Rec room + extra bedroom + flex space</p>
                <p className="text-xs text-slate-400">
                  Ideal for an office, gym, media room, or additional living area.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-8 w-8 rounded-full bg-amber-400/10 text-lg flex items-center justify-center">
                📍
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Location</p>
                <p className="text-sm font-medium">Minutes from University of Windsor</p>
                <p className="text-xs text-slate-400">
                  Quiet residential street with convenient access to transit, shopping, and Riverside.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY (structure only, you’ll plug real images) */}
        <section id="gallery" className="mb-14">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
              Gallery
            </h2>
            <p className="text-xs text-slate-400">Interior, exterior, and finished basement views.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {/* Example placeholders – replace bg-[url] paths when you have images */}
            <GalleryCard label="Living Area" image="/images/partington/living-room.jpg" />
            <GalleryCard label="Kitchen" image="/images/partington/kitchen.jpg" />
            <GalleryCard label="Primary Bedroom" image="/images/partington/bedroom-1.jpg" />
            <GalleryCard label="Finished Basement" image="/images/partington/basement-rec.jpg" />
            <GalleryCard label="Basement Bedroom" image="/images/partington/basement-bed.jpg" />
            <GalleryCard label="Backyard & Deck" image="/images/partington/backyard-deck.jpg" />
          </div>
        </section>

        {/* FEATURES & LOCATION */}
        <section id="features" className="mb-14 grid gap-10 md:grid-cols-[1.3fr,1fr]">
          {/* Overview + interior/exterior */}
          <div className="space-y-6">
            <div>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
                Property Overview
              </h2>
              <p className="text-sm text-slate-300">
                This modern, executive-style home combines a renovated interior with a fully finished basement, private
                driveway, and spacious backyard. It offers the comfort and feel of a stand-alone family home with
                premium finishes and thoughtful layout.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-xs uppercase tracking-[0.2em] text-amber-300">Interior Features</h3>
                <ul className="space-y-1 text-sm text-slate-300">
                  <li>• Bright living room with modern finishes</li>
                  <li>• Updated kitchen with clean cabinetry</li>
                  <li>• 3 well-proportioned bedrooms</li>
                  <li>• Stylish full bathroom</li>
                  <li>• Finished basement: rec room, bedroom, flex space</li>
                  <li>• Laundry and utility/storage area</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 text-xs uppercase tracking-[0.2em] text-amber-300">Exterior Features</h3>
                <ul className="space-y-1 text-sm text-slate-300">
                  <li>• Private driveway with multiple parking spots</li>
                  <li>• Fenced backyard with deck</li>
                  <li>• Quiet residential street</li>
                  <li>• Short distance to University of Windsor</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick facts card */}
          <aside className="h-fit rounded-3xl border border-amber-400/40 bg-black/70 p-5 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
            <h3 className="mb-3 text-xs uppercase tracking-[0.2em] text-amber-300">
              Key Details
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Rent</dt>
                <dd className="font-medium text-amber-200">$2,500 / month</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Lease Term</dt>
                <dd className="text-slate-100">12 months</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Availability</dt>
                <dd className="text-emerald-300">Immediately (Flexible Start Date)</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Utilities</dt>
                <dd className="text-slate-100">Tenant pays all utilities</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Parking</dt>
                <dd className="text-slate-100">Private driveway</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Pet Policy</dt>
                <dd className="text-slate-100">Case-by-case (quiet, well-trained pets)</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-slate-400">
              Smoking is not permitted. Ideal for families, professionals, and mature students who value quiet,
              well-maintained living spaces.
            </p>
          </aside>
        </section>

        {/* LOCATION */}
        <section id="location" className="mb-14 grid gap-8 md:grid-cols-[1.2fr,1fr] md:items-center">
          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
              Location
            </h2>
            <p className="mb-4 text-sm text-slate-300">
              Situated in a peaceful residential pocket of Windsor, this home sits just minutes from the University of
              Windsor with quick access to Riverside and downtown. The area offers a balance of convenience and
              privacy, with nearby transit, groceries, and everyday essentials.
            </p>
            <ul className="space-y-1 text-sm text-slate-300">
              <li>• University of Windsor — minutes away</li>
              <li>• Groceries, cafes, and dining within a short drive</li>
              <li>• Bus routes nearby for easy commuting</li>
              <li>• Quick access to Riverside drive and riverfront paths</li>
              <li>• Convenient route to downtown and border crossings</li>
            </ul>
          </div>
          <div className="h-56 rounded-3xl border border-zinc-800 bg-[radial-gradient(circle_at_top,_#facc15_0,_#020617_55%,_#020617_100%)] p-[1px] md:h-64">
            <div className="flex h-full flex-col justify-between rounded-3xl bg-black/90 p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Map Overview</p>
                <p className="text-sm font-medium text-slate-100">831 Partington Ave, Windsor, ON N9B 2N9</p>
              </div>
              <div className="mt-3 flex-1 rounded-2xl bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=831+Partington+Ave+Windsor+ON&zoom=15&size=600x300&key=YOUR_API_KEY')] bg-cover bg-center opacity-80">
                {/* Replace above bg with a real static map or <iframe> if desired */}
              </div>
              <p className="mt-3 text-[11px] text-slate-500">
                Exact location and directions are provided once a viewing is confirmed.
              </p>
            </div>
          </div>
        </section>

        {/* VIRTUAL TOUR */}
        <section className="mb-14">
          <div className="relative overflow-hidden rounded-3xl border border-amber-400/50 bg-black/80 p-6">
            <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_0_0,_rgba(250,204,21,0.4),transparent_55%),radial-gradient(circle_at_100%_100%,_rgba(251,191,36,0.35),transparent_55%)]" />
            <div className="relative flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-amber-300">
                  Virtual Tour
                </p>
                <h2 className="mb-2 text-lg font-semibold text-slate-50">
                  360° Walkthrough Tour Coming Soon
                </h2>
                <p className="text-sm text-slate-300">
                  We’re preparing a full video walkthrough so you can experience the home as if you’re already inside.
                  Check back soon for an immersive tour.
                </p>
              </div>
              <div className="flex h-16 w-28 items-center justify-center rounded-2xl border border-amber-400/70 bg-black/70">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-300/80 bg-amber-400/10">
                  <div className="ml-0.5 h-4 w-4 border-l-8 border-y-8 border-y-transparent border-l-amber-300" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT FORM */}
        <section id="contact" className="mb-12 rounded-3xl border border-zinc-800 bg-black/75 p-6">
          <div className="mb-6 md:flex md:items-end md:justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
                Book a Viewing
              </h2>
              <p className="mt-2 max-w-xl text-sm text-slate-300">
                Please complete the short form below to register your interest. We review every submission carefully and
                reach out to qualified applicants to schedule viewings.
              </p>
            </div>
            <p className="mt-3 text-xs text-slate-400 md:mt-0">
              Inquiries go to:{" "}
              <a
                href="mailto:oasisintlrealestate@gmail.com"
                className="font-medium text-amber-200 hover:text-amber-300"
              >
                oasisintlrealestate@gmail.com
              </a>
            </p>
          </div>

          {status !== "idle" && statusMessage && (
            <div
              className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${
                status === "success"
                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-200"
                  : "border-rose-500/60 bg-rose-500/10 text-rose-200"
              }`}
            >
              {statusMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
                Full Name
              </label>
              <input
                required
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-700 bg-black/60 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
                Email
              </label>
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-700 bg-black/60 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
                Phone
              </label>
              <input
                required
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-700 bg-black/60 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
                Preferred Move-In Date
              </label>
              <input
                required
                type="date"
                name="moveInDate"
                value={form.moveInDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-700 bg-black/60 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
                Employment Type
              </label>
              <select
                name="employmentType"
                value={form.employmentType}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-700 bg-black/60 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              >
                <option value="professional">Professional</option>
                <option value="student">Student</option>
                <option value="family">Family</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
                Monthly Budget (Approx.)
              </label>
              <input
                required
                name="budget"
                value={form.budget}
                onChange={handleChange}
                placeholder="$2,500"
                className="w-full rounded-xl border border-zinc-700 bg-black/60 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
                Pets (Case-by-Case)
              </label>
              <input
                name="pets"
                value={form.pets}
                onChange={handleChange}
                placeholder="e.g., No pets / 1 indoor cat / small, quiet dog"
                className="w-full rounded-xl border border-zinc-700 bg-black/60 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
                Tell us a bit about yourself
              </label>
              <textarea
                required
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder="Who will be living in the home, what you do, and your ideal move-in timing."
                className="w-full rounded-xl border border-zinc-700 bg-black/60 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <div className="md:col-span-2 flex items-center justify-between gap-3">
              <p className="text-[11px] text-slate-500">
                By submitting, you confirm the information provided is accurate to the best of your knowledge. You may
                be asked for supporting documents (e.g., proof of income, references) if shortlisted.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70 transition"
              >
                {isSubmitting ? "Submitting..." : "Submit Inquiry"}
              </button>
            </div>
          </form>
        </section>
      </main>

      <footer className="border-t border-zinc-800 bg-black/90">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-[11px] text-slate-500 md:flex-row">
          <span>Oasis International Real Estate • Executive Rentals — Windsor, Ontario</span>
          <span>© {new Date().getFullYear()} Oasis International Holdings Inc.</span>
        </div>
      </footer>
    </div>
  );
}

type GalleryCardProps = {
  label: string;
  image: string;
};

function GalleryCard({ label, image }: GalleryCardProps) {
  return (
    <div className="group relative h-40 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 md:h-48">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:opacity-100 transition"
        style={{ backgroundImage: `url('${image}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-50 drop-shadow">
          {label}
        </span>
        <span className="rounded-full border border-amber-400/70 bg-black/70 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-amber-200">
          View
        </span>
      </div>
    </div>
  );
}
