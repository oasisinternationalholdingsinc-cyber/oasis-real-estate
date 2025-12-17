export default function ThreadDefault() {
  return (
    <div className="px-5 py-8">
      <div className="rounded-2xl border border-slate-900 bg-slate-950/45 p-6">
        <p className="text-sm font-semibold text-slate-100">Select an inquiry</p>
        <p className="mt-2 text-[12px] leading-relaxed text-slate-400">
          Choose a lead from the left to view the full message timeline, reply,
          and operate the thread like a real inbox.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-900 bg-black/30 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
              Reality
            </p>
            <p className="mt-2 text-[12px] text-slate-400">
              Messages stay raw and chronological. No table vibes. No noise.
            </p>
          </div>

          <div className="rounded-xl border border-slate-900 bg-black/30 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
              Command
            </p>
            <p className="mt-2 text-[12px] text-slate-400">
              Reply, mark contacted, schedule viewings — all anchored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
