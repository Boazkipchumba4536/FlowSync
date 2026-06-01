"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-center font-display text-3xl font-bold text-white sm:text-4xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Loved by teams that{" "}
          <span className="text-accent">ship fast</span>
        </motion.h2>

        <div className="mt-12 flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.company}
              className={`relative min-w-[300px] shrink-0 snap-center rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md md:min-w-0 ${
                t.glow === "orange"
                  ? "hover:shadow-[0_0_40px_rgba(255,90,31,0.15)]"
                  : "hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]"
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
            >
              <div
                className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl ${
                  t.glow === "orange" ? "bg-accent/10" : "bg-purple-600/10"
                }`}
              />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 font-display text-lg font-bold text-accent">
                    {t.logo}
                  </div>
                  <span className="font-display font-semibold text-white">{t.company}</span>
                </div>
                <Quote className="mt-4 h-6 w-6 text-accent/40" />
                <p className="mt-2 text-sm leading-relaxed text-white/70">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 border-t border-white/10 pt-4">
                  <p className="text-sm font-medium text-white">{t.author}</p>
                  <p className="text-xs text-white/40">{t.role}</p>
                </div>
                <div className="mt-4 flex gap-4">
                  {t.metrics.map((metric) => (
                    <div
                      key={metric}
                      className="rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-medium text-accent"
                    >
                      {metric}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
