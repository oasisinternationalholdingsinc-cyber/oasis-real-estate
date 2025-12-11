"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminShell } from "../../../components/AdminShell";

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

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function InquiryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [inquiry, setInquiry] = useState<TenantInquiry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const res = await fetch(`/api/admin/inquiries?id=${id}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          console.error("Failed to fetch inquiry");
          return;
        }
        const data = await res.json();
        setInquiry(data.inquiry ?? null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  return (
    <AdminShell>
      <button
        type="button"
        onClick={() => router.push("/dashboard/inquiries")}
        className="mb-4 text-xs text-slate-400 hover:text-amber-300"
      >
        ← Back to inquiries
      </button>

      {loading && <p className="text-sm text-slate-400">Loading inquiry…</p>}

      {!loading && !inquiry && (
        <p className="text-sm text-rose-400">Inquiry not found.</p>
      )}

      {!loading && inquiry && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-50">
              {inquiry.full_name || "Tenant inquiry"}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Submitted {formatDate(inquiry.created_at)}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Contact details
              </h2>
              <p>
                <span className="text-slate-400">Email: </span>
                {inquiry.email || "—"}
              </p>
              <p>
                <span className="text-slate-400">Phone: </span>
                {inquiry.phone || "—"}
              </p>
              <p>
                <span className="text-slate-400">Household: </span>
                {inquiry.household || "—"}
              </p>
              <p>
                <span className="text-slate-400">Preferred move-in: </span>
                {inquiry.move_in_date
                  ? new Date(inquiry.move_in_date).toLocaleDateString("en-CA", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                About / notes
              </h2>
              <p className="whitespace-pre-wrap text-sm text-slate-200">
                {inquiry.about || "No message provided."}
              </p>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
