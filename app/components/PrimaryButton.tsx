
"use client";

import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

interface PrimaryButtonProps {
  children: ReactNode;
  href: string;
  className?: string;
  ariaLabel?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a5bd6]";

function PrimaryLinkButton({
  children,
  href,
  className = "",
  ariaLabel,
}: PrimaryButtonProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full border-2 border-white bg-[linear-gradient(135deg,#026ada_0%,#0a5bd6_45%,#1ec8ff_100%)] px-5 py-3.5 text-sm font-semibold tracking-[0.01em] text-white shadow-md transition-all duration-300 hover:opacity-95 hover:shadow-lg active:scale-[0.98] ${FOCUS_RING} ${className}`}
    >
      {/* Shine animation */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/1 w-1/4 -skew-x-12 bg-white/40 transition-transform duration-700 ease-out group-hover:translate-x-[1000%]"
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/3 z-0 w-1/4 -skew-x-12 bg-white/40 transition-transform duration-700 ease-out group-hover:translate-x-[700%]"
      />

      {/* Button content */}
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </Link>
  );
}


function PrimaryButton({
  children,
  onClick,
  className = "",
  ariaLabel,
}: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full border-2 border-white bg-[linear-gradient(135deg,#026ada_0%,#0a5bd6_45%,#1ec8ff_100%)] px-5 py-3.5 text-sm font-semibold tracking-[0.01em] text-white shadow-md transition-all duration-300 hover:opacity-95 hover:shadow-lg active:scale-[0.98] ${FOCUS_RING} ${className}`}
    >
      {/* Shine animation */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/1 w-1/4 -skew-x-12 bg-white/40 transition-transform duration-700 ease-out group-hover:translate-x-[1000%]"
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/3 z-0 w-1/4 -skew-x-12 bg-white/40 transition-transform duration-700 ease-out group-hover:translate-x-[700%]"
      />

      {/* Button content */}
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </button>
  );
}


export { PrimaryButton, PrimaryLinkButton}