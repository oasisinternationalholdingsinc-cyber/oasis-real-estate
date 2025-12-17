"use client";

import { useState } from "react";

export default function Composer({ inquiryId }: { inquiryId: string }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function send() {
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
      setErr(e?.message || "Failed to send.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="border-t border-white/10 p-3 bg-black/30">
      {err ? (
        <div className="mb-2 text-xs text-red-300">
          {err.includes("404")
            ? "Reply API not found yet (/api/inquiries/reply). UI is restored though."
            : err}
        </div>
      ) : null}

      <div className="flex gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Continue the thread…"
          rows={2}
          className="flex-1 resize-none rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/20"
        />
        <button
          onClick={send}
          disabled={sending || !text.trim()}
          className="rounded-xl px-3 py-2 text-sm border border-white/10 bg-white/10 hover:bg-white/15 disabled:opacity-40"
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  );
}
