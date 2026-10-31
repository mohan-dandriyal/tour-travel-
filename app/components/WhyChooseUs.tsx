"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ChevronDown,
  Compass,
  Headset,
  MapPin,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import whyChooseUsData from "@/app/data/why_choose_us.json";

type Feature = {
  id: string;
  number: string;
  icon: string;
  title: string;
  description: string;
};

type WhyChooseUsData = {
  sectionId: string;
  tagline: string;
  heading: { light: string; accent: string };
  description: string;
  image: string;
  imageAlt: string;
  imageCard: { icon: string; eyebrow: string; title: string };
  badge: { value: string; label: string };
  caption: { eyebrow: string; heading: string; note: string };
  featuresIntro: { eyebrow: string; heading: string };
  features: Feature[];
  trustNote: { icon: string; title: string; description: string };
  stats: { value: string; label: string }[];
  cta?: { label: string; href: string };
};

const data = whyChooseUsData as WhyChooseUsData;

const iconMap: Record<string, LucideIcon> = {
  compass: Compass,
  "map-pin": MapPin,
  wallet: Wallet,
  headset: Headset,
};

const getIcon = (name: string): LucideIcon | undefined => iconMap[name];

const ImageCardIcon = getIcon(data.imageCard.icon);
const featuresWithIcons = data.features.map((feature) => ({
  ...feature,
  Icon: getIcon(feature.icon),
}));

const ease = [0.22, 1, 0.36, 1] as const;

export default function WhyChooseUs() {
  const reduceMotion = useReducedMotion();

  // The first item is open by default. Clicking the open item closes it.
  const [openId, setOpenId] = useState<string | null>(
    featuresWithIcons[0]?.id ?? null
  );

  const toggle = (id: string) =>
    setOpenId((current) => (current === id ? null : id));

  const fadeUp = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.65, ease },
    },
  };

  const stagger = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.12 },
    },
  };

  return (
    <section
      id={data.sectionId}
      className="relative overflow-hidden py-12 sm:py-[4.5rem] lg:py-18"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-[#e9e2d4]/60 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Section heading */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-14 flex flex-col gap-7 lg:mb-14 lg:flex-row lg:items-end lg:justify-between"
        >
          <motion.div variants={fadeUp} className="max-w-3xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-[#b75b38]" />
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b75b38]">
                {data.tagline}
              </p>
            </div>

            <h2 className="text-4xl font-medium leading-[1.08] tracking-[-0.05em] text-[#252d4a] sm:text-5xl lg:text-7xl">
              {data.heading.light}{" "}
              <span className="font-serif italic text-[#b75b38]">
                {data.heading.accent}
              </span>
            </h2>
          </motion.div>

          <motion.div variants={fadeUp} className="max-w-md lg:pb-2">
            <p className="text-sm leading-7 text-[#686b73] sm:text-base">
              {data.description}
            </p>
          </motion.div>
        </motion.div>

        {/* Image and FAQ */}
        <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-14">
          {/* Image panel */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduceMotion ? 0 : 0.8, ease }}
            className="relative min-w-0"
          >
            <div className="relative min-h-[440px] overflow-hidden rounded-[2rem] bg-[#e5e0d5] sm:min-h-[560px] lg:min-h-[680px]">
              <Image
                src={data.image}
                alt={data.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-1000 hover:scale-[1.04]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#171d31]/85 via-[#171d31]/10 to-transparent" />

              {/* Top badge */}
              <div className="absolute left-5 top-5 flex items-center gap-3 rounded-2xl border border-white/40 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-xl sm:left-7 sm:top-7 sm:px-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3e8df] text-[#b75b38]">
                  {ImageCardIcon && (
                    <ImageCardIcon size={20} strokeWidth={1.6} />
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#777982]">
                    {data.imageCard.eyebrow}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#252d4a]">
                    {data.imageCard.title}
                  </p>
                </div>
              </div>

              {/* Caption */}
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-9 lg:p-10">
                <div className="mb-5 flex items-center gap-2">
                  <span className="h-px w-7 bg-[#e6a184]" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.23em] text-white/80 sm:text-xs">
                    {data.caption.eyebrow}
                  </p>
                </div>

                <h3 className="max-w-md font-serif text-3xl italic leading-tight sm:text-4xl lg:text-5xl">
                  {data.caption.heading}
                </h3>

                <div className="mt-6 flex items-center gap-2 text-xs font-medium text-white/75">
                  <MapPin size={15} />
                  <span>{data.caption.note}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FAQ-style features */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="flex min-w-0 flex-col justify-center"
          >
            <motion.div variants={fadeUp} className="mb-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b75b38]">
                {data.featuresIntro.eyebrow}
              </p>
            </motion.div>

            <div className="space-y-3">
              {featuresWithIcons.map((feature) => {
                const isOpen = openId === feature.id;
                const panelId = `feature-panel-${feature.id}`;
                const buttonId = `feature-button-${feature.id}`;

                return (
                  <motion.div
                    key={feature.id}
                    variants={fadeUp}
                    className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                      isOpen
                        ? "border-[#b75b38]/40 shadow-[0_18px_50px_rgba(37,45,74,0.08)]"
                        : "border-[#252d4a]/[0.08] hover:border-[#b75b38]/30"
                    }`}
                  >
                    <h4>
                      <button
                        type="button"
                        id={buttonId}
                        onClick={() => toggle(feature.id)}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        className="flex w-full items-center gap-4 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#b75b38] sm:p-5"
                      >
                        <span
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors duration-300 ${
                            isOpen
                              ? "bg-[#252d4a] text-white"
                              : "bg-[#f4eee7] text-[#b75b38]"
                          }`}
                        >
                          {feature.Icon && (
                            <feature.Icon size={22} strokeWidth={1.6} />
                          )}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-base font-semibold tracking-tight text-[#252d4a] sm:text-lg">
                            {feature.title}
                          </span>
                        </span>

                        <ChevronDown
                          size={20}
                          aria-hidden="true"
                          className={`shrink-0 text-[#252d4a] transition-transform duration-300 ${
                            isOpen ? "rotate-180 text-[#b75b38]" : ""
                          }`}
                        />
                      </button>
                    </h4>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="panel"
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: reduceMotion ? 0 : 0.35,
                            ease,
                          }}
                          className="overflow-hidden"
                        >
                          <p className="px-4 pb-5 pl-[4.5rem] pr-6 text-sm leading-7 text-[#686b73] sm:px-5 sm:pb-6 sm:pl-[5.25rem]">
                            {feature.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Statistics */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-18 grid grid-cols-1 gap-5 border-t border-[#e8e6df] pt-8 text-center sm:grid-cols-3 sm:gap-8 lg:mt-18 lg:pt-10"
        >
          {data.stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="flex items-center gap-4 sm:block"
            >
              <p className="min-w-[110px] font-serif text-4xl tracking-tight text-[#252d4a] sm:mb-2 sm:text-5xl">
                {stat.value}
              </p>
              <p className="text-sm text-[#777982]">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}