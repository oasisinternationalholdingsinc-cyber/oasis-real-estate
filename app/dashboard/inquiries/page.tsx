// app/dashboard/inquiries/page.tsx
import { createClient } from "@supabase/supabase-js";

type TenantInquiry = {
  id: string;
  property_slug: string;
  full_name: string;
  email: string;
  phone: string | null;
  move_in_date: string | null;
  group_type: string | null;
  message: string;
  consent: boolean | null;
  source: string | null;
  ai_summary: string | null;
  ai_quality_score: number | null;
  status: string;
  created_at: string;
};

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

export default async function InquiriesDashboardPage() {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("tenant_inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("[Dashboard Inquiries] Error:", error);
    return (
      <div className="min-h-screen bg-black text-slate-100 p-6">
        <h1 className="text-xl font-semibold text-amber-300">
          Tenant Inquiries – Error
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          Could not load inquiries. Check Supabase logs / env config.
        </p>
      </div>
    );
  }

  const inquiries = (data || []) as TenantInquiry[];

  return (
    <div className="min-h-screen bg-black text-slate-100 px-4 py-6 sm:px-8">
      <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-300">
            Oasis International Real Estate Inc.
          </p>
          <h1 className="mt-1 text-xl font-semibold sm:text-2xl">
            Tenant Inquiries
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Latest leads across your properties (showing {inquiries.length}).
          </p>
        </div>
      </header>

      {inquiries.length === 0 ? (
        <p className="mt-6 text-sm text-slate-400">
          No inquiries yet. Once someone submits the Partington form, they will
          appear here.
        </p>
      ) : (
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70">
          <table className="min-w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-[0.18em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Move-in</th>
                <th className="px-4 py-3">Group</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">AI Summary</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => {
                const created = new Date(inq.created_at);
                const createdStr = created.toLocaleString("en-CA", {
                  dateStyle: "medium",
                  timeStyle: "short",
                });

                return (
                  <tr
                    key={inq.id}
                    className="border-t border-slate-800/80 hover:bg-slate-900/60"
                  >
                    <td className="px-4 py-3 align-top text-slate-400">
                      {createdStr}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="font-semibold">{inq.full_name}</div>
                      <div className="text-[11px] text-slate-400">
                        {inq.email}
                        {inq.phone ? ` · ${inq.phone}` : ""}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top text-[11px] text-slate-300">
                      {inq.property_slug}
                    </td>
                    <td className="px-4 py-3 align-top text-[11px] text-slate-300">
                      {inq.move_in_date ?? "—"}
                    </td>
                    <td className="px-4 py-3 align-top text-[11px] text-slate-300">
                      {inq.group_type ?? "—"}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span
                        className="inline-flex rounded-full bg-slate-900 px-2.5 py-1 text-[11px]"
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top text-[11px] text-slate-300 max-w-xs">
                      {inq.ai_summary ? (
                        <p className="line-clamp-3">{inq.ai_summary}</p>
                      ) : (
                        <span className="text-slate-500">
                          (No AI summary yet)
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
