// app/dashboard/inquiries/[id]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Inquiry = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  group_type: string | null;
  move_in_date: string | null;
  property_slug: string | null;
  status: string | null;
  internal_notes?: string | null;
  created_at: string;
};

type Msg = {
  id: string;
  inquiry_id: string;
  direction: "inbound" | "outbound";
  channel: "form" | "email";
  sender_type: "tenant" | "oasis" | "system";
  subject: string | null;
  body_text: string;
  from_email: string | null;
  to_email: string | null;
  created_at: string;
};

export default function InquiryDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [sending, setSending] = useState(false);

  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const title = useMemo(() => inquiry?.full_name || "Inquiry", [inquiry]);

  async function load() {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/inquiries?id=${encodeURIComponent(id)}`, {
        cache: "no-store",
        credentials: "include",
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load");

      setInquiry(json.inquiry);
      setMessages(json.messages || []);
      setNotes(json.inquiry?.internal_notes || "");

      // nice default subject
      if (!replySubject) {
        const prop = json.inquiry?.property_slug ? String(json.inquiry.property_slug) : "your inquiry";
        setReplySubject(`Re: ${prop} — Oasis International Real Estate`);
      }
    } catch (e: any) {
      setError(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function sendReply() {
    if (!inquiry?.id) return;
    if (!replyBody.trim()) {
      alert("Message is empty.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          action: "reply",
          id: inquiry.id,
          subject: replySubject,
          body: replyBody,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to send");

      setReplyBody("");
      await load(); // refresh thread
    } catch (e: any) {
      alert(e?.message || "Failed to send");
    } finally {
      setSending(false);
    }
  }

  async function saveInternalNotes() {
    if (!inquiry?.id) return;
    setSavingNotes(true);
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "set_notes", id: inquiry.id, notes }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to save notes");

      await load();
    } catch (e: any) {
      alert(e?.message || "Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-6xl px-6 py-10 opacity-70">Loading…</div>
      </div>
    );
  }

  if (error || !inquiry) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-4 text-sm opacity-70">Dashboard</div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-xl font-semibold">Couldn’t load inquiry</div>
            <div className="mt-2 text-sm opacity-70">{error || "Unknown error"}</div>
            <button
              className="mt-5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
              onClick={() => router.push("/dashboard/inquiries")}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <button
          className="mb-6 text-sm opacity-70 hover:opacity-100"
          onClick={() => router.push("/dashboard/inquiries")}
        >
          ← Back to inquiries
        </button>

        <div className="mb-2 text-4xl font-semibold">{title}</div>
        <div className="mb-8 text-sm opacity-70">
          Submitted {new Date(inquiry.created_at).toLocaleString()}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Contact */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="mb-4 text-sm tracking-[0.2em] opacity-60">CONTACT DETAILS</div>
            <div className="space-y-2 text-sm">
              <div>Email: <span className="font-medium">{inquiry.email || "—"}</span></div>
              <div>Phone: <span className="font-medium">{inquiry.phone || "—"}</span></div>
              <div>Household: <span className="font-medium">{inquiry.group_type || "—"}</span></div>
              <div>Preferred move-in: <span className="font-medium">{inquiry.move_in_date || "—"}</span></div>
              <div>Status: <span className="font-medium">{inquiry.status || "—"}</span></div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-5">
              <div className="mb-2 text-sm tracking-[0.2em] opacity-60">INTERNAL NOTES</div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Internal notes (not visible to tenant)…"
                className="h-28 w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-yellow-400/40"
              />
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={saveInternalNotes}
                  disabled={savingNotes}
                  className="rounded-full bg-yellow-400 px-5 py-2 text-sm font-semibold text-black hover:brightness-110 disabled:opacity-60"
                >
                  {savingNotes ? "Saving…" : "Save Notes"}
                </button>
                <div className="text-xs opacity-60">Saved to tenant_inquiries.internal_notes</div>
              </div>
            </div>
          </div>

          {/* Messages + Reply */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm tracking-[0.2em] opacity-60">MESSAGES</div>
              <div className="text-xs opacity-60">{messages.length} msg</div>
            </div>

            <div className="max-h-[320px] space-y-3 overflow-auto rounded-xl border border-white/10 bg-black/30 p-3">
              {messages.length === 0 ? (
                <div className="p-3 text-sm opacity-70">No messages logged yet.</div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="mb-2 flex items-center justify-between text-xs opacity-70">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-white/10 bg-black/40 px-2 py-1">
                          {m.channel} • {m.direction}
                        </span>
                        {m.subject ? <span className="opacity-80">{m.subject}</span> : null}
                      </div>
                      <span>{new Date(m.created_at).toLocaleString()}</span>
                    </div>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{m.body_text}</div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 border-t border-white/10 pt-5">
              <div className="mb-2 text-sm tracking-[0.2em] opacity-60">REPLY</div>

              <input
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
                placeholder="Subject…"
                className="mb-3 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-yellow-400/40"
              />

              <textarea
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                placeholder="Write a reply…"
                className="h-32 w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-yellow-400/40"
              />

              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={sendReply}
                  disabled={sending}
                  className="rounded-full bg-yellow-400 px-5 py-2 text-sm font-semibold text-black hover:brightness-110 disabled:opacity-60"
                >
                  {sending ? "Sending…" : "Send Reply"}
                </button>
                <div className="text-xs opacity-60">Sends email + logs to inquiry_messages</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
