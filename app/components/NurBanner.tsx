"use client";

type NurBannerProps = {
  title: string;
  body: string;
};

export function NurBanner({ title, body }: NurBannerProps) {
  return (
    <div className="mt-3 rounded-xl border border-slate-700/50 bg-slate-900/70 px-4 py-3 text-sm text-slate-100">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-600 text-xs font-semibold">
          N
        </span>
        <p className="font-medium">{title}</p>
      </div>
      <p className="mt-1 text-xs text-slate-300">{body}</p>
    </div>
  );
}
