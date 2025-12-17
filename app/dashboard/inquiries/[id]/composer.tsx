// app/dashboard/inquiries/[id]/composer.tsx
"use client";

import { useState } from "react";

export default function Composer({ inquiryId }: { inquiryId: string }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function issue() {
    const body = text.trim();
    if (!body) return;

    setSending(true);
    setErr(null);

    try {
      const res = await fetch("/api/inquiries/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiry_id: inquiryId, message: body }),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Reply endpoint returned non-OK.");
      }

      setText("");
      window.location.reload();
    } catch (e: any) {
      setErr(e?.message || "Failed to issue response.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="border-t border-white/10 bg-black/30 p-3">
      {err ? <div className="mb-2 text-xs text-rose-200">{err}</div> : null}

      <div className="mb-2 text-[11px] text-slate-400">
        Draft response (logged to record)
      </div>

      <div className="flex gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Draft response…"
          rows={2}
          className="flex-1 resize-none rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/20"
        />
        <button
          onClick={issue}
          disabled={sending || !text.trim()}
          className="rounded-xl px-3 py-2 text-sm border border-white/10 bg-white/10 hover:bg-white/15 disabled:opacity-40"
        >
          {sending ? "Issuing…" : "Issue"}
        </button>
      </div>
    </div>
  );
}
