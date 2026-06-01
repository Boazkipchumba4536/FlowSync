"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { PRODUCT_TABS } from "@/lib/constants";

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState<(typeof PRODUCT_TABS)[number]["id"]>(
    PRODUCT_TABS[0].id
  );
  const active = PRODUCT_TABS.find((t) => t.id === activeTab) ?? PRODUCT_TABS[0];

  return (
    <section id="products" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-center font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Meet your complete{" "}
          <span className="text-accent">AI toolkit</span>
        </motion.h2>

        <div className="mt-12 overflow-x-auto">
          <div className="relative flex min-w-max justify-center gap-1 border-b border-white/10 pb-px sm:gap-2">
            {PRODUCT_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3 py-3 text-sm font-medium transition-colors sm:px-5 ${
                  activeTab === tab.id ? "text-white" : "text-white/50 hover:text-white/80"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-12 grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
          >
            <div
              className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${active.gradient} p-1`}
            >
              <div className="rounded-xl bg-background/90 p-6 backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs text-white/40">{active.label}</span>
                </div>
                <div className="space-y-3">
                  {active.mockElements.map((el, i) => (
                    <motion.div
                      key={el}
                      className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/20 text-xs font-bold text-accent">
                        {i + 1}
                      </div>
                      <span className="text-sm text-white/80">{el}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
                {active.title}
              </h3>
              <ul className="mt-6 space-y-4">
                {active.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20">
                      <Check className="h-3 w-3 text-accent" />
                    </div>
                    <span className="text-white/70">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
