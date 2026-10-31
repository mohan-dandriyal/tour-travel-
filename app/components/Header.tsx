
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { MouseEvent } from "react";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Variants,
} from "framer-motion";

import {
  ArrowRight,
  LogIn,
  Menu,
  Phone,
  Send,
  X,
  type LucideIcon,
} from "lucide-react";

import data from "@/app/data/header.json";

// ========================================
// HEADER DATA
// ========================================

const { logo, nav, actions } = data;

const EASE = [0.22, 1, 0.36, 1] as const;

// ========================================
// ICONS
// ========================================

const icons: Record<string, LucideIcon> = {
  phone: Phone,
  send: Send,
  "arrow-right": ArrowRight,
  "log-in": LogIn,
};

const ContactIcon = icons[actions.contact.icon] ?? Phone;

// ========================================
// STYLES
// ========================================

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#252D4A]";

// ========================================
// ANIMATIONS
// ========================================

const list: Variants = {
  hidden: {},

  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.15,
    },
  },
};

const item: Variants = {
  hidden: {
    opacity: 0,
    y: -14,
  },

  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: EASE,
    },
  },
};

const mobileList: Variants = {
  hidden: {},

  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const mobileItem: Variants = {
  hidden: {
    opacity: 0,
    x: -18,
  },

  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: EASE,
    },
  },
};

// ========================================
// GET SECTION ID
// Supports "#about" and "/#about"
// ========================================

function getSectionId(href: string) {
  const index = href.indexOf("#");

  if (index === -1) return null;

  return href.slice(index + 1) || null;
}

// ========================================
// ROUTE MATCHING
// ========================================

function isActiveRoute(pathname: string, href: string) {
  const normalizedHref = href
    .split("?")[0]
    .split("#")[0];

  if (
    normalizedHref === "" ||
    normalizedHref === "/"
  ) {
    return pathname === "/";
  }

  return (
    pathname === normalizedHref ||
    pathname.startsWith(`${normalizedHref}/`)
  );
}

// ========================================
// TRACKED SECTION IDS
// ========================================

const TRACKED_IDS = Array.from(
  new Set(
    [...nav.map((n) => n.href), actions.contact.href]
      .map(getSectionId)
      .filter((id): id is string => Boolean(id))
  )
);

// ========================================
// HEADER COMPONENT
// ========================================

