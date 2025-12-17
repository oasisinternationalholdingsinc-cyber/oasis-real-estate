// app/dashboard/layout.tsx
import type { ReactNode } from "react";
import Link from "next/link";

function AxiomPill() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.45)]" />
      <span className="text-xs font-medium tracking-wide text-white/80">
        AXIOM • Operator Console
      </span>
    </div>
  );
}

function OperatorBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1">
      <span className="text-xs font-semibold text-amber-200">Operator</span>
      <span className="text-xs text-white/50">•</span>
      <span className="text-xs font-mono text-white/70">abbas</span>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Chrome */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto max-w-[1800px] px-4">
          <div className="flex h-14 items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-white/[0.04]"
              >
                <div className="h-7 w-7 rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02]" />
                <div className="min-w-0">
                  <div className="text-sm font-semibold tracking-wide">
                    Oasis Command Centre
                  </div>
                  <div className="text-[11px] text-white/50 -mt-0.5">
                    Real Estate • Production
                  </div>
                </div>
              </Link>

              <div className="hidden md:block">
                <AxiomPill />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <OperatorBadge />
              </div>

              <Link
                href="/dashboard/inquiries"
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm hover:bg-white/[0.07]"
              >
                Inquiries
              </Link>

              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm hover:bg-white/[0.07]"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Page frame */}
      <main className="mx-auto max-w-[1800px] px-4 py-6">{children}</main>

      <footer className="mx-auto max-w-[1800px] px-4 pb-8">
        <div className="mt-6 border-t border-white/10 pt-4 text-center text-xs text-white/45">
          Oasis OS • Locked-in governance-grade operations.
        </div>
      </footer>
    </div>
  );
}
