"use client";



import { useEffect, useState } from "react";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";

import { Zap } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

import { NAV_LINKS } from "@/lib/constants";

import { ROUTES } from "@/lib/routes";



export default function Navbar() {

  const [scrolled, setScrolled] = useState(false);

  const [visible, setVisible] = useState(true);

  const [lastScrollY, setLastScrollY] = useState(0);

  const [mobileOpen, setMobileOpen] = useState(false);

  const { session } = useAuth();

  const pathname = usePathname();

  const isHome = pathname === ROUTES.home;



  useEffect(() => {

    const handleScroll = () => {

      const currentY = window.scrollY;

      setScrolled(currentY > 20);

      if (currentY < 80) {

        setVisible(true);

      } else if (currentY > lastScrollY) {

        setVisible(false);

      } else {

        setVisible(true);

      }

      setLastScrollY(currentY);

    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);

  }, [lastScrollY]);



  useEffect(() => {

    setMobileOpen(false);

  }, [pathname]);



  useEffect(() => {

    const handleEscape = (e: KeyboardEvent) => {

      if (e.key === "Escape") setMobileOpen(false);

    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);

  }, []);



  return (

    <AnimatePresence>

      <motion.header

        initial={{ y: 0 }}

        animate={{ y: visible ? 0 : -100 }}

        transition={{ duration: 0.3, ease: "easeInOut" }}

        className={`fixed left-0 right-0 top-0 z-50 transition-colors duration-300 ${

          scrolled || !isHome

            ? "border-b border-white/10 bg-background/80 backdrop-blur-xl"

            : "bg-transparent"

        }`}

      >

        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          <Link href={ROUTES.home} className="flex items-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20">

              <Zap className="h-5 w-5 text-accent" fill="currentColor" />

            </div>

            <span className="font-display text-xl font-bold text-white">FlowSync</span>

          </Link>



          <div className="hidden items-center gap-8 md:flex">

            {NAV_LINKS.map((link) => (

              <Link

                key={link.label}

                href={link.href}

                className="text-sm text-white/70 transition-colors hover:text-white"

              >

                {link.label}

              </Link>

            ))}

          </div>



          <div className="hidden items-center gap-4 md:flex">

            {session ? (

              <Link

                href={ROUTES.dashboard}

                className="cta-glow rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-accent-hover"

              >

                Dashboard

              </Link>

            ) : (

              <>

                <Link href={ROUTES.login} className="text-sm text-white/70 transition-colors hover:text-white">

                  Sign in

                </Link>

                <Link

                  href={ROUTES.signup}

                  className="cta-glow rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-accent-hover"

                >

                  Start free

                </Link>

              </>

            )}

          </div>



          <button

            type="button"

            className="flex flex-col gap-1.5 md:hidden"

            onClick={() => setMobileOpen(!mobileOpen)}

            aria-label="Toggle menu"

          >

            <span className={`block h-0.5 w-6 bg-white transition-transform ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />

            <span className={`block h-0.5 w-6 bg-white transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />

            <span className={`block h-0.5 w-6 bg-white transition-transform ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />

          </button>

        </nav>



        {mobileOpen && (

          <motion.div

            initial={{ opacity: 0, height: 0 }}

            animate={{ opacity: 1, height: "auto" }}

            className="border-t border-white/10 bg-background/95 backdrop-blur-xl md:hidden"

          >

            <div className="flex flex-col gap-4 px-4 py-6">

              {NAV_LINKS.map((link) => (

                <Link

                  key={link.label}

                  href={link.href}

                  className="text-white/70 hover:text-white"

                  onClick={() => setMobileOpen(false)}

                >

                  {link.label}

                </Link>

              ))}

              {session ? (

                <Link href={ROUTES.dashboard} className="rounded-full bg-accent px-5 py-2.5 text-center text-sm font-semibold text-white">

                  Dashboard

                </Link>

              ) : (

                <>

                  <Link href={ROUTES.login} className="text-white/70 hover:text-white">

                    Sign in

                  </Link>

                  <Link href={ROUTES.signup} className="rounded-full bg-accent px-5 py-2.5 text-center text-sm font-semibold text-white">

                    Start free

                  </Link>

                </>

              )}

            </div>

          </motion.div>

        )}

      </motion.header>

    </AnimatePresence>

  );

}


