// app/dashboard/inquiries/@list/default.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Inquiry = {
  id: string;
  created_at: string;
  property_slug: string;
  full_name: string;
  email: string;
  phone?: string | null;
  message: string;
  status: string;
};

const STATUS_OPTIONS = [
  "new",
  "contacted",
  "viewing_scheduled",
  "application_sent",
  "application_received",
  "rejected",
  "leased",
];

function fmt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString([], { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function label(s: string) {
  return s.replace(/_/g, " ");
}

function chipClass(status: string) {
  const s = status.toLowerCase();
  if (s === "new") return "border-amber-400/30 text-amber-200 bg-amber-400/10";
  if (s === "contacted") return "border-sky-400/30 text-sky-200 bg-sky-400/10";
  if (s.includes("viewing")) return "border-emerald-400/30 text-emerald-200 bg-emerald-400/10";
  if (s.includes("rejected")) return "border-rose-400/30 text-rose-200 bg-rose-400/10";
  if (s.includes("leased")) return "border-emerald-400/30 text-emerald-200 bg-emerald-400/10";
  return "border-white/10 text-slate-200 bg-white/5";
}

export default function InquiriesListPane() {
  const [tab, setTab] = useState<"active" | "archived">("active");
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [bulkStatus, setBulkStatus] = useState<string>("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((i) =>
      [i.full_name, i.email, i.phone ?? "", i.message, i.property_slug, i.status]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [items, q]);

  const selectedIds = useMemo(
    () => Object.entries(selected).filter(([, v]) => v).map(([id]) => id),
    [selected]
  );

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const archived = tab === "archived" ? "true" : "false";
      const res = await fetch(`/api/admin/inquiries?archived=${archived}&limit=300`, {
        cache: "no-store",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to load matters");
      setItems((data.inquiries || []) as Inquiry[]);
      setSelected({});
    } catch (e: any) {
      setError(e?.message || "Failed to load matters");
    } finally {
      setLoading(false);
    }
  }

  async function doPatch(payload: any) {
    const res = await fetch("/api/admin/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      keepalive: true,
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || "Action failed");
    return data;
  }

  async function bulkSetStatus() {
    if (!selectedIds.length || !bulkStatus) return;
    await doPatch({ action: "set_status", ids: selectedIds, status: bulkStatus });
    setBulkStatus("");
    await load();
  }

  async function bulkArchive() {
    if (!selectedIds.length) return;
    await doPatch({ action: "archive", ids: selectedIds });
    await load();
  }

  async function bulkUnarchive() {
    if (!selectedIds.length) return;
    await doPatch({ action: "unarchive", ids: selectedIds });
    await load();
  }

  function toggleOne(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="sticky top-0 z-10 -mx-4 px-4 pb-3 pt-2 bg-black/70 backdrop-blur border-b border-white/5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab("active")}
              className={`rounded-full px-3 py-1 text-[12px] border ${
                tab === "active"
                  ? "bg-amber-400 text-black border-amber-400"
                  : "bg-white/5 text-slate-200 border-white/10 hover:bg-white/10"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setTab("archived")}
              className={`rounded-full px-3 py-1 text-[12px] border ${
                tab === "archived"
                  ? "bg-amber-400 text-black border-amber-400"
                  : "bg-white/5 text-slate-200 border-white/10 hover:bg-white/10"
              }`}
            >
              Closed
            </button>

            <div className="ml-2 text-[11px] text-slate-400">
              {loading ? "Loading…" : `${filtered.length} matters`}
              {selectMode && selectedIds.length ? ` · ${selectedIds.length} selected` : ""}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectMode((v) => !v)}
              className={`rounded-full px-3 py-1 text-[12px] border ${
                selectMode
                  ? "bg-white/10 border-white/20"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              Select
            </button>
            <button
              onClick={load}
              className="rounded-full px-3 py-1 text-[12px] border border-white/10 bg-white/5 hover:bg-white/10"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, phone, message…"
            className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400/50"
          />
        </div>

        {/* Bulk controls only when Select is ON */}
        {selectMode ? (
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-2">
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm"
              >
                <option value="">Bulk set status…</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>

              <button
                onClick={bulkSetStatus}
                disabled={!selectedIds.length || !bulkStatus}
                className="rounded-xl bg-amber-400 text-black px-3 py-2 text-sm font-semibold disabled:opacity-50"
              >
                Apply
              </button>
            </div>

            <div className="mt-2 flex items-center gap-2">
              {tab === "active" ? (
                <button
                  onClick={bulkArchive}
                  disabled={!selectedIds.length}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
                >
                  Close selected
                </button>
              ) : (
                <button
                  onClick={bulkUnarchive}
                  disabled={!selectedIds.length}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
                >
                  Reopen selected
                </button>
              )}
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="mt-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}
      </div>

      {/* Register list */}
      <div className="mt-3 space-y-2">
        {loading ? (
          <div className="p-4 text-sm text-slate-400">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-4 text-sm text-slate-400">No matters in this view.</div>
        ) : (
          filtered.map((i) => (
            <div
              key={i.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
            >
              <div className="flex items-stretch gap-2 p-3">
                {selectMode ? (
                  <div className="flex items-center pl-1">
                    <input
                      type="checkbox"
                      checked={!!selected[i.id]}
                      onChange={() => toggleOne(i.id)}
                      className="h-4 w-4"
                    />
                  </div>
                ) : null}

                <Link href={`/dashboard/inquiries/${i.id}`} className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-100 truncate">
                        {i.full_name || "Unknown"}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {i.email}{i.phone ? ` · ${i.phone}` : ""}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] ${chipClass(i.status)}`}
                      >
                        {label(i.status)}
                      </span>
                      <div className="text-[10px] text-slate-500">{fmt(i.created_at)}</div>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="text-[11px] text-slate-500 truncate">
                      {i.property_slug}
                    </div>
                    <div className="text-[11px] text-amber-200/80">Open →</div>
                  </div>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 text-[10px] text-slate-500">
        Closed items are in <span className="text-slate-300">Closed</span>.
      </div>
    </div>
  );
}
