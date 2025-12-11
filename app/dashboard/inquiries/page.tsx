"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "../../components/AdminShell";

type TenantInquiry = {
  id: string;
  created_at: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  household: string | null;
  move_in_date: string | null;
  about: string | null;
  status: string | null;
};

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "viewed", label: "Viewed" },
  { value: "contacted", label: "Contacted" },
  { value: "application_sent", label: "Application sent" },
  { value: "approved", label: "Approved" },
  { value: "declined", label: "Declined" },
];

const STATUS_BADGE_CLASSES: Record<string, string> = {
  new: "bg-amber-400 text-black",
  viewed: "bg-slate-700 text-slate-100",
  contacted: "bg-sky-500 text-black",
  application_sent: "bg-purple-500 text-black",
  approved: "bg-emerald-500 text-black",
  declined: "bg-rose-500 text-black",
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function TenantInquiriesPage() {
  const [inquiries, setInquiries] = useState<TenantInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const router = useRouter();

  async function loadInquiries() {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/inquiries", {
        cache: "no-store",
      });
      if (!res.ok) {
        console.error("Failed to load inquiries");
        return;
      }
      const data = await res.json();
      setInquiries(data.inquiries ?? []);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadInquiries();
  }, []);

  async function updateStatus(id: string, status: string) {
    try {
      setBusyId(id);
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) {
        console.error("Failed to update status");
        return;
      }

      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
      );
    } finally {
      setBusyId(null);
    }
  }

  async function sendQuickReply(id: string) {
    try {
      setBusyId(id);
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          action: "quick_reply",
          template: "thanks",
        }),
      });

      if (!res.ok) {
        console.error("Quick reply failed");
        return;
      }

      // optimistically mark as contacted
      setInquiries((prev) =>
        prev.map((inq) =>
          inq.id === id ? { ...inq, status: "contacted" } : inq
        )
      );
    } finally {
      setBusyId(null);
    }
  }

  const newCount = inquiries.filter((i) => (i.status ?? "new") === "new").length;

  return (
    <AdminShell>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">
            Tenant Inquiries
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Latest leads across your properties{" "}
            <span className="text-amber-300">
              (showing {inquiries.length || 0}).
            </span>
          </p>
          {newCount > 0 && (
            <p className="mt-1 text-xs text-amber-400">
              • {newCount} new{" "}
              {newCount === 1 ? "inquiry needs review" : "inquiries need review"}
              .
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={loadInquiries}
          disabled={refreshing}
          className="rounded-full border border-slate-700 px-4 py-2 text-xs font-medium text-slate-100 hover:border-amber-400 hover:text-amber-300 disabled:opacity-60"
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/70">
        <div className="grid grid-cols-[2.2fr,2fr,1.3fr,1.4fr,1.7fr,1.6fr] gap-3 border-b border-slate-800 px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-slate-500">
          <div>Name</div>
          <div>Email</div>
          <div>Household</div>
          <div>Move-in</div>
          <div>Submitted</div>
          <div className="text-right">Status / actions</div>
        </div>

        {loading && (
          <div className="px-6 py-10 text-sm text-slate-400">
            Loading inquiries…
          </div>
        )}

        {!loading && inquiries.length === 0 && (
          <div className="px-6 py-10 text-sm text-slate-400">
            No inquiries yet. Once someone submits the Partington form, they
            will appear here.
          </div>
        )}

        {!loading &&
          inquiries.map((inq) => {
            const status = (inq.status ?? "new").toLowerCase();
            const badgeClass =
              STATUS_BADGE_CLASSES[status] ??
              "bg-slate-700 text-slate-100 border border-slate-500";

            return (
              <div
                key={inq.id}
                className="grid grid-cols-[2.2fr,2fr,1.3fr,1.4fr,1.7fr,1.6fr] gap-3 border-t border-slate-900/70 px-6 py-4 text-sm text-slate-100 hover:bg-slate-900/70"
              >
                {/* Name / phone / note preview */}
                <button
                  type="button"
                  onClick={() =>
                    router.push(`/dashboard/inquiries/${inq.id}`)
                  }
                  className="text-left"
                >
                  <div className="font-medium">
                    {inq.full_name || "—"}
                  </div>
                  {inq.phone && (
                    <div className="text-xs text-slate-400">
                      {inq.phone}
                    </div>
                  )}
                  {inq.about && (
                    <div className="mt-1 line-clamp-1 text-[11px] text-slate-500">
                      {inq.about}
                    </div>
                  )}
                </button>

                {/* Email */}
                <div className="flex items-center text-xs text-slate-300">
                  {inq.email || "—"}
                </div>

                {/* Household */}
                <div className="flex items-center text-xs text-slate-300">
                  {inq.household || "—"}
                </div>

                {/* Move-in */}
                <div className="flex items-center text-xs text-slate-300">
                  {inq.move_in_date
                    ? new Date(inq.move_in_date).toLocaleDateString("en-CA", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </div>

                {/* Submitted */}
                <div className="flex items-center text-xs text-slate-300">
                  {formatDate(inq.created_at)}
                </div>

                {/* Status + actions */}
                <div className="flex items-center justify-end gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${badgeClass}`}
                  >
                    {STATUS_OPTIONS.find((s) => s.value === status)?.label ??
                      status.toUpperCase()}
                  </span>

                  <select
                    value={status}
                    disabled={busyId === inq.id}
                    onChange={(e) => updateStatus(inq.id, e.target.value)}
                    className="rounded-full border border-slate-700 bg-slate-950/40 px-2 py-1 text-[11px] text-slate-200 focus:border-amber-400 focus:outline-none"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    disabled={busyId === inq.id}
                    onClick={() => sendQuickReply(inq.id)}
                    className="rounded-full bg-amber-400 px-3 py-1 text-[11px] font-semibold text-black shadow hover:bg-amber-300 disabled:opacity-60"
                  >
                    {busyId === inq.id ? "Sending…" : "Quick reply"}
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </AdminShell>
  );
}
