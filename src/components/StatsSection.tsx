"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { STATS } from "@/lib/constants";

function useCountUp(
  target: number,
  suffix: string,
  multiplier: number = 1,
  duration = 2500
) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
            else setCount(target);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  let display: string;
  if (multiplier === 1_000_000) {
    display = `${count}M+`;
  } else if (multiplier === 1000) {
    display = `${count}K+`;
  } else {
    display = `${count.toLocaleString()}${suffix}`;
  }

  return { ref, display };
}

export default function StatsSection() {
  return (
    <section className="bg-gradient-to-b from-deep-purple/30 to-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12">
          {STATS.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({
  stat,
  index,
}: {
  stat: (typeof STATS)[number];
  index: number;
}) {
  const multiplier = "multiplier" in stat ? stat.multiplier : 1;
  const { ref, display } = useCountUp(stat.value, stat.suffix, multiplier);

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <div className="font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl">
        {display}
      </div>
      <p className="mt-2 text-sm text-white/50 sm:text-base">{stat.label}</p>
    </motion.div>
  );
}
