"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, User, ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const err = await signUp(name, email, password);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      router.push(ROUTES.dashboard);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-dot-pattern bg-dots opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-deep-purple/40 to-background" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <Link href={ROUTES.home} className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
            <Zap className="h-5 w-5 text-accent" fill="currentColor" />
          </div>
          <span className="font-display text-2xl font-bold">FlowSync</span>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md">
          <h1 className="font-display text-2xl font-bold">Start for free</h1>
          <p className="mt-1 text-sm text-white/50">No credit card required</p>

          <ul className="mt-4 space-y-2">
            {["100 tasks/month free", "5 active workflows", "9,000+ app integrations"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-white/60">
                <Check className="h-3.5 w-3.5 text-accent" />
                {item}
              </li>
            ))}
          </ul>

          {error && (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-white/70">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-accent/50"
                  placeholder="Jane Smith"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-white/70">Work email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-accent/50"
                  placeholder="you@company.com"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-white/70">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-accent/50"
                  placeholder="Min. 6 characters"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="cta-glow flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-semibold text-white transition-all hover:bg-accent-hover disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create free account"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-white/40">
            By signing up, you agree to our{" "}
            <Link href={ROUTES.legal("terms")} className="text-white/60 hover:text-white">
              Terms
            </Link>{" "}
            and{" "}
            <Link href={ROUTES.legal("privacy")} className="text-white/60 hover:text-white">
              Privacy Policy
            </Link>
          </p>

          <p className="mt-4 text-center text-sm text-white/50">
            Already have an account?{" "}
            <Link href={ROUTES.login} className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
