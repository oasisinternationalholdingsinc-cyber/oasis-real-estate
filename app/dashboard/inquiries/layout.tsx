// app/dashboard/inquiries/layout.tsx
import type { ReactNode } from "react";

export default function InquiriesLayout({
  children,
  list,
  thread,
  intel,
}: {
  children: ReactNode;
  list: ReactNode;
  thread: ReactNode;
  intel: ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-14rem)]">
      {/* Council Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* LEFT: Register */}
        <section className="col-span-12 lg:col-span-4 xl:col-span-3">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="px-4 py-3 border-b border-white/10 bg-black/30">
              <div className="text-sm font-semibold tracking-wide">
                Matters Register
              </div>
              <div className="text-xs text-white/50">
                Active • Archived • Bulk Actions
              </div>
            </div>
            <div className="h-[calc(100vh-18rem)] overflow-auto">{list}</div>
          </div>
        </section>

        {/* MIDDLE: Record */}
        <section className="col-span-12 lg:col-span-5 xl:col-span-6">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="px-4 py-3 border-b border-white/10 bg-black/30">
              <div className="text-sm font-semibold tracking-wide">
                Matter Record
              </div>
              <div className="text-xs text-white/50">
                Thread • Operator actions • Timeline
              </div>
            </div>
            <div className="h-[calc(100vh-18rem)] overflow-hidden">{thread}</div>
          </div>
        </section>

        {/* RIGHT: Brief */}
        <section className="col-span-12 lg:col-span-3">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="px-4 py-3 border-b border-white/10 bg-black/30">
              <div className="text-sm font-semibold tracking-wide">
                Axiom Brief
              </div>
              <div className="text-xs text-white/50">
                Signals • Risk • Next actions
              </div>
            </div>
            <div className="h-[calc(100vh-18rem)] overflow-auto">{intel}</div>
          </div>
        </section>
      </div>

      {/* keep children mounted */}
      <div className="hidden">{children}</div>
    </div>
  );
}
