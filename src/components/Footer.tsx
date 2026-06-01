"use client";



import type { ComponentType } from "react";

import Link from "next/link";

import { motion } from "framer-motion";

import { Zap, Linkedin, Github, Youtube } from "lucide-react";

import { FOOTER_LINKS, SOCIAL_LINKS } from "@/lib/constants";

import { FOOTER_HREF_MAP, ROUTES } from "@/lib/routes";



function XIcon({ className }: { className?: string }) {

  return (

    <svg viewBox="0 0 24 24" className={className} fill="currentColor">

      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />

    </svg>

  );

}



const socialIcons: Record<string, ComponentType<{ className?: string }>> = {

  linkedin: Linkedin,

  x: XIcon,

  github: Github,

  youtube: Youtube,

};



export default function Footer() {

  return (

    <footer className="border-t border-white/10 bg-background">

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        <motion.div

          className="grid grid-cols-2 gap-8 md:grid-cols-4"

          initial={{ opacity: 0, y: 20 }}

          whileInView={{ opacity: 1, y: 0 }}

          viewport={{ once: true }}

        >

          {Object.entries(FOOTER_LINKS).map(([category, links]) => (

            <div key={category}>

              <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">

                {category}

              </h4>

              <ul className="mt-4 space-y-3">

                {links.map((link) => (

                  <li key={link}>

                    <Link

                      href={FOOTER_HREF_MAP[link] ?? ROUTES.home}

                      className="text-sm text-white/50 transition-colors hover:text-white"

                    >

                      {link}

                    </Link>

                  </li>

                ))}

              </ul>

            </div>

          ))}

        </motion.div>



        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">

          <Link href={ROUTES.home} className="flex items-center gap-2">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">

              <Zap className="h-4 w-4 text-accent" fill="currentColor" />

            </div>

            <span className="font-display text-lg font-bold text-white">FlowSync</span>

          </Link>



          <div className="flex gap-4">

            {SOCIAL_LINKS.map((social) => {

              const Icon = socialIcons[social.icon];

              return (

                <a

                  key={social.name}

                  href={social.href}

                  target="_blank"

                  rel="noopener noreferrer"

                  aria-label={social.name}

                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/50 transition-colors hover:border-accent/30 hover:text-accent"

                >

                  {Icon && <Icon className="h-4 w-4" />}

                </a>

              );

            })}

          </div>



          <p className="text-sm text-white/40">

            &copy; {new Date().getFullYear()} FlowSync. All rights reserved.

          </p>

        </div>

      </div>

    </footer>

  );

}


