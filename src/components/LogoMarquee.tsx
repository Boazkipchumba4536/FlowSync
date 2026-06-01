"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { MARQUEE_LOGOS } from "@/lib/constants";

function LogoIcon({ name }: { name: string }) {
  const icons: Record<string, ReactNode> = {
    nvidia: (
      <svg viewBox="0 0 120 24" className="h-6 w-auto fill-current">
        <text x="0" y="18" fontSize="16" fontWeight="700" fontFamily="system-ui">NVIDIA</text>
      </svg>
    ),
    airbnb: (
      <svg viewBox="0 0 100 28" className="h-7 w-auto fill-current">
        <path d="M50 22c-2.5-3.5-5-7.5-6.5-10.5-1.5 3-4 7-6.5 10.5-1 1.5-2 2.5-3.5 2.5s-2.5-1-3.5-2.5C22 14 16 6 16 6s6 8 10.5 14.5c1 1.5 2 2.5 3.5 2.5s2.5-1 3.5-2.5c4.5-6.5 10.5-14.5 10.5-14.5s6 8 10.5 14.5c1 1.5 2 2.5 3.5 2.5s2.5-1 3.5-2.5C88 14 94 6 94 6s-6 8-10.5 14.5c-1 1.5-2 2.5-3.5 2.5s-2.5-1-3.5-2.5z" />
      </svg>
    ),
    meta: (
      <svg viewBox="0 0 80 20" className="h-5 w-auto fill-current">
        <text x="0" y="16" fontSize="18" fontWeight="700" fontFamily="system-ui">Meta</text>
      </svg>
    ),
    samsung: (
      <svg viewBox="0 0 100 20" className="h-5 w-auto fill-current">
        <text x="0" y="16" fontSize="14" fontWeight="700" fontFamily="system-ui">SAMSUNG</text>
      </svg>
    ),
    shopify: (
      <svg viewBox="0 0 90 24" className="h-6 w-auto fill-current">
        <text x="0" y="18" fontSize="16" fontWeight="700" fontFamily="system-ui">shopify</text>
      </svg>
    ),
    dropbox: (
      <svg viewBox="0 0 100 20" className="h-5 w-auto fill-current">
        <text x="0" y="16" fontSize="16" fontWeight="700" fontFamily="system-ui">Dropbox</text>
      </svg>
    ),
    okta: (
      <svg viewBox="0 0 60 24" className="h-6 w-auto fill-current">
        <text x="0" y="18" fontSize="18" fontWeight="700" fontFamily="system-ui">okta</text>
      </svg>
    ),
    mastercard: (
      <svg viewBox="0 0 120 32" className="h-8 w-auto">
        <circle cx="40" cy="16" r="14" fill="currentColor" opacity="0.8" />
        <circle cx="56" cy="16" r="14" fill="currentColor" opacity="0.6" />
      </svg>
    ),
  };
  return icons[name] ?? null;
}

export default function LogoMarquee() {
  const logos = [...MARQUEE_LOGOS, ...MARQUEE_LOGOS];

  return (
    <section className="border-y border-white/5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-white/40">
          Trusted by 3M+ businesses
        </p>
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />
          <div className="flex animate-marquee gap-16 whitespace-nowrap">
            {logos.map((logo, i) => (
              <div
                key={`${logo.name}-${i}`}
                className="flex shrink-0 items-center text-white/30 transition-colors duration-300 hover:text-white/80"
              >
                <LogoIcon name={logo.svg} />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