export default function Header() {
  const pathname = usePathname();

  // ========================================
  // STATES
  // ========================================

  const [openPathname, setOpenPathname] =
    useState<string | null>(null);

  const [previousPathname, setPreviousPathname] =
    useState(pathname);

  if (previousPathname !== pathname) {
    setPreviousPathname(pathname);
    setOpenPathname(null);
  }

  const open = openPathname === pathname;

  const [hoveredState, setHoveredState] = useState<{
    pathname: string;
    value: string;
  } | null>(null);

  const hovered =
    hoveredState?.pathname === pathname
      ? hoveredState.value
      : null;

  const setHovered = (value: string | null) => {
    setHoveredState(
      value
        ? {
            pathname,
            value,
          }
        : null
    );
  };

  const [scrolled, setScrolled] = useState(false);

  const [activeId, setActiveId] = useState<string | null>(
    TRACKED_IDS[0] ?? null
  );

  // ========================================
  // REFS
  // ========================================

  const barRef = useRef<HTMLDivElement>(null);

  const lockedRef = useRef(false);

  const lockTimerRef = useRef<number | undefined>(
    undefined
  );

  const computeRef = useRef<() => void>(() => {});

  // ========================================
  // HEADER OFFSET
  // ========================================

  const getOffset = useCallback(() => {
    return (barRef.current?.offsetHeight ?? 72) + 16;
  }, []);

  // ========================================
  // SCROLL SPY
  // Detect active section while scrolling
  // ========================================

  useEffect(() => {
    let ticking = false;

    const compute = () => {
      ticking = false;

      setScrolled(window.scrollY > 20);

      if (lockedRef.current) return;

      const offset = getOffset();

      const existing = TRACKED_IDS.filter((id) =>
        document.getElementById(id)
      );

      if (existing.length === 0) return;

      let current = existing[0];

      for (const id of existing) {
        const element = document.getElementById(id);

        if (
          element &&
          element.getBoundingClientRect().top <= offset
        ) {
          current = id;
        }
      }

      // Last section wins when the page reaches the bottom.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      if (atBottom) {
        current = existing[existing.length - 1];
      }

      setActiveId(current);
    };

    computeRef.current = compute;

    const onScroll = () => {
      if (ticking) return;

      ticking = true;

      window.requestAnimationFrame(compute);
    };

    compute();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);

      window.clearTimeout(lockTimerRef.current);
    };
  }, [getOffset, pathname]);

  // ========================================
  // HANDLE HASH NAVIGATION AFTER ROUTE CHANGE
  // Supports links like "/#contact" from
  // another page.
  // ========================================

  useEffect(() => {
    const hash = window.location.hash;

    if (!hash) {
      computeRef.current();
      return;
    }

    const id = decodeURIComponent(hash.slice(1));

    let frame = 0;
    let attempts = 0;

    const scrollToSection = () => {
      const target = document.getElementById(id);

      if (target) {
        const top =
          target.getBoundingClientRect().top +
          window.scrollY -
          getOffset();

        setActiveId(id);

        lockedRef.current = true;

        window.scrollTo({
          top: Math.max(top, 0),
          behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches
            ? "auto"
            : "smooth",
        });

        window.clearTimeout(lockTimerRef.current);

        lockTimerRef.current = window.setTimeout(() => {
          lockedRef.current = false;
          computeRef.current();
        }, 900);

        return;
      }

      // Give Next.js time to render the destination section.
      if (attempts < 10) {
        attempts += 1;
        frame = window.requestAnimationFrame(scrollToSection);
      }
    };

    frame = window.requestAnimationFrame(scrollToSection);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [pathname, getOffset]);

  // ========================================
  // ESCAPE KEY
  // ========================================

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPathname(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open]);

  // ========================================
  // CLOSE MENU WHEN SWITCHING TO DESKTOP
  // ========================================

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(min-width: 1024px)"
    );

    const handleChange = (
      event: MediaQueryListEvent
    ) => {
      if (event.matches) {
        setOpenPathname(null);
      }
    };

    mediaQuery.addEventListener(
      "change",
      handleChange
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleChange
      );
    };
  }, []);

  // ========================================
  // REUSABLE SECTION NAVIGATION
  // Works on every click, even when the same
  // hash is already present in the URL.
  // ========================================

  const handleAnchorClick = useCallback(
    (
      event: MouseEvent<HTMLAnchorElement>,
      href: string
    ) => {
      setOpenPathname(null);

      // Resolve the link relative to the current URL.
      const destination = new URL(
        href,
        window.location.href
      );

      const isSamePage =
        destination.origin === window.location.origin &&
        destination.pathname === window.location.pathname;

      // Let Next.js handle navigation to another page.
      if (!isSamePage || !destination.hash) {
        return;
      }

      const id = decodeURIComponent(
        destination.hash.slice(1)
      );

      if (!id) return;

      const target = document.getElementById(id);

      // Allow normal navigation if the section doesn't exist.
      if (!target) return;

      // Prevent default hash behavior.
      event.preventDefault();

      // Calculate scroll position below sticky header.
      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        getOffset();

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Immediately update active navigation.
      setActiveId(id);

      // Pause scroll-spy during smooth scrolling.
      lockedRef.current = true;

      window.clearTimeout(lockTimerRef.current);

      // Always scroll, even when the hash is unchanged.
      window.scrollTo({
        top: Math.max(top, 0),
        behavior: reduceMotion ? "auto" : "smooth",
      });

      // Update URL without page reload.
      window.history.replaceState(
        null,
        "",
        `${destination.pathname}${destination.search}${destination.hash}`
      );

      // Resume scroll-spy after navigation.
      lockTimerRef.current = window.setTimeout(
        () => {
          lockedRef.current = false;
          computeRef.current();
        },
        reduceMotion ? 50 : 900
      );
    },
    [getOffset]
  );

  // ========================================
  // ACTIVE NAVIGATION
  // ========================================

  const isItemActive = (href: string) => {
    const id = getSectionId(href);

    return id
      ? activeId === id
      : isActiveRoute(pathname, href);
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <MotionConfig reducedMotion="user">
      <motion.header
        initial={{
          y: -30,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.5,
          ease: EASE,
        }}
        className={`
          sticky top-0 z-50 w-full
          border-b antialiased
          transition-[background-color,border-color,box-shadow,backdrop-filter]
          duration-300
          ${
            scrolled
              ? "border-neutral-200/80 bg-white/95 shadow-md backdrop-blur-xl"
              : "border-transparent bg-white shadow-sm"
          }
        `}
      >
        {/* ==================================
            HEADER CONTAINER
        ================================== */}

        <div
          ref={barRef}
          className="
            mx-auto flex max-w-7xl
            items-center justify-between
            px-6 py-3 lg:px-10
          "
        >
          {/* ==================================
              LOGO
          ================================== */}

          <Link
            href={logo.href}
            aria-label={logo.alt}
            className="
              shrink-0 rounded-sm
              focus-visible:outline
              focus-visible:outline-2
              focus-visible:outline-offset-4
              focus-visible:outline-black
            "
          >
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 18,
              }}
            >
              <Image
                src={logo.image}
                alt={logo.alt}
                width={160}
                height={160}
                priority
                className="
                  h-12 w-auto
                  object-contain sm:h-14
                "
              />
            </motion.div>
          </Link>

          {/* ==================================
              DESKTOP NAVIGATION
          ================================== */}

          <nav
            aria-label="Main navigation"
            className="hidden lg:block"
          >
            <motion.ul
              variants={list}
              initial="hidden"
              animate="show"
              className="flex items-center gap-1"
              onMouseLeave={() => setHovered(null)}
            >
              {nav.map((n) => {
                const active = isItemActive(n.href);

                const highlighted = hovered
                  ? hovered === n.href
                  : active;

                return (
                  <motion.li
                    key={n.href}
                    variants={item}
                  >
                    <Link
                      href={n.href}
                      aria-current={
                        active ? "location" : undefined
                      }
                      onClick={(event) =>
                        handleAnchorClick(event, n.href)
                      }
                      onMouseEnter={() =>
                        setHovered(n.href)
                      }
                      onFocus={() =>
                        setHovered(n.href)
                      }
                      onBlur={() =>
                        setHovered(null)
                      }
                      className={`
                        relative isolate block
                        whitespace-nowrap rounded-full
                        px-3 py-2 text-[14px]
                        font-semibold tracking-[0.01em]
                        transition-colors duration-300
                        ${FOCUS_RING}
                        xl:px-4
                        ${
                          active
                            ? "text-[#A64A2B]"
                            : "text-neutral-700 hover:text-[#A64A2B]"
                        }
                      `}
                    >
                      {highlighted && (
                        <motion.span
                          layoutId="header-active-indicator"
                          aria-hidden="true"
                          className={`
                            absolute inset-0 -z-10
                            rounded-full
                            ${
                              active
                                ? ""
                                : "bg-orange-500/10"
                            }
                          `}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 36,
                          }}
                        />
                      )}

                      {n.label}

                      {/* Active underline */}

                      {active && (
                        <motion.span
                          layoutId="header-active-underline"
                          aria-hidden="true"
                          className="
                            absolute inset-x-3
                            -bottom-0.5 h-0.5
                            rounded-full bg-[#BD5938]
                            xl:inset-x-4
                          "
                          transition={{
                            type: "spring",
                            stiffness: 450,
                            damping: 35,
                          }}
                        />
                      )}
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>
          </nav>

          {/* ==================================
              DESKTOP CONTACT BUTTON
          ================================== */}

          <motion.div
            variants={list}
            initial="hidden"
            animate="show"
            className="hidden items-center lg:flex"
          >
            <motion.div
              variants={item}
              className="relative"
            >
              <motion.span
                aria-hidden="true"
                className="
                  pointer-events-none absolute
                  inset-0 rounded-full
                  bg-orange-500
                "
                animate={
                  scrolled
                    ? {
                        scale: 1,
                        opacity: 0,
                      }
                    : {
                        scale: [1, 1.3],
                        opacity: [0.3, 0],
                      }
                }
                transition={{
                  duration: 2.2,
                  ease: "easeOut",
                  repeat: scrolled ? 0 : Infinity,
                }}
              />

              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link
                  href={actions.contact.href}
                  aria-label={actions.contact.label}
                  onClick={(event) =>
                    handleAnchorClick(
                      event,
                      actions.contact.href
                    )
                  }
                  className={`
                    group relative inline-flex
                    items-center justify-center
                    gap-2 overflow-hidden
                    rounded-full border-2 border-white
                    bg-[image:var(--grad-sunset)]
                    px-5 py-3
                    text-sm font-bold
                    tracking-[0.01em] text-white
                    shadow-md transition-all duration-300
                    hover:opacity-90 hover:shadow-lg
                    active:scale-[0.98]
                    ${FOCUS_RING}
                  `}
                >
                  <ContactIcon
                    className="
                      relative h-4 w-4
                      transition-transform duration-300
                      group-hover:rotate-12
                      group-hover:scale-110
                    "
                    aria-hidden="true"
                  />

                  <span className="relative">
                    {actions.contact.label}
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ==================================
              MOBILE MENU TOGGLE
          ================================== */}

          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() =>
              setOpenPathname(
                open ? null : pathname
              )
            }
            aria-expanded={open}
            aria-controls="header-mobile-menu"
            aria-label={
              open ? "Close menu" : "Open menu"
            }
            className={`
              rounded-md p-2
              text-[#252D4A]
              lg:hidden
              ${FOCUS_RING}
            `}
          >
            <AnimatePresence
              mode="wait"
              initial={false}
            >
              <motion.span
                key={open ? "close" : "open"}
                initial={{
                  rotate: -90,
                  opacity: 0,
                }}
                animate={{
                  rotate: 0,
                  opacity: 1,
                }}
                exit={{
                  rotate: 90,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.15,
                }}
                className="block"
              >
                {open ? (
                  <X
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                ) : (
                  <Menu
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>

        {/* ==================================
            MOBILE MENU
        ================================== */}

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="header-mobile-menu"
              key="header-mobile-menu"
              initial={{
                height: 0,
                opacity: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
              }}
              exit={{
                height: 0,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
                ease: EASE,
              }}
              className="
                overflow-hidden
                border-t border-neutral-200
                bg-white shadow-lg
                lg:hidden
              "
            >
              <motion.div
                variants={mobileList}
                initial="hidden"
                animate="show"
                className="
                  max-h-[calc(100dvh-4.5rem)]
                  overflow-y-auto overscroll-contain
                  px-6 pb-6 pt-3
                "
              >
                <ul>
                  {nav.map((n) => {
                    const active = isItemActive(n.href);

                    return (
                      <motion.li
                        key={n.href}
                        variants={mobileItem}
                        className="
                          border-b border-neutral-100
                          last:border-none
                        "
                      >
                        <Link
                          href={n.href}
                          aria-current={
                            active ? "location" : undefined
                          }
                          onClick={(event) =>
                            handleAnchorClick(
                              event,
                              n.href
                            )
                          }
                          className={`
                            flex items-center
                            justify-between rounded-md
                            px-3 py-3 text-base
                            font-semibold
                            transition-colors duration-300
                            ${FOCUS_RING}
                            ${
                              active
                                ? "bg-[#BD5938]/10 text-[#A64A2B]"
                                : "text-neutral-700 hover:bg-neutral-50 hover:text-[#A64A2B]"
                            }
                          `}
                        >
                          <span>{n.label}</span>

                          {active && (
                            <motion.span
                              layoutId="mobile-active-indicator"
                              aria-hidden="true"
                              className="
                                h-2 w-2 rounded-full
                                bg-[#BD5938]
                              "
                            />
                          )}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>

                {/* Mobile Contact Button */}

                <motion.div
                  variants={mobileItem}
                  className="mt-5"
                >
                  <Link
                    href={actions.contact.href}
                    onClick={(event) =>
                      handleAnchorClick(
                        event,
                        actions.contact.href
                      )
                    }
                    className={`
                      group flex items-center
                      justify-center gap-2
                      rounded-full border-2
                      border-white
                      bg-[image:var(--grad-sunset)]
                      px-5 py-3
                      text-sm font-bold
                      tracking-[0.01em] text-white
                      shadow-md transition-opacity
                      hover:opacity-90
                      ${FOCUS_RING}
                    `}
                  >
                    <ContactIcon
                      className="h-4 w-4"
                      aria-hidden="true"
                    />

                    {actions.contact.label}
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </MotionConfig>
  );
}
