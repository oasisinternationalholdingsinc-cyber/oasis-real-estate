"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type Status = "NEW" | "CONTACTED" | "SCHEDULED" | "DECLINED" | "ARCHIVED";

const STATUS_LABELS: Record<Status, string> = {
  NEW: "NEW",
  CONTACTED: "CONTACTED",
  SCHEDULED: "SCHEDULED",
  DECLINED: "DECLINED",
  ARCHIVED: "ARCHIVED",
};

const STATUS_COLORS: Record<Status, string> = {
  NEW: "bg-amber-400 text-black",
  CONTACTED: "bg-emerald-500 text-black",
  SCHEDULED: "bg-sky-500 text-black",
  DECLINED: "bg-rose-500 text-black",
  ARCHIVED: "bg-slate-700 text-slate-100",
};

// Shape coming back from Supabase – keep it flexible
type RawInquiry = {
  id: string;
  full_name?: string | null;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  household?: string | null;
  household_type?: string | null;
  move_in_date?: string | null;
  moveInDate?: string | null;
  about?: string | null;
  message?: string | null;
  notes?: string | null;
  status?: string | null;
  created_at: string;
  property_slug?: string | null;
};

type NormalizedInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  household: string;
  moveIn: string | null;
  message: string;
  status: Status;
  createdAt: string;
  property: string; // e.g. "partington"
};

