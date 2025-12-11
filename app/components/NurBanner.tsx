"use client";

import React from "react";

type NurBannerProps = {
  title: string;
  body: string;
};

export function NurBanner({ title, body }: NurBannerProps) {
  return (
    <div className="mt-4 rounded-2xl border border-amber-400/60 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 px-4 py-3 text-xs text-amber-50 shadow-[0_0_30px_rgba(251,191,36,0.25)] sm:text-sm">
      <div className="flex items-start gap-2">
        <div className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-amber-400/90 text-[11px] font-semibold text-black flex items-center justify-center">
          N
        </div>
        <div>
          <p className="font-semibold tracking-wide">{title}</p>
          <p className="mt-1 text-amber-100/90">{body}</p>
        </div>
      </div>
    </div>
  );
}
