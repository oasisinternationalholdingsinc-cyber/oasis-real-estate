// app/dashboard/inquiries/@intel/[id]/page.tsx
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
  const { data, error } = await supabase
    .from("tenant_inquiries")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return { data, error };
}

function Row({ k, v }: { k: string; v: any }) {
  if (v === null || v === undefined || String(v).trim() === "") return null;
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-white/5">
      <div className="text-xs text-slate-400">{k}</div>
      <div className="text-xs text-right break-all text-slate-100">{String(v)}</div>
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
        <div className="text-sm font-medium">Brief</div>
        <div className="mt-2 text-xs text-rose-200">
          Failed to load matter <span className="font-mono">{id}</span>
        </div>
        <pre className="mt-2 text-xs text-slate-400 whitespace-pre-wrap">
          {String((error as any).message || error)}
        </pre>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full p-3">
        <div className="text-sm font-medium">Brief</div>
        <div className="mt-2 text-sm text-slate-400">Matter not found.</div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="p-3 border-b border-white/10 bg-black/30">
        <div className="text-sm font-medium">Brief</div>
        <div className="text-xs text-slate-400">
          Matter: <span className="font-mono">{id}</span>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto p-3 space-y-3">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
          <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400 mb-2">
            Identity
          </div>
          <Row k="name" v={(data as any).full_name ?? (data as any).name} />
          <Row k="email" v={(data as any).email} />
          <Row k="phone" v={(data as any).phone} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
          <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400 mb-2">
            Disposition
          </div>
          <Row k="status" v={(data as any).status} />
          <Row k="created_at" v={(data as any).created_at} />
          <Row k="updated_at" v={(data as any).updated_at} />
          <Row k="property" v={(data as any).property_slug} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
          <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400 mb-2">
            Matter
          </div>
          <Row k="move_in" v={(data as any).move_in_date ?? (data as any).move_in} />
          <Row k="group" v={(data as any).group_type} />
          <Row k="notes" v={(data as any).notes ?? (data as any).message} />
        </div>

        {/* Axiom lives as effects: keep this label neutral */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400 mb-2">
            System Note
          </div>
          <div className="text-xs text-slate-300/80">
            (Reserved) Pattern signals + suggested next actions will appear here.
          </div>
        </div>
      </div>
    </div>
  );
}
