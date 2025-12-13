"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/inquiries", label: "Tenant inquiries" },
  ];

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/");
    } catch (err) {
      console.error("Logout failed", err);
      setLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="text-[10px] uppercase tracking-[0.3em] text-amber-400">
            OASIS INTERNATIONAL REAL ESTATE INC.
          </div>

          <nav className="flex items-center gap-3 text-xs">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "rounded-full px-3 py-1 transition-colors",
                    active
                      ? "bg-amber-400 text-black"
                      : "text-slate-300 hover:bg-slate-800 hover:text-amber-300",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-full border border-slate-600 px-3 py-1 text-[11px] text-slate-300 hover:border-amber-400 hover:text-amber-300 disabled:opacity-60"
            >
              {loggingOut ? "Logging out…" : "Logout"}
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}
