"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Users, Eye } from "lucide-react";
import { GOVERNANCE_PILLARS } from "@/lib/constants";

const iconMap = {
  shield: Shield,
  users: Users,
  eye: Eye,
} as const;

function PillarColumn({
  pillar,
  index,
}: {
  pillar: (typeof GOVERNANCE_PILLARS)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const Icon = iconMap[pillar.icon as keyof typeof iconMap] ?? Shield;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setRevealed(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
    >
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${
          index % 2 === 0
            ? "from-accent/5 to-transparent"
            : "from-purple-600/5 to-transparent"
        }`}
      />
      <div className="relative">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-accent/10">
          <Icon className="h-6 w-6 text-accent" />
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-white">{pillar.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/50">{pillar.description}</p>
        <ul className="mt-6 space-y-3">
          {pillar.features.map((feature, i) => (
            <motion.li
              key={feature}
              className="flex items-center gap-2 text-sm text-white/70"
              initial={{ opacity: 0, x: -10 }}
              animate={revealed ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.1 + 0.2 }}
            >
              <div className="h-1.5 w-1.5 rounded-full bg-accent" />
              {feature}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function GovernanceSection() {
  return (
    <section id="solutions" className="bg-gradient-to-b from-background via-deep-purple/20 to-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Automation you can{" "}
            <span className="text-accent">govern</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/50">
            Scale AI across your organization with confidence — control, delegation, and visibility built in.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {GOVERNANCE_PILLARS.map((pillar, i) => (
            <PillarColumn key={pillar.title} pillar={pillar} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
