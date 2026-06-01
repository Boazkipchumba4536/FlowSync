"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ROUTES } from "@/lib/routes";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export function PageHero({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <section className="relative overflow-hidden pt-32 pb-16">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-deep-purple/30 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {badge && (
          <span className="mb-4 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1 text-xs font-medium text-accent">
            {badge}
          </span>
        )}
        <h1 className="font-display text-4xl font-bold text-white sm:text-5xl md:text-6xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-white/60">{subtitle}</p>}
      </div>
    </section>
  );
}

export function LogoLink({ className = "" }: { className?: string }) {
  return (
    <Link href={ROUTES.home} className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20">
        <Zap className="h-5 w-5 text-accent" fill="currentColor" />
      </div>
      <span className="font-display text-xl font-bold text-white">FlowSync</span>
    </Link>
  );
}
