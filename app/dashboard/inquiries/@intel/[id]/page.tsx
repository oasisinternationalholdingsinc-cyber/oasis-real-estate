import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVER_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

async function loadInquiry(id: string) {
  const supabase = getSupabase();

  // Your known table name from earlier SQL
  const { data, error } = await supabase
    .from("tenant_inquiries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return { data, error };
}

function safe(v: any) {
  if (v === null || v === undefined) return "";
  return String(v);
}

function Row({ k, v }: { k: string; v: any }) {
  const val = safe(v);
  if (!val) return null;
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-white/5">
      <div className="text-xs opacity-60">{k}</div>
      <div className="text-xs text-right break-all">{val}</div>
    </div>
  );
}

export default async function IntelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data, error } = await loadInquiry(id);

  if (error) {
    return (
      <div className="h-full p-3">
        <div className="text-sm font-medium">Intel</div>
        <div className="mt-2 text-xs text-red-300">
          Failed to load tenant_inquiries for <span className="font-mono">{id}</span>
        </div>
        <pre className="mt-2 text-xs opacity-70 whitespace-pre-wrap">{String(error.message || error)}</pre>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full p-3">
        <div className="text-sm font-medium">Intel</div>
        <div className="mt-2 text-sm opacity-60">Inquiry not found.</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="p-3 border-b border-white/10 bg-black/30">
        <div className="text-sm font-medium">Intel</div>
        <div className="text-xs opacity-60">
          Inquiry: <span className="font-mono">{id}</span>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto p-3 space-y-3">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
          <div className="text-xs opacity-60 mb-2">Lead</div>
          <Row k="name" v={data.full_name ?? data.name} />
          <Row k="email" v={data.email} />
          <Row k="phone" v={data.phone} />
          <Row k="status" v={data.status} />
          <Row k="created_at" v={data.created_at} />
          <Row k="updated_at" v={data.updated_at} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
          <div className="text-xs opacity-60 mb-2">Details</div>
          <Row k="move_in" v={data.move_in_date ?? data.move_in} />
          <Row k="budget" v={data.budget} />
          <Row k="occupants" v={data.occupants} />
          <Row k="notes" v={data.notes ?? data.message} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
          <div className="text-xs opacity-60 mb-2">Raw record</div>
          <pre className="text-[11px] opacity-80 whitespace-pre-wrap break-words">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
