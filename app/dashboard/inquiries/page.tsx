// app/dashboard/inquiries/page.tsx

import { createClient } from "@supabase/supabase-js";

// Keep this in sync with your tenant_inquiries table
type TenantInquiry = {
  id: string;
  created_at: string;
  full_name: string | null;
  email: string | null;
  phone?: string | null;
  move_in_date?: string | null;
  household_type?: string | null;
  message?: string | null;
  property_slug?: string | null;
  status?: string | null;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side client using service role so RLS doesn’t block us
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export const revalidate = 0; // always fetch fresh on each request

export default async function TenantInquiriesPage() {
  // 🔎 1) Fetch ALL tenant inquiries, newest first
  const { data, error } = await supabase
    .from("tenant_inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading tenant inquiries:", error);
  }

  const inquiries: TenantInquiry[] = data ?? [];
  const total = inquiries.length;

  return (
    <main className="min-h-screen bg-black text-slate-100 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <p className="text-xs tracking-[0.25em] text-amber-400 uppercase mb-2">
            OASIS INTERNATIONAL REAL ESTATE INC.
          </p>
          <h1 className="text-3xl font-semibold">Tenant Inquiries</h1>
          <p className="text-sm text-slate-400 mt-1">
            Latest leads across your properties{" "}
            <span className="text-amber-300">(showing {total}).</span>
          </p>
        </header>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-700 bg-rose-950/40 px-4 py-3 text-sm text-rose-200">
            There was an error loading inquiries. Check the console / Supabase
            logs for details.
          </div>
        )}

        {total === 0 ? (
          <div className="mt-10 text-sm text-slate-400">
            No inquiries yet. Once someone submits the Partington form, they
            will appear here.
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-900/70 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Household</th>
                  <th className="px-4 py-3 text-left">Move-in</th>
                  <th className="px-4 py-3 text-left">Submitted</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => (
                  <tr
                    key={inq.id}
                    className="border-t border-slate-800/70 hover:bg-slate-900/50"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">
                        {inq.full_name || "—"}
                      </div>
                      {inq.message && (
                        <div className="mt-0.5 line-clamp-2 text-xs text-slate-400">
                          {inq.message}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {inq.email || "—"}
                      {inq.phone && (
                        <div className="mt-0.5 text-slate-400">
                          {inq.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-300">
                      {inq.household_type || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-300">
                      {inq.move_in_date
                        ? new Date(inq.move_in_date).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-300">
                      {new Date(inq.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span className="inline-flex rounded-full border border-amber-400/60 bg-amber-400/10 px-2 py-0.5 text-[11px] uppercase tracking-wide text-amber-300">
                        {inq.status || "new"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