function normalizeInquiry(row: RawInquiry): NormalizedInquiry {
  const name = (row.full_name || row.fullName || "").trim() || "Unknown";
  const email = (row.email || "").trim();
  const phone = (row.phone || "").trim();
  const household =
    (row.household || row.household_type || "").trim() || "—";

  const moveInRaw = row.move_in_date || row.moveInDate || null;
  const message = (row.message || row.about || row.notes || "").trim();
  const rawStatus = (row.status || "NEW").toUpperCase() as Status;
  const status: Status =
    ["NEW", "CONTACTED", "SCHEDULED", "DECLINED", "ARCHIVED"].includes(
      rawStatus
    )
      ? rawStatus
      : "NEW";

  const property = row.property_slug || "partington";

  return {
    id: row.id,
    name,
    email,
    phone,
    household,
    moveIn: moveInRaw,
    message,
    status,
    createdAt: row.created_at,
    property,
  };
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TenantInquiriesPage() {
  const [inquiries, setInquiries] = useState<NormalizedInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<NormalizedInquiry | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterProperty, setFilterProperty] = useState<string>("all");

  // 🔔 derived counts
  const newCount = useMemo(
    () => inquiries.filter((q) => q.status === "NEW").length,
    [inquiries]
  );

  const filteredInquiries = useMemo(
    () =>
      inquiries.filter((q) =>
        filterProperty === "all" ? true : q.property === filterProperty
      ),
    [inquiries, filterProperty]
  );

  async function loadInquiries() {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch("/api/admin/inquiries");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const rows: RawInquiry[] = data.inquiries ?? [];
      setInquiries(rows.map(normalizeInquiry));
    } catch (err) {
      console.error("Failed to load inquiries", err);
      setError("Could not load inquiries. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInquiries();
  }, []);

  // ⚡ Optional Supabase realtime (if anon envs exist & Realtime enabled on table)
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anon) return;

    const supabase: SupabaseClient = createClient(url, anon);

    const channel = supabase
      .channel("tenant-inquiries-dashboard")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tenant_inquiries" },
        (payload) => {
          const newRow = payload.new as RawInquiry;

          if (payload.eventType === "INSERT") {
            setInquiries((prev) => [normalizeInquiry(newRow), ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setInquiries((prev) =>
              prev.map((row) =>
                row.id === newRow.id ? normalizeInquiry(newRow) : row
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function handleStatusChange(id: string, status: Status) {
    try {
      setUpdatingId(id);
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      const updated: RawInquiry = data.inquiry;
      setInquiries((prev) =>
        prev.map((row) =>
          row.id === id ? normalizeInquiry(updated) : row
        )
      );
    } catch (err) {
      console.error(err);
      alert("Could not update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  function handleQuickReply(inquiry: NormalizedInquiry) {
    if (!inquiry.email) return;
    const subject = `Your inquiry about 831 Partington Ave`;
    const body = [
      `Hi ${inquiry.name || "there"},`,
      "",
      "Thank you for your inquiry about the executive main unit at 831 Partington Ave.",
      "I’ve received your details and will follow up shortly with available viewing times and next steps.",
      "",
      "If you have any questions or specific timing preferences, feel free to reply to this email.",
      "",
      "– Oasis International Real Estate Inc.",
    ].join("\n");

    const url = `mailto:${encodeURIComponent(
      inquiry.email
    )}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = url;
  }

  const propertyOptions = useMemo(() => {
    const base = new Set<string>();
    inquiries.forEach((q) => base.add(q.property));
    return Array.from(base);
  }, [inquiries]);

  return (
    <div className="min-h-screen bg-black text-slate-100 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-6 gap-4">
          <div>
            <p className="text-xs tracking-[0.18em] text-amber-400 mb-1">
              OASIS INTERNATIONAL REAL ESTATE INC.
            </p>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">Tenant Inquiries</h1>
              {newCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 border border-amber-400/60 px-3 py-1 text-xs text-amber-200">
                  <span className="inline-flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                  {newCount} new
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Latest leads across your properties{" "}
              <span className="text-amber-300">
                (showing {filteredInquiries.length}).
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {propertyOptions.length > 1 && (
              <select
                value={filterProperty}
                onChange={(e) => setFilterProperty(e.target.value)}
                className="rounded-full bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                <option value="all">All properties</option>
                {propertyOptions.map((slug) => (
                  <option key={slug} value={slug}>
                    {slug === "partington"
                      ? "831 Partington Ave"
                      : slug}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={loadInquiries}
              className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-900"
            >
              Refresh
            </button>
          </div>
        </header>

        {/* Error state */}
        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-100">
            {error}
          </div>
        )}

        {/* Empty / loading */}
        {loading ? (
          <p className="text-xs text-slate-400">Loading inquiries…</p>
        ) : filteredInquiries.length === 0 ? (
          <p className="text-xs text-slate-400">
            No inquiries yet. Once someone submits the Partington form,
            they will appear here.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70">
            {/* Table header */}
            <div className="grid grid-cols-[2fr,2fr,1.4fr,1.5fr,1.7fr,auto,auto] gap-3 px-5 py-3 text-[10px] font-medium uppercase tracking-[0.15em] text-slate-400 border-b border-slate-800">
              <div>Name</div>
              <div>Email</div>
              <div>Household</div>
              <div>Move-in</div>
              <div>Submitted</div>
              <div className="text-center">Status</div>
              <div className="text-center">Actions</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-900/80">
              {filteredInquiries.map((inq) => (
                <button
                  key={inq.id}
                  onClick={() => setSelected(inq)}
                  className="grid w-full grid-cols-[2fr,2fr,1.4fr,1.5fr,1.7fr,auto,auto] gap-3 px-5 py-3 text-xs text-left hover:bg-slate-900/70 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-100">
                      {inq.name}
                    </span>
                    {inq.phone && (
                      <span className="text-[10px] text-slate-500">
                        {inq.phone}
                      </span>
                    )}
                  </div>
                  <div className="truncate text-slate-200">{inq.email}</div>
                  <div className="text-slate-300">{inq.household}</div>
                  <div className="text-slate-300">
                    {formatDate(inq.moveIn)}
                  </div>
                  <div className="text-slate-300">
                    {formatDate(inq.createdAt)}
                  </div>
                  <div className="flex items-center justify-center">
                    <div
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold ${STATUS_COLORS[inq.status]}`}
                    >
                      {STATUS_LABELS[inq.status]}
                    </div>
                  </div>
                  <div
                    className="flex items-center justify-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      value={inq.status}
                      disabled={updatingId === inq.id}
                      onChange={(e) =>
                        handleStatusChange(
                          inq.id,
                          e.target.value as Status
                        )
                      }
                      className="rounded-full bg-slate-900 border border-slate-700 px-2 py-1 text-[10px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="SCHEDULED">SCHEDULED</option>
                      <option value="DECLINED">DECLINED</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                    <button
                      onClick={() => handleQuickReply(inq)}
                      className="rounded-full bg-amber-400/90 text-black text-[10px] font-semibold px-3 py-1 hover:bg-amber-300"
                    >
                      Quick reply
                    </button>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Detail modal */}
        {selected && (
          <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4"
            onClick={() => setSelected(null)}
          >
            <div
              className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[10px] tracking-[0.2em] text-amber-400 mb-1">
                    INQUIRY DETAILS
                  </p>
                  <h2 className="text-lg font-semibold">
                    {selected.name}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    {selected.email}
                    {selected.phone && ` · ${selected.phone}`}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-slate-400 hover:text-slate-100 text-sm"
                >
                  ✕
                </button>
              </div>

              <dl className="space-y-2 text-xs">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Household</dt>
                  <dd className="text-slate-100">{selected.household}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Preferred move-in</dt>
                  <dd className="text-slate-100">
                    {formatDate(selected.moveIn)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Submitted</dt>
                  <dd className="text-slate-100">
                    {formatDate(selected.createdAt)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Status</dt>
                  <dd>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold ${STATUS_COLORS[selected.status]}`}
                    >
                      {STATUS_LABELS[selected.status]}
                    </span>
                  </dd>
                </div>
                <div className="mt-3">
                  <dt className="text-slate-500 mb-1">Message</dt>
                  <dd className="whitespace-pre-wrap text-slate-100">
                    {selected.message || "No message provided."}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => handleQuickReply(selected)}
                  className="rounded-full bg-amber-400 text-black text-[11px] font-semibold px-4 py-1.5 hover:bg-amber-300"
                >
                  Reply via email
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-full border border-slate-700 px-4 py-1.5 text-[11px] text-slate-200 hover:bg-slate-900"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
