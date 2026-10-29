
"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Compass, MapPin, Globe, Plane, Mountain } from "lucide-react";

import loadingData from "@/app/data/loadinScreen.json";

const data = loadingData;

const iconMap = {
  compass: Compass,
  globe: Globe,
  plane: Plane,
  mountain: Mountain
} as const;

export default function LoadingScreen() {
  const prefersReducedMotion = useReducedMotion();

  const animateEnabled =
    data.animation.enabled && !prefersReducedMotion;

  const BrandIcon =
    iconMap[data.brand.icon as keyof typeof iconMap] ?? Compass;

  const logoSize = data.layout.logoSize;

  const entrance = (delay = 0) => ({
    initial: animateEnabled
      ? { opacity: 0, y: 14 }
      : false,
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: animateEnabled ? data.animation.duration : 0,
      delay: animateEnabled ? delay : 0,
      ease: [0.22, 1, 0.36, 1] as const
    }
  });

  return (
    <main
      role="status"
      aria-label={`${data.brand.name}: ${data.content.loadingText}`}
      className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-hidden px-5"
      style={{ backgroundColor: data.theme.background }}
    >
      {/* Background decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-60 blur-3xl"
        style={{ backgroundColor: data.theme.decoration }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-32 h-[30rem] w-[30rem] rounded-full opacity-15 blur-3xl"
        style={{ backgroundColor: data.theme.accent }}
      />

      {/* Animated travel route */}
      {data.animation.showTravelRoute && (
        <svg
          aria-hidden="true"
          viewBox="0 0 360 240"
          className="pointer-events-none absolute left-1/2 top-1/2 w-[min(90vw,360px)] -translate-x-1/2 -translate-y-1/2 opacity-30"
          fill="none"
        >
          <motion.path
            d="M35 185 C80 35 160 220 205 105 S290 45 325 80"
            stroke={data.theme.accent}
            strokeWidth="1.5"
            strokeDasharray="5 8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: animateEnabled
                ? data.animation.routeDuration
                : 0,
              ease: "easeInOut",
              repeat: animateEnabled ? Infinity : 0,
              repeatType: "loop"
            }}
          />

          <circle cx="35" cy="185" r="4" fill={data.theme.accent} />
          <circle cx="325" cy="80" r="4" fill={data.theme.accent} />
        </svg>
      )}

      {/* Main content */}
      <div
        className="relative z-10 flex w-full flex-col items-center text-center"
        style={{ maxWidth: data.layout.maxWidth }}
      >
        {/* Brand logo */}
        {data.brand.showLogo && (
          <motion.div
            {...entrance(0)}
            className="relative mb-8 flex items-center justify-center"
            style={{ width: logoSize, height: logoSize }}
          >
            {animateEnabled && (
              <motion.div
                aria-hidden="true"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 rounded-full border border-dashed"
                style={{ borderColor: data.theme.accent }}
              />
            )}

            {data.brand.logo ? (
              <div
                className="relative overflow-hidden rounded-full"
                style={{
                  width: logoSize * 0.75,
                  height: logoSize * 0.75
                }}
              >
                <Image
                  src={data.brand.logo}
                  alt={data.brand.name}
                  fill
                  sizes={`${Math.round(logoSize * 0.75)}px`}
                  className="object-contain"
                />
              </div>
            ) : (
              <div
                className="flex items-center justify-center rounded-full shadow-xl"
                style={{
                  width: logoSize * 0.75,
                  height: logoSize * 0.75,
                  backgroundColor: data.theme.primary,
                  color: data.theme.background
                }}
              >
                <BrandIcon
                  size={Math.round(logoSize * 0.4)}
                  strokeWidth={1.25}
                />
              </div>
            )}

            {data.brand.showLocationIcon && (
              <motion.div
                animate={
                  animateEnabled
                    ? { y: [0, -5, 0] }
                    : undefined
                }
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -right-1 top-2 flex h-8 w-8 items-center justify-center rounded-full border-2"
                style={{
                  backgroundColor: data.theme.accent,
                  color: "#ffffff",
                  borderColor: data.theme.background
                }}
              >
                <MapPin size={15} />
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Brand name */}
        <motion.p
          {...entrance(0.1)}
          className="mb-3 text-[10px] font-bold uppercase tracking-[0.35em] sm:text-xs"
          style={{ color: data.theme.accent }}
        >
          {data.brand.name}
        </motion.p>

        {/* Heading */}
        <motion.h1
          {...entrance(0.2)}
          className="font-serif text-4xl font-medium leading-tight tracking-tight sm:text-5xl"
          style={{ color: data.theme.primary }}
        >
          {data.content.heading}

          <span
            className="mt-1 block italic"
            style={{ color: data.theme.accent }}
          >
            {data.content.accentHeading}
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          {...entrance(0.3)}
          className="mt-5 max-w-xs text-sm leading-6"
          style={{ color: data.theme.text }}
        >
          {data.content.description}
        </motion.p>

        {/* Loading indicator */}
        {data.animation.showLoadingBar && (
          <div
            className="mt-10 h-[3px] overflow-hidden rounded-full"
            style={{
              width: data.layout.loadingBarWidth,
              backgroundColor: `${data.theme.primary}18`
            }}
            aria-hidden="true"
          >
            <motion.div
              className="h-full origin-left rounded-full"
              style={{ backgroundColor: data.theme.accent }}
              initial={{ scaleX: 0 }}
              animate={
                animateEnabled
                  ? { scaleX: [0, 1, 0] }
                  : { scaleX: 1 }
              }
              transition={{
                duration: animateEnabled
                  ? data.animation.loaderDuration
                  : 0,
                ease: "easeInOut",
                repeat: animateEnabled ? Infinity : 0,
                repeatDelay: 0.2
              }}
            />
          </div>
        )}

        {/* Loading text */}
        <motion.p
          {...entrance(0.4)}
          className="mt-4 text-[10px] font-semibold uppercase tracking-[0.25em]"
          style={{ color: data.theme.text }}
        >
          {data.content.loadingText}
        </motion.p>
      </div>

      {/* Footer */}
      {data.animation.showFooter && (
        <motion.footer
          {...entrance(0.5)}
          className="absolute bottom-7 left-0 right-0 px-4 text-center"
        >
          <p
            className="text-[10px] tracking-[0.2em]"
            style={{ color: `${data.theme.text}B3` }}
          >
            {data.content.footer}
          </p>
        </motion.footer>
      )}
    </main>
  );
}
