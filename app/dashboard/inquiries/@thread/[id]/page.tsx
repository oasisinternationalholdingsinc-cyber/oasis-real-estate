// app/dashboard/inquiries/@thread/[id]/page.tsx
import { createClient } from "@supabase/supabase-js";
import Composer from "../../[id]/composer";

type Msg = {
  id?: string;
  inquiry_id?: string;
  role?: string | null;
  content?: string | null;
  message?: string | null;
  created_at?: string | null;
};

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVER_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

async function loadRecord(inquiryId: string) {
  const supabase = getSupabase();
  const candidates = ["tenant_inquiry_messages", "inquiry_messages", "messages"];

  for (const table of candidates) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("inquiry_id", inquiryId)
      .order("created_at", { ascending: true });

    if (!error) return { messages: (data || []) as Msg[], error: null as any };
  }

  return {
    messages: [] as Msg[],
    error: "No messages table matched (tenant_inquiry_messages / inquiry_messages / messages).",
  };
}

function formatTime(ts?: string | null) {
  if (!ts) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

function Entry({ m }: { m: Msg }) {
  const role = (m.role || "").toLowerCase();
  const text = m.content ?? m.message ?? "";
  const mine = role === "owner" || role === "admin" || role === "agent";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>{mine ? "Outbound" : "Inbound"}</span>
        <span>{formatTime(m.created_at)}</span>
      </div>
      <div className="mt-1 rounded-2xl border border-white/10 bg-black/30 p-3 text-sm leading-relaxed">
        <div className="whitespace-pre-wrap opacity-90">{text || "…"}</div>
      </div>
    </div>
  );
}

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { messages, error } = await loadRecord(id);

  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="border-b border-white/10 bg-black/30 p-3">
        <div className="text-sm font-medium">Record</div>
        <div className="text-xs text-slate-400">
          Matter: <span className="font-mono">{id}</span>
        </div>
        {error ? <div className="mt-2 text-xs text-slate-400">{error}</div> : null}
      </div>

      <div className="flex-1 min-h-0 overflow-auto p-3 space-y-3">
        {messages.length ? (
          messages.map((m, i) => <Entry key={m.id || String(i)} m={m} />)
        ) : (
          <div className="text-sm text-slate-400">
            No entries yet. (Record is ready ✅)
          </div>
        )}
      </div>

      <Composer inquiryId={id} />
    </div>
  );
}
