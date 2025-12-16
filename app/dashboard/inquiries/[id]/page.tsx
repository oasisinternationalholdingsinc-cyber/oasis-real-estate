"use client";

import { useEffect, useMemo, useState } from "react";
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

type InquiryMessage = {
  id: string;
  inquiry_id: string;
  direction: "inbound" | "outbound" | string;
  channel: "form" | "email" | string;
  sender_type: "tenant" | "agent" | "system" | string;
  subject?: string | null;
  body_text: string | null;
  created_at: string;
};

function formatDateTime(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" });
}

function badgeFor(msg: InquiryMessage) {
  const dir = (msg.direction || "").toLowerCase();
  const ch = (msg.channel || "").toLowerCase();
  if (dir === "inbound" && ch === "form") return "Form • Inbound";
  if (dir === "outbound" && ch === "email") return "Email • Outbound";
  if (dir === "inbound" && ch === "email") return "Email • Inbound";
  return `${msg.channel || "msg"} • ${msg.direction || ""}`.trim();
}

export default function InquiryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [inquiry, setInquiry] = useState<TenantInquiry | null>(null);
  const [messages, setMessages] = useState<InquiryMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/inquiries?id=${id}`, { cache: "no-store" });
        if (!res.ok) {
          console.error("Failed to fetch inquiry");
          setInquiry(null);
          setMessages([]);
          return;
        }
        const data = await res.json();
        setInquiry(data.inquiry ?? null);
        setMessages(Array.isArray(data.messages) ? data.messages : []);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  const hasThread = useMemo(() => messages.length > 0, [messages]);

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
      {!loading && !inquiry && <p className="text-sm text-rose-400">Inquiry not found.</p>}

      {!loading && inquiry && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-50">
              {inquiry.full_name || "Tenant inquiry"}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Submitted {formatDateTime(inquiry.created_at)}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Contact */}
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

            {/* Thread */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Messages
                </h2>
                <span className="text-xs text-slate-500">{hasThread ? `${messages.length} msg` : "—"}</span>
              </div>

              {/* Legacy fallback */}
              {!hasThread && (
                <p className="mt-3 whitespace-pre-wrap text-sm text-slate-200">
                  {inquiry.about || "No message provided."}
                </p>
              )}

              {/* Conversation thread */}
              {hasThread && (
                <div className="mt-3 space-y-3">
                  {messages.map((m) => {
                    const outbound = (m.direction || "").toLowerCase() === "outbound";
                    return (
                      <div
                        key={m.id}
                        className={`rounded-xl border p-3 ${
                          outbound
                            ? "border-amber-500/20 bg-amber-500/5"
                            : "border-slate-800 bg-slate-950/40"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] rounded-full border border-slate-700 px-2 py-0.5 text-slate-300">
                              {badgeFor(m)}
                            </span>
                            {m.subject ? (
                              <span className="text-xs font-medium text-slate-200">
                                {m.subject}
                              </span>
                            ) : null}
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {formatDateTime(m.created_at)}
                          </span>
                        </div>

                        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-200">
                          {m.body_text || "—"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
