// app/components/NurLauncher.tsx
"use client";

import { useState } from "react";
import { NurAura, NurAuraMode } from "./NurAura";

export function NurLauncher() {
  const [mode, setMode] = useState<NurAuraMode>("idle");
  const [isOpen, setIsOpen] = useState(false);

  const openChat = () => {
    setIsOpen(true);
    setMode("listening");
  };

  // Pretend this is driven by your chat API
  const simulateThinking = () => {
    setMode("thinking");
    setTimeout(() => setMode("success"), 1200);
    setTimeout(() => setMode("idle"), 2600);
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="mb-2 w-80 rounded-2xl border border-slate-800 bg-slate-950/95 p-3 text-xs text-slate-100 shadow-xl">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-300">
            Nūr · Oasis Leasing Assistant
          </div>
          <p className="text-[11px] text-slate-300">
            Ask me anything about 831 Partington Ave, applications, or
            viewings. I&apos;ll route details to the Oasis team when needed.
          </p>
          <button
            onClick={simulateThinking}
            className="mt-3 rounded-full bg-amber-400 px-3 py-1.5 text-[11px] font-semibold text-black hover:bg-amber-300"
          >
            Simulate response
          </button>
        </div>
      )}

      <NurAura
        size="sm"
        mode={mode}
        onClick={openChat}
        ariaLabel="Open Nūr assistant"
      />
    </div>
  );
}
