
"use client";

import Link from "next/link";
import type {
  MouseEvent,
  MouseEventHandler,
  ReactNode,
} from "react";

interface PrimaryButtonProps {
  children: ReactNode;
  href?: string;
  className?: string;
  ariaLabel?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

interface LinkButtonProps {
  children: ReactNode;
  href: string;
  className?: string;
  ariaLabel?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a5bd6]";

const PRIMARY_STYLE = `
  group relative inline-flex items-center justify-center
  gap-2 overflow-hidden whitespace-nowrap rounded-full
  border-2 border-white
  bg-[linear-gradient(135deg,#026ada_0%,#0a5bd6_45%,#1ec8ff_100%)]
  px-5 py-3.5 text-sm font-semibold tracking-[0.01em]
  text-white shadow-md transition-all duration-300
  hover:opacity-95 hover:shadow-lg
  active:scale-[0.98]
  disabled:pointer-events-none disabled:opacity-50
`;

const OUTLINE_STYLE = `
  group relative inline-flex items-center justify-center
  gap-2 overflow-hidden whitespace-nowrap rounded-full
  border-2 border-white
  bg-transparent px-5 py-3.5
  text-sm font-semibold tracking-[0.01em]
  text-white shadow-md transition-all duration-300
  hover:bg-[linear-gradient(135deg,#026ada_0%,#0a5bd6_45%,#1ec8ff_100%)]
  hover:shadow-lg active:scale-[0.98]
`;

// ========================================
// REUSABLE SHINE EFFECT
// ========================================

function ButtonShine() {
  return (
    <>
      <span
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-y-0
          -left-1/2 w-1/4 -skew-x-12
          bg-white/40
          transition-transform duration-700 ease-out
          group-hover:translate-x-[1000%]
        "
      />

      <span
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-y-0
          -left-1/3 z-0 w-1/4 -skew-x-12
          bg-white/40
          transition-transform duration-700 ease-out
          group-hover:translate-x-[700%]
        "
      />
    </>
  );
}

// ========================================
// REUSABLE SECTION NAVIGATION
// ========================================

function handleSectionNavigation(
  event: MouseEvent<HTMLAnchorElement>,
  href: string
) {
  // Only handle same-page hash links
  if (!href.startsWith("#")) return;

  const sectionId = href.slice(1);
  const target = document.getElementById(sectionId);

  // Allow normal navigation if target doesn't exist
  if (!target) return;

  event.preventDefault();

  // Scroll to the section every time the button is clicked
  target.scrollIntoView({
    behavior: window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
      ? "auto"
      : "smooth",
    block: "start",
  });

  // Update the URL hash
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${window.location.search}${href}`
  );
}

// ========================================
// PRIMARY LINK BUTTON
// ========================================

function PrimaryLinkButton({
  children,
  href,
  className = "",
  ariaLabel,
  onClick,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      onClick={(event) => {
        handleSectionNavigation(event, href);
        onClick?.(event);
      }}
      className={`
        ${PRIMARY_STYLE}
        ${FOCUS_RING}
        ${className}
      `}
    >
      <ButtonShine />

      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </Link>
  );
}

function LinkButton({
  children,
  href,
  className = "",
  onClick,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      onClick={(event) => {
        handleSectionNavigation(event, href);
        onClick?.(event);
      }}
      className={`
        ${className}
      `}
    >
      {children}
    </Link>
  );
}

// ========================================
// OUTLINE LINK BUTTON
// ========================================

function OutlineLinkButton({
  children,
  href,
  className = "",
  ariaLabel,
  onClick,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      onClick={(event) => {
        handleSectionNavigation(event, href);
        onClick?.(event);
      }}
      className={`
        ${OUTLINE_STYLE}
        ${FOCUS_RING}
        ${className}
      `}
    >
      <ButtonShine />

      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </Link>
  );
}

// ========================================
// PRIMARY BUTTON
// ========================================

function PrimaryButton({
  children,
  onClick,
  className = "",
  ariaLabel,
  disabled = false,
  type = "button",
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`
        ${PRIMARY_STYLE}
        ${FOCUS_RING}
        ${className}
      `}
    >
      <ButtonShine />

      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </button>
  );
}

export {
  PrimaryButton,
  PrimaryLinkButton,
  OutlineLinkButton,
  LinkButton
};
