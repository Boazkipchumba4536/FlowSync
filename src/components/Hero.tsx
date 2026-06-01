"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, CheckCircle2, Play } from "lucide-react";
import { HERO_COUNTER_TARGET, TRUST_BADGES } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";
import { LiveCounter } from "./AnimatedCounter";
import NodeGraph from "./NodeGraph";

const words = ["Your", "tools.", "Your", "rules.", "Any", "AI."];

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-24">
      {/* Dot matrix background */}
      <div className="pointer-events-none absolute inset-0 bg-dot-pattern bg-dots opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-deep-purple/40 via-transparent to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <div>
            <motion.h1
              className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]"
              initial="hidden"
              animate="visible"
            >
              {words.map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  className="mr-[0.2em] inline-block"
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                >
                  {word.endsWith(".") ? (
                    <>
                      {word.slice(0, -1)}
                      <span className="text-accent">.</span>
                    </>
                  ) : (
                    word
                  )}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              className="mt-6 max-w-xl text-lg text-white/60 sm:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Connect 9,000+ apps with governed AI workflows — built for teams that ship fast.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.6 }}
            >
              <Link
                href={ROUTES.signup}
                className="cta-glow rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-accent-hover"
              >
                Start free
              </Link>
              <Link
                href={ROUTES.product("workflows")}
                className="group flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:border-accent/50 hover:bg-white/5"
              >
                <Play className="h-4 w-4 text-accent" />
                See how it works
              </Link>
            </motion.div>

            <motion.div
              className="mt-8 flex flex-wrap gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              {TRUST_BADGES.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60"
                >
                  {badge.icon === "shield" ? (
                    <Shield className="h-3.5 w-3.5 text-accent" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  )}
                  {badge.label}
                </div>
              ))}
            </motion.div>

            <motion.div
              className="mt-10 rounded-xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <p className="text-sm text-white/50">
                <LiveCounter target={HERO_COUNTER_TARGET} className="font-display text-2xl font-bold text-accent sm:text-3xl" />
                <span className="ml-2 text-white/70">AI tasks automated and counting</span>
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
              <NodeGraph />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
