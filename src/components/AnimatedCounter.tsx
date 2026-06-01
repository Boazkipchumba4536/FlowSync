"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  className?: string;
  format?: (n: number) => string;
}

export default function AnimatedCounter({
  target,
  duration = 2000,
  className = "",
  format = (n) => n.toLocaleString(),
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
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
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref} className={className}>
      {format(count)}
    </span>
  );
}

export function LiveCounter({
  target,
  className = "",
}: {
  target: number;
  className?: string;
}) {
  const [count, setCount] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const duration = 3000;
    const animate = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
      else setCount(target);
    };
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [target]);

  return (
    <span className={className}>{count.toLocaleString()}</span>
  );
}

export function StatCounter({
  value,
  suffix = "",
  multiplier = 1,
  duration = 2500,
}: {
  value: number;
  suffix?: string;
  multiplier?: number;
  duration?: number;
}) {
  const displayTarget = multiplier > 1 ? value : value;
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
            setCount(Math.floor(eased * displayTarget));
            if (progress < 1) requestAnimationFrame(animate);
            else setCount(displayTarget);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [displayTarget, duration]);

  const formatted =
    multiplier === 1_000_000
      ? `${count}M`
      : multiplier === 1000
        ? `${count}K`
        : count.toLocaleString();

  return (
    <div ref={ref} className="font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
      {formatted}
      <span className="text-accent">{suffix.replace(/[0-9MK]/g, "") || (suffix.includes("+") ? "+" : suffix)}</span>
    </div>
  );
}
