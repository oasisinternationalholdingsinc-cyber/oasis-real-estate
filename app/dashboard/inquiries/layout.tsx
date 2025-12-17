// app/dashboard/inquiries/layout.tsx
"use client";

import type { ReactNode } from "react";
import { AdminShell } from "@/app/components/AdminShell";

/**
 * Oasis OS · Real Estate Inquiries Console
 * - 3-column authority frame (Control / Reality / Intelligence)
 * - No page scroll; each column scrolls independently
 * - Uses parallel routes: children + @thread + @intel
 */
export default function InquiriesLayout({
  children,
  thread,
  intel,
}: {
  children: ReactNode; // LEFT column: /dashboard/inquiries/*
  thread: ReactNode;   // MIDDLE slot: /dashboard/inquiries/@thread/*
  intel: ReactNode;    // RIGHT slot: /dashboard/inquiries/@intel/*
}) {
  return (
    <AdminShell>
      <div className="relative -mx-4 h-[calc(100vh-64px)] w-[calc(100%+32px)] overflow-hidden">
        {/* Quiet command ambience */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_380px_at_30%_-10%,rgba(251,191,36,0.10),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/35 to-transparent" />

        <div className="relative grid h-full grid-cols-[340px_minmax(0,1fr)_380px]">
          {/* LEFT — CONTROL */}
          <aside className="h-full overflow-y-auto border-r border-slate-900 bg-black/40">
            <div className="sticky top-0 z-10 border-b border-slate-900 bg-slate-950/85 px-4 py-3 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.30em] text-amber-300">
                    Inquiries
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Control · Triage · Routing
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400/80 shadow-[0_0_14px_rgba(52,211,153,0.35)]" />
                  <span className="text-[10px] text-slate-500">Live</span>
                </div>
              </div>
            </div>

            <div className="px-4 py-4">{children}</div>
          </aside>

          {/* MIDDLE — REALITY */}
          <section className="h-full overflow-y-auto bg-black/20">
            <div className="sticky top-0 z-10 border-b border-slate-900 bg-slate-950/70 px-5 py-3 backdrop-blur">
              <p className="text-[10px] font-semibold uppercase tracking-[0.30em] text-slate-200">
                Thread
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Reality · Conversation · Timeline
              </p>
            </div>

            {thread}
          </section>

          {/* RIGHT — INTELLIGENCE */}
          <aside className="h-full overflow-y-auto border-l border-slate-900 bg-black/35">
            <div className="sticky top-0 z-10 border-b border-slate-900 bg-slate-950/85 px-5 py-3 backdrop-blur">
              <p className="text-[10px] font-semibold uppercase tracking-[0.30em] text-amber-200">
                Intel
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Judgment · AI Summary · Notes · Status
              </p>
            </div>

            {intel}
          </aside>
        </div>
      </div>
    </AdminShell>
  );
}
