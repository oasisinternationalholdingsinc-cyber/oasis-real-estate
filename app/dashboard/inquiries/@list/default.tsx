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
  move_in_date?: string | null;
  group_type?: string | null;
  message: string;
  status: string;
  is_archived?: boolean | null;
  deleted_at?: string | null;
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

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusLabel(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function InquiriesListPane() {
  const [tab, setTab] = useState<"active" | "archived">("active");
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [bulkStatus, setBulkStatus] = useState<string>("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((i) => {
      const hay = [
        i.full_name,
        i.email,
        i.phone ?? "",
        i.message,
        i.property_slug,
        i.status,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [items, q]);

  const selectedIds = useMemo(
    () => Object.entries(selected).filter(([, v]) => v).map(([id]) => id),
    [selected]
  );

  const allVisibleSelected = useMemo(() => {
    if (!filtered.length) return false;
    return filtered.every((i) => selected[i.id]);
  }, [filtered, selected]);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const archived = tab === "archived" ? "true" : "false";
      const res = await fetch(
        `/api/admin/inquiries?archived=${archived}&limit=300`,
        { cache: "no-store", credentials: "include" }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to load inquiries");

      setItems((data.inquiries || []) as Inquiry[]);
      setSelected({});
    } catch (e: any) {
      setError(e?.message || "Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  function toggleSelectAll() {
    const next: Record<string, boolean> = { ...selected };
    const target = !allVisibleSelected;
    for (const i of filtered) next[i.id] = target;
    setSelected(next);
  }

  function toggleOne(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
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

  async function bulkDelete() {
    if (!selectedIds.length) return;

    const ok = window.confirm(
      "Delete permanently?\n\nThis can’t be undone.\n\n(Only archived inquiries can be deleted.)"
    );
    if (!ok) return;

    await doPatch({ action: "delete", ids: selectedIds });
    await load();
  }

  async function bulkSetStatus() {
    if (!selectedIds.length || !bulkStatus) return;
    await doPatch({ action: "set_status", ids: selectedIds, status: bulkStatus });
    setBulkStatus("");
    await load();
  }

  async function setRowStatus(id: string, status: string) {
    await doPatch({ action: "set_status", ids: [id], status });
    await load();
  }

  return (
    <div className="p-4 space-y-4">
      {/* Top controls */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab("active")}
            className={`rounded-full px-3 py-1 text-sm border ${
              tab === "active"
                ? "bg-amber-400 text-black border-amber-400"
                : "bg-slate-950 text-slate-200 border-slate-800 hover:border-slate-600"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setTab("archived")}
            className={`rounded-full px-3 py-1 text-sm border ${
              tab === "archived"
                ? "bg-amber-400 text-black border-amber-400"
                : "bg-slate-950 text-slate-200 border-slate-800 hover:border-slate-600"
            }`}
          >
            Archived
          </button>

          <div className="ml-3 text-xs text-slate-400">
            {loading ? "Loading…" : `${filtered.length} shown`}
            {selectedIds.length ? ` • ${selectedIds.length} selected` : ""}
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, phone, message…"
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-1 focus:ring-amber-400"
          />
          <button
            onClick={() => load()}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm hover:border-slate-600"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Bulk actions */}
      <div className="flex flex-col gap-2 rounded-2xl border border-slate-900 bg-slate-950/70 p-3">
        <div className="flex items-center justify-between gap-2">
          <label className="flex items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={allVisibleSelected}
              onChange={toggleSelectAll}
              className="h-4 w-4"
            />
            Select all (visible)
          </label>

          {tab === "active" ? (
            <button
              onClick={bulkArchive}
              disabled={!selectedIds.length}
              className="rounded-xl bg-slate-900 px-3 py-2 text-sm border border-slate-800 hover:border-slate-600 disabled:opacity-50"
            >
              Archive selected
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={bulkUnarchive}
                disabled={!selectedIds.length}
                className="rounded-xl bg-slate-900 px-3 py-2 text-sm border border-slate-800 hover:border-slate-600 disabled:opacity-50"
              >
                Restore
              </button>
              <button
                onClick={bulkDelete}
                disabled={!selectedIds.length}
                className="rounded-xl bg-rose-500/20 text-rose-200 px-3 py-2 text-sm border border-rose-500/30 hover:border-rose-400/60 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm"
          >
            <option value="">Bulk set status…</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
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
      </div>

      {/* Errors */}
      {error && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      {/* List */}
      <div className="rounded-2xl border border-slate-900 bg-slate-950/40 overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs text-slate-400 border-b border-slate-900">
          <div className="col-span-1">Sel</div>
          <div className="col-span-3">Name</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Created</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Open</div>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-slate-400">Loading inquiries…</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-sm text-slate-400">No inquiries in this view.</div>
        ) : (
          filtered.map((i) => (
            <div
              key={i.id}
              className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-slate-900/60 hover:bg-slate-950/60"
            >
              <div className="col-span-1 flex items-center">
                <input
                  type="checkbox"
                  checked={!!selected[i.id]}
                  onChange={() => toggleOne(i.id)}
                  className="h-4 w-4"
                />
              </div>

              <div className="col-span-3">
                <div className="text-sm text-slate-100">{i.full_name}</div>
                <div className="text-xs text-slate-500">{i.phone || "—"}</div>
              </div>

              <div className="col-span-3">
                <div className="text-sm text-slate-100">{i.email}</div>
                <div className="text-xs text-slate-500">{i.property_slug}</div>
              </div>

              <div className="col-span-2 text-xs text-slate-400">
                {fmtDate(i.created_at)}
              </div>

              <div className="col-span-2">
                <select
                  value={i.status}
                  onChange={(e) => setRowStatus(i.id, e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-2 py-1 text-sm"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {statusLabel(s)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1 flex justify-end items-center">
                <Link
                  href={`/dashboard/inquiries/${i.id}`}
                  className="text-sm text-amber-300 hover:text-amber-200"
                >
                  →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="text-xs text-slate-500">
        Delete is only available from <span className="text-slate-300">Archived</span>.
      </div>
    </div>
  );
}
