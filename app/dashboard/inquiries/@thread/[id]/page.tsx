import { createClient } from "@supabase/supabase-js";
import Composer from "./composer";

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

async function loadThread(inquiryId: string) {
  const supabase = getSupabase();

  const candidates = ["tenant_inquiry_messages", "inquiry_messages", "messages"];

  for (const table of candidates) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("inquiry_id", inquiryId)
      .order("created_at", { ascending: true });

    if (!error) {
      return { table, messages: (data || []) as Msg[], error: null as any };
    }
  }

  return {
    table: null,
    messages: [] as Msg[],
    error:
      "No messages table matched (tried tenant_inquiry_messages, inquiry_messages, messages).",
  };
}

function formatTime(ts?: string | null) {
  if (!ts) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

function Bubble({ m }: { m: Msg }) {
  const role = (m.role || "").toLowerCase();
  const text = m.content ?? m.message ?? "";
  const mine = role === "owner" || role === "admin" || role === "agent";

  return (
    <div className={`w-full flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
          "border border-white/10",
          mine ? "bg-white/10" : "bg-black/30",
        ].join(" ")}
      >
        <div className="opacity-90 whitespace-pre-wrap">{text || "…"}</div>
        <div className="mt-1 text-[11px] opacity-50">
          {formatTime(m.created_at)}
        </div>
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
  const { table, messages, error } = await loadThread(id);

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="p-3 border-b border-white/10 bg-black/30">
        <div className="text-sm font-medium">Thread</div>
        <div className="text-xs opacity-60">
          Inquiry: <span className="font-mono">{id}</span>
          {table ? (
            <>
              {" "}
              · source: <span className="font-mono">{table}</span>
            </>
          ) : null}
        </div>
        {error ? <div className="mt-2 text-xs opacity-70">{error}</div> : null}
      </div>

      <div className="flex-1 min-h-0 overflow-auto p-3 space-y-2">
        {messages.length ? (
          messages.map((m, i) => <Bubble key={m.id || String(i)} m={m} />)
        ) : (
          <div className="text-sm opacity-60">
            No messages found yet. (Thread UI is restored ✅)
          </div>
        )}
      </div>

      <Composer inquiryId={id} />
    </div>
  );
}
