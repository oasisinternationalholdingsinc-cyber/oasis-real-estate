// app/dashboard/inquiries/@thread/default.tsx
export default function ThreadDefault() {
  return (
    <div className="p-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="text-sm font-semibold">Record</div>
        <div className="mt-2 text-sm text-slate-300/80">
          Select a matter from the Register to open its record and issue a response.
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
              Continuity
            </p>
            <p className="mt-2 text-[12px] text-slate-400">
              Entries remain chronological and auditable — no spreadsheet vibes.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
              Action
            </p>
            <p className="mt-2 text-[12px] text-slate-400">
              Draft and issue responses with an operator-grade tone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
