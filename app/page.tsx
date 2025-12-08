// app/page.tsx
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  metadataBase: new URL("https://oasisintlrealestate.com"),
  title: "831 Partington Avenue — Executive Rental Near UWindsor | Oasis Real Estate",
  description:
    "Executive 3 bedroom + finished basement home for rent near the University of Windsor. Updated interior, private yard, driveway parking and a quiet residential street.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "831 Partington Avenue — Executive Rental Near UWindsor",
    description:
      "Executive 3 bedroom + finished basement home for rent near UWindsor. Bright living spaces, modern finishes, private yard and parking in a prime location.",
    url: "https://oasisintlrealestate.com/",
    siteName: "Oasis International Real Estate",
    type: "website",
    images: [
      {
        url: "/images/partington/front-1.jpg", // swap with your real front photo
        width: 1200,
        height: 630,
        alt: "Front exterior of 831 Partington Avenue in Windsor, Ontario",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "831 Partington Avenue — Executive Rental Near UWindsor",
    description:
      "Executive 3 bedroom + finished basement home for rent near UWindsor. Updated interior, private yard and driveway parking on a quiet residential street.",
    images: ["/images/partington/front-1.jpg"],
  },
};

// JSON-LD so Google understands this is a rental property
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SingleFamilyResidence",
  name: "831 Partington Avenue – Executive 3 Bedroom Rental",
  description:
    "Executive 3 bedroom + finished basement home for rent near the University of Windsor. Updated interior finishes, private yard, driveway parking, and a quiet street. Ideal for professionals or mature students.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "831 Partington Ave",
    addressLocality: "Windsor",
    addressRegion: "ON",
    postalCode: "N9B 2N9",
    addressCountry: "CA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 42.295, // approximate; adjust if you want
    longitude: -83.052,
  },
  numberOfRooms: 3,
  numberOfBathroomsTotal: 1,
  url: "https://oasisintlrealestate.com/",
  image: [
    "https://oasisintlrealestate.com/images/partington/front-1.jpg",
    "https://oasisintlrealestate.com/images/partington/livingroom-1.jpg",
    "https://oasisintlrealestate.com/images/partington/kitchen-1.jpg",
  ],
  offers: {
    "@type": "Offer",
    price: 2500,
    priceCurrency: "CAD",
    availability: "https://schema.org/InStock",
    url: "https://oasisintlrealestate.com/",
  },
};

const gallerySections = [
  {
    title: "Exterior & Street",
    description: "Clean curb appeal on a quiet residential street near the University of Windsor.",
    images: [
      "/images/partington/front-1.jpg",
      "/images/partington/front-2.jpg",
    ],
  },
  {
    title: "Living Space",
    description: "Bright main-floor living area with space to relax or study.",
    images: [
      "/images/partington/livingroom-1.jpg",
      "/images/partington/livingroom-2.jpg",
    ],
  },
  {
    title: "Kitchen & Dining",
    description: "Updated kitchen with modern finishes and space for everyday cooking.",
    images: [
      "/images/partington/kitchen-1.jpg",
      "/images/partington/kitchen-2.jpg",
    ],
  },
  {
    title: "Bedrooms",
    description: "Comfortable bedrooms with closets and natural light.",
    images: [
      "/images/partington/bedroom-1.jpg",
      "/images/partington/bedroom-2.jpg",
      "/images/partington/bedroom-3.jpg",
    ],
  },
  {
    title: "Bathroom",
    description: "Clean, updated bathroom with modern fixtures.",
    images: ["/images/partington/bathroom-1.jpg"],
  },
  {
    title: "Finished Basement",
    description: "Finished lower level, ideal as a rec room, study space, or second lounge.",
    images: [
      "/images/partington/basement-rec.jpg",
      "/images/partington/basement-bed.jpg",
    ],
  },
  {
    title: "Yard & Parking",
    description: "Private backyard and driveway parking for your convenience.",
    images: [
      "/images/partington/backyard.jpg",
      "/images/partington/driveway.jpg",
    ],
  },
];

