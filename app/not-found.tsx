export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-amber-300 to-amber-600 shadow-lg shadow-amber-500/40">
          <span className="text-sm font-semibold text-black">O</span>
        </div>

        <h1 className="text-lg font-semibold text-amber-300 tracking-[0.18em] uppercase">
          Oasis International Real Estate
        </h1>

        <p className="mt-3 text-sm text-slate-200">
          The page you&apos;re looking for couldn&apos;t be found.
        </p>

        <p className="mt-2 text-xs text-slate-400">
          If you were trying to view a specific listing, please return to the
          homepage or contact us through the Partington inquiry form.
        </p>

        <a
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-2 text-[11px] font-semibold text-black shadow-lg shadow-amber-500/40 hover:bg-amber-300"
        >
          Go back to homepage
        </a>
      </div>
    </div>
  );
}
