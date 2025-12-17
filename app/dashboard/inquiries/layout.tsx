// app/dashboard/inquiries/layout.tsx
import type { ReactNode } from "react";

export default function InquiriesLayout({
  children,
  list,
  thread,
  intel,
}: {
  children: ReactNode;
  list: ReactNode;
  thread: ReactNode;
  intel: ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-0px)] bg-black text-white">
      {/* Oasis OS console grid */}
      <div className="mx-auto max-w-[1800px] px-4 py-6">
        <div className="grid grid-cols-12 gap-4">
          {/* LEFT: Inquiry List */}
          <div className="col-span-12 lg:col-span-4 xl:col-span-3">
            <div className="h-[calc(100vh-120px)] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="h-full overflow-auto">{list}</div>
            </div>
          </div>

          {/* MIDDLE: Thread */}
          <div className="col-span-12 lg:col-span-5 xl:col-span-6">
            <div className="h-[calc(100vh-120px)] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="h-full overflow-auto">{thread}</div>
            </div>
          </div>

          {/* RIGHT: Intel */}
          <div className="col-span-12 lg:col-span-3">
            <div className="h-[calc(100vh-120px)] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="h-full overflow-auto">{intel}</div>
            </div>
          </div>
        </div>

        {/* keep children mounted (not used visually, but keeps Next happy) */}
        <div className="hidden">{children}</div>
      </div>
    </div>
  );
}