function GalleryGrid() {
  return (
    <section
      id="photos"
      className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6 lg:p-8"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Property Photos
          </h2>
          <p className="text-sm text-slate-400">
            A visual feel for the home. Final media will be updated with full photo set.
          </p>
        </div>
        <p className="text-xs text-slate-500">
          Layout and finishes representative of the actual property.
        </p>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {gallerySections.map((section) => (
          <article
            key={section.title}
            className="group rounded-xl border border-slate-800 bg-slate-950/70 p-3 sm:p-4 shadow-sm transition hover:border-emerald-400/60 hover:shadow-emerald-500/10"
          >
            <h3 className="text-sm font-semibold text-slate-50">
              {section.title}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              {section.description}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {section.images.map((src) => (
                <div
                  key={src}
                  className="relative h-28 overflow-hidden rounded-lg border border-slate-800 bg-slate-900/80 sm:h-32"
                >
                  <Image
                    src={src}
                    alt={section.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        // @ts-expect-error - JSON.stringify is fine here
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-10 lg:pb-20 lg:pt-10">
        {/* Top: Title + CTA + Key info */}
        <section className="flex flex-col gap-6 border-b border-slate-800 pb-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-emerald-400">
              Oasis International Real Estate
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
              831 Partington Avenue — Executive Rental Near UWindsor
            </h1>
            <p className="text-sm text-slate-300 sm:text-base">
              An executive-style 3 bedroom home with a finished basement on a
              quiet residential street, just minutes from the University of
              Windsor. Ideal for professionals or mature students looking for a
              clean, well-maintained space in a convenient location.
            </p>

            <dl className="mt-3 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  Bedrooms
                </dt>
                <dd className="font-medium text-slate-100">3 + finished basement</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  Location
                </dt>
                <dd className="font-medium text-slate-100">
                  Near University of Windsor
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  Availability
                </dt>
                <dd className="font-medium text-slate-100">
                  Available immediately (flexible start date)
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="#inquiry"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-medium text-slate-950 shadow-sm transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Book a Viewing
              </a>
              <a
                href="#inquiry"
                className="inline-flex items-center justify-center rounded-full border border-emerald-500/70 px-5 py-2.5 text-sm font-medium text-emerald-300 transition hover:border-emerald-300 hover:text-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Apply Now
              </a>
            </div>
          </div>

          {/* Side highlight card */}
          <aside className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm sm:p-5">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Quick snapshot
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              <li className="flex items-start gap-2">
                <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>3 bedrooms + finished basement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Driveway parking and private backyard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Short walk to the University of Windsor</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Quiet residential neighbourhood with nearby amenities</span>
              </li>
            </ul>
            <p className="mt-4 text-xs text-slate-400">
              Pricing is competitive for the area. Please inquire for current
              rate and terms.
            </p>
          </aside>
        </section>

        {/* Highlights & details */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[1.6fr,1.2fr]">
          <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
            <h2 className="text-base font-semibold text-white">
              Inside the Home
            </h2>
            <p className="text-sm text-slate-300">
              The main floor offers a comfortable living area, an updated
              kitchen, and a functional layout that suits everyday living. The
              finished basement provides additional space as a rec room, study
              area, or second lounge — giving you flexibility depending on your
              lifestyle.
            </p>
            <ul className="grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
              <li className="flex gap-2">
                <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Bright main-floor living area
              </li>
              <li className="flex gap-2">
                <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Updated kitchen with modern finishes
              </li>
              <li className="flex gap-2">
                <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Finished basement for extra living or study space
              </li>
              <li className="flex gap-2">
                <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Private backyard and driveway parking
              </li>
            </ul>
          </div>

          <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
            <h2 className="text-base font-semibold text-white">
              Ideal For
            </h2>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex gap-2">
                <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Professionals seeking a quiet, well-kept home close to the city
                core.
              </li>
              <li className="flex gap-2">
                <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Mature students who value a calm environment near campus.
              </li>
              <li className="flex gap-2">
                <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Small families looking for a balanced location and practical
                layout.
              </li>
            </ul>
            <p className="text-xs text-slate-400">
              Applications are reviewed on a case-by-case basis with an emphasis
              on fit, stability, and respect for the property and neighbours.
            </p>
          </div>
        </section>

        {/* Location & map */}
        <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr,1.6fr]">
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
            <h2 className="text-base font-semibold text-white">
              Location & Neighbourhood
            </h2>
            <p className="text-sm text-slate-300">
              Located at{" "}
              <span className="font-medium text-slate-100">
                831 Partington Ave, Windsor ON (N9B 2N9)
              </span>
              , this home sits in a quiet pocket near the University of Windsor
              with easy access to everyday essentials.
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex gap-2">
                <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Short walk to the University of Windsor campus.
              </li>
              <li className="flex gap-2">
                <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Close to transit routes, cafes, and local shops.
              </li>
              <li className="flex gap-2">
                <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Residential street with a calmer pace than main arteries.
              </li>
            </ul>
            <a
              href="https://maps.app.goo.gl/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-xs font-medium text-emerald-300 underline-offset-2 hover:underline"
            >
              Open in Google Maps
            </a>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-2 sm:p-3">
            <div className="relative h-64 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 sm:h-80">
              <iframe
                title="Map showing 831 Partington Avenue in Windsor, Ontario"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2939.815402292161!2d-83.054!3d42.294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0x0!2zNDLCsDE3JzM4LjQiTiA4M8KwMDMnMTQuNCJX!5e0!3m2!1sen!2sca!4v1700000000000"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </section>

        {/* Gallery */}
        <GalleryGrid />

        {/* Inquiry section */}
        <section
          id="inquiry"
          className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 lg:p-8"
        >
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">
                Request a Viewing or More Information
              </h2>
              <p className="text-sm text-slate-300">
                Share a bit about yourself and your preferred move-in timing.
                You’ll be contacted with next steps and potential viewing
                windows.
              </p>
            </div>
            <p className="text-xs text-slate-400">
              Serious, respectful applicants only. All information is kept
              confidential.
            </p>
          </div>

          {/* Simple HTML form posting to your existing API route.
             If you want a fancy React/AJAX form later, we can make a small client component. */}
          <form
            className="mt-2 grid gap-4 md:grid-cols-2"
            method="POST"
            action="/api/partington-inquiry"
          >
            <div className="space-y-1.5">
              <label
                htmlFor="fullName"
                className="text-xs font-medium text-slate-200"
              >
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/0 transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-slate-200"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/0 transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="phone"
                className="text-xs font-medium text-slate-200"
              >
                Phone (optional)
              </label>
              <input
                id="phone"
                name="phone"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/0 transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="intent"
                className="text-xs font-medium text-slate-200"
              >
                What would you like to do?
              </label>
              <select
                id="intent"
                name="intent"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/0 transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
                defaultValue="viewing"
              >
                <option value="viewing">Book a viewing</option>
                <option value="apply">Apply for the property</option>
                <option value="question">Ask a question</option>
              </select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label
                htmlFor="message"
                className="text-xs font-medium text-slate-200"
              >
                Tell us a bit about yourself
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/0 transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
                placeholder="Who will be living here? What do you do (work/study)? Desired move-in date? Any details you’d like to share."
              />
            </div>

            <div className="md:col-span-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-medium text-slate-950 shadow-sm transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Submit Inquiry
              </button>
              <p className="text-xs text-slate-500">
                By submitting, you consent to being contacted by Oasis
                International Real Estate regarding this property.
              </p>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
