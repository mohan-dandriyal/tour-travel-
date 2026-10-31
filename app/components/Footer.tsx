
"use client";

import type { MouseEvent, ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ArrowUp,
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import {
  Cormorant_Garamond,
  DM_Sans,
} from "next/font/google";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import footerData from "@/app/data/footer.json";
import { LinkButton } from "./PrimaryButton";

// ========================================
// FONTS
// ========================================

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-footer-heading",
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-footer-body",
});

// ========================================
// FOOTER DATA
// ========================================

const content = footerData.footer;

// ========================================
// CONTACT ICONS
// ========================================

const contactIcons: Record<string, LucideIcon> = {
  mail: Mail,
  phone: Phone,
  "map-pin": MapPin,
};

// ========================================
// SOCIAL ICONS
// ========================================

const svgProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const socialIcons: Record<string, ReactElement> = {
  instagram: (
    <svg {...svgProps}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),

  facebook: (
    <svg {...svgProps}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),

  youtube: (
    <svg {...svgProps}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  ),
};

const ease = [0.22, 1, 0.36, 1] as const;

// ========================================
// FOOTER COMPONENT
// ========================================

export default function Footer() {
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();

  // ========================================
  // SCROLL TO TOP
  // ========================================

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  // ========================================
  // REUSABLE FOOTER NAVIGATION
  // Handles repeated clicks on same-page links.
  // Also supports navigation to another page.
  // ========================================

  const handleFooterNavigation = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // Ignore external and non-page links
    if (
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("https://") ||
      href.startsWith("http://")
    ) {
      return;
    }

    const destination = new URL(
      href,
      window.location.href
    );

    // ========================================
    // HOME LINK: ALREADY ON HOME PAGE
    // ========================================

    if (
      destination.pathname === "/" &&
      pathname === "/" &&
      !destination.hash
    ) {
      event.preventDefault();
      scrollToTop();
      return;
    }

    // ========================================
    // SAME PAGE SECTION NAVIGATION
    // ========================================

    const isSamePage =
      destination.pathname === pathname &&
      destination.origin === window.location.origin;

    if (!isSamePage || !destination.hash) {
      return;
    }

    const sectionId = decodeURIComponent(
      destination.hash.slice(1)
    );

    const target = document.getElementById(sectionId);

    // If the section doesn't exist, allow normal navigation
    if (!target) return;

    // Prevent default anchor behavior
    event.preventDefault();

    // Always scroll, even if the URL hash is already active
    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });

    // Update URL without reloading the page
    window.history.replaceState(
      null,
      "",
      `${destination.pathname}${destination.search}${destination.hash}`
    );
  };

  // ========================================
  // REVEAL ANIMATION
  // ========================================

  const reveal = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 22,
    },

    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.65,
        ease,
      },
    },
  };

  // ========================================
  // THEME STYLES
  // ========================================

  const mutedText = {
    color: content.mutedTextColor,
  };

  const accentText = {
    color: content.accentColor,
  };

  const borderStyle = {
    borderColor: content.borderColor,
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <footer
      style={{
        backgroundColor: content.backgroundColor,
        color: content.textColor,
      }}
      className={`
        ${headingFont.variable}
        ${bodyFont.variable}
        overflow-hidden
      `}
    >
      <div className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 sm:pt-16 pb-6 lg:px-12">

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">

          {/* ==================================
              BRAND
          ================================== */}

          <motion.div
            className="lg:col-span-4"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.15,
            }}
          >
            <LinkButton
              href={content.brand.homeHref}
              aria-label={content.brand.imageAlt}
              onClick={(event) =>
                handleFooterNavigation(
                  event,
                  content.brand.homeHref
                )
              }
              className="group inline-flex items-center"
            >
              <Image
                src={content.brand.logoImage}
                alt={content.brand.imageAlt}
                width={180}
                height={64}
                className="
                  h-[5.5rem] w-auto
                  object-contain
                  transition-transform duration-300
                  group-hover:scale-105
                "
              />
            </LinkButton>

            <p
              style={mutedText}
              className="mt-6 max-w-sm text-sm leading-7"
            >
              {content.brand.description}
            </p>

            {/* SOCIAL LINKS */}

            <nav
              aria-label={content.accessibility.socialLinksLabel}
              className="mt-7 flex flex-wrap gap-3"
            >
              {content.socials.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  style={borderStyle}
                  className="
                    inline-flex h-11 min-w-11
                    items-center justify-center
                    rounded-full border px-3
                    text-xs font-semibold
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:bg-white/70
                  "
                  onMouseEnter={(event) => {
                    event.currentTarget.style.color =
                      content.accentColor;

                    event.currentTarget.style.borderColor =
                      content.accentColor;
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.color =
                      content.textColor;

                    event.currentTarget.style.borderColor =
                      content.borderColor;
                  }}
                >
                  {socialIcons[social.icon] ??
                    social.shortLabel}
                </a>
              ))}
            </nav>
          </motion.div>

          {/* ==================================
              NAVIGATION COLUMNS
          ================================== */}

          {content.columns.map((column, index) => (
            <motion.nav
              key={column.id}
              aria-label={`${content.accessibility.footerNavigationLabel}: ${column.title}`}
              className="lg:col-span-2"
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.15,
              }}
              transition={{
                delay: reduceMotion ? 0 : index * 0.08,
              }}
            >
              <h3
                className="
                  mb-6
                  font-[family-name:var(--font-footer-heading)]
                  text-2xl font-semibold
                "
              >
                {column.title}
              </h3>

              <ul className="space-y-4">
                {column.links.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      style={mutedText}
                      onClick={(event) =>
                        handleFooterNavigation(
                          event,
                          item.href
                        )
                      }
                      className="
                        group inline-flex items-center gap-2
                        text-sm transition-colors duration-300
                        hover:opacity-100
                      "
                      onMouseEnter={(event) => {
                        event.currentTarget.style.color =
                          content.accentColor;
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.color =
                          content.mutedTextColor;
                      }}
                    >
                      <span>{item.label}</span>

                      <ArrowUpRight
                        size={13}
                        aria-hidden="true"
                        className="
                          opacity-0
                          transition-all duration-300
                          group-hover:translate-x-0.5
                          group-hover:opacity-100
                        "
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          ))}

          {/* ==================================
              CONTACT INFORMATION
          ================================== */}

          <motion.div
            className="lg:col-span-4"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.15,
            }}
          >
            <h3
              className="
                mb-6
                font-[family-name:var(--font-footer-heading)]
                text-2xl font-semibold
              "
            >
              {content.contact.title}
            </h3>

            <ul
              aria-label={content.accessibility.contactLinksLabel}
              className="space-y-5"
            >
              {content.contact.items.map((item) => {
                const Icon = contactIcons[item.icon];

                return (
                  <li
                    key={item.id}
                    className="flex items-start gap-3"
                  >
                    {Icon && (
                      <Icon
                        size={18}
                        aria-hidden="true"
                        style={accentText}
                        className="mt-0.5 shrink-0"
                      />
                    )}

                    <a
                      href={item.href}
                      target={
                        item.icon === "map-pin"
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        item.icon === "map-pin"
                          ? "noopener noreferrer"
                          : undefined
                      }
                      aria-label={`${item.label}: ${item.value}`}
                      style={mutedText}
                      className="
                        break-words text-sm leading-6
                        transition-colors duration-300
                        hover:opacity-100
                      "
                      onMouseEnter={(event) => {
                        event.currentTarget.style.color =
                          content.accentColor;
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.color =
                          content.mutedTextColor;
                      }}
                    >
                      {item.value}
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>

        {/* ==================================
            BOTTOM FOOTER
        ================================== */}

        <motion.div
          style={borderStyle}
          className="mt-14 border-t pt-6 sm:mt-8"
          initial={{
            opacity: 0,
            y: reduceMotion ? 0 : 12,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: reduceMotion ? 0 : 0.6,
            ease,
          }}
        >
          <div
            className="
              flex flex-col gap-5
              sm:flex-row sm:items-center
              sm:justify-between
            "
          >
            <p
              style={mutedText}
              className="text-xs leading-6"
            >
              {content.bottom.copyrightPrefix}{" "}
              {content.bottom.year}{" "}
              {content.brand.name}{" "}
              {content.bottom.copyrightSuffix}{" "}
              {content.bottom.tagline}
            </p>

            {/* BACK TO TOP */}

            <button
              type="button"
              onClick={scrollToTop}
              aria-label={content.bottom.backToTopLabel}
              style={borderStyle}
              className="
                group inline-flex h-11 w-fit
                items-center gap-2
                rounded-full border px-5
                text-xs font-semibold
                transition-all duration-300
                hover:bg-white/70
                focus-visible:outline-none
                focus-visible:ring-2
              "
              onMouseEnter={(event) => {
                event.currentTarget.style.color =
                  content.accentColor;

                event.currentTarget.style.borderColor =
                  content.accentColor;
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.color =
                  content.textColor;

                event.currentTarget.style.borderColor =
                  content.borderColor;
              }}
            >
              {content.bottom.backToTopLabel}

              <ArrowUp
                size={14}
                aria-hidden="true"
                className="
                  transition-transform duration-300
                  group-hover:-translate-y-0.5
                "
              />
            </button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
