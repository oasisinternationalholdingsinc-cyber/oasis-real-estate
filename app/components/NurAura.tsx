"use client";

import { useEffect, useState } from "react";
import "./NurAura.css";

export type NurAuraMode =
  | "idle"
  | "listening"
  | "thinking"
  | "success"
  | "alert"
  | "error";

type NurAuraSize = "sm" | "md" | "lg";

type NurAuraProps = {
  size?: NurAuraSize;
  mode?: NurAuraMode;
  /** Optional: external click handler (e.g. open chat) */
  onClick?: () => void;
  /** Optional: aria-label for accessibility */
  ariaLabel?: string;
  /** If true, disables pointer/activation */
  disabled?: boolean;
};

/**
 * Nūr · Quantum Light Aura
 * Reusable animated AI presence for Oasis OS.
 */
export function NurAura({
  size = "md",
  mode = "idle",
  onClick,
  ariaLabel = "Ask Nūr",
  disabled = false,
}: NurAuraProps) {
  const [isActive, setIsActive] = useState(false);
  const [isThinking, setIsThinking] = useState(mode === "thinking");

  // Keep internal thinking state in sync with external mode
  useEffect(() => {
    setIsThinking(mode === "thinking");
  }, [mode]);

  const handleClick = () => {
    if (disabled) return;

    // Let parent know first (e.g. open chat panel)
    onClick?.();

    // Trigger activation flare
    setIsActive(true);

    // If we're in an idle/listening state, briefly show thinking pulse
    if (mode === "idle" || mode === "listening") {
      setIsThinking(true);

      setTimeout(() => setIsThinking(false), 4200);
    }

    setTimeout(() => setIsActive(false), 900);
  };

  const sizeClass =
    size === "sm"
      ? "nur-quantum--sm"
      : size === "lg"
      ? "nur-quantum--lg"
      : "nur-quantum--md";

  const modeClass = `nur-quantum--mode-${mode}`;

  const activeClass = isActive ? "nur-quantum--active" : "";
  const thinkingClass = isThinking ? "nur-quantum--thinking" : "";

  return (
    <button
      type="button"
      className={[
        "nur-quantum",
        sizeClass,
        modeClass,
        activeClass,
        thinkingClass,
        disabled ? "nur-quantum--disabled" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      {/* Outer & inner quantum rings */}
      <div className="nur-quantum__ring-outer" />
      <div className="nur-quantum__ring-inner" />

      {/* Core glow + nucleus */}
      <div className="nur-quantum__core-glow" />
      <div className="nur-quantum__core" />

      {/* Orbiting particle */}
      <div className="nur-quantum__particle-orbit">
        <div className="nur-quantum__particle" />
      </div>

      {/* Thinking line */}
      <div className="nur-quantum__thinking-line" />

      {/* Optional label slot: you can wrap this component and add text externally */}
    </button>
  );
}
