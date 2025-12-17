export default function IntelDefault() {
  return (
    <div className="px-5 py-8">
      <div className="rounded-2xl border border-slate-900 bg-slate-950/45 p-6">
        <p className="text-sm font-semibold text-slate-100">
          Intelligence panel
        </p>
        <p className="mt-2 text-[12px] leading-relaxed text-slate-400">
          When you select an inquiry, this panel shows AI summary + scores,
          internal notes, and lifecycle controls — using the data already stored
          in SQL (no duplicate AI work).
        </p>

        <div className="mt-5 space-y-3">
          <div className="rounded-xl border border-slate-900 bg-black/30 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200">
              AI Insight
            </p>
            <p className="mt-2 text-[12px] text-slate-400">
              Summary, quality score, lead score (read-only, calm, consistent).
            </p>
          </div>

          <div className="rounded-xl border border-slate-900 bg-black/30 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
              Operator Notes
            </p>
            <p className="mt-2 text-[12px] text-slate-400">
              Internal notes + status changes become institutional memory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
