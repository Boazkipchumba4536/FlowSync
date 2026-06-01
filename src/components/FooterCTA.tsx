"use client";



import { useEffect, useRef } from "react";

import Link from "next/link";

import { motion } from "framer-motion";

import { ROUTES } from "@/lib/routes";



function ParticleBackground() {

  const canvasRef = useRef<HTMLCanvasElement>(null);



  useEffect(() => {

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;



    let animationId: number;

    const particles: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];



    const resize = () => {

      const dpr = window.devicePixelRatio;

      canvas.width = canvas.offsetWidth * dpr;

      canvas.height = canvas.offsetHeight * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    };



    const init = () => {

      particles.length = 0;

      for (let i = 0; i < 60; i++) {

        particles.push({

          x: Math.random() * canvas.offsetWidth,

          y: Math.random() * canvas.offsetHeight,

          size: Math.random() * 2 + 0.5,

          speed: Math.random() * 0.3 + 0.1,

          opacity: Math.random() * 0.5 + 0.2,

        });

      }

    };



    const draw = () => {

      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particles.forEach((p) => {

        p.y -= p.speed;

        if (p.y < 0) {

          p.y = canvas.offsetHeight;

          p.x = Math.random() * canvas.offsetWidth;

        }

        ctx.beginPath();

        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(255, 90, 31, ${p.opacity})`;

        ctx.fill();

      });

      animationId = requestAnimationFrame(draw);

    };



    const handleResize = () => {

      resize();

      init();

    };



    resize();

    init();

    draw();

    window.addEventListener("resize", handleResize);



    return () => {

      cancelAnimationFrame(animationId);

      window.removeEventListener("resize", handleResize);

    };

  }, []);



  return (

    <canvas

      ref={canvasRef}

      className="pointer-events-none absolute inset-0 h-full w-full opacity-60"

      aria-hidden

    />

  );

}



export default function FooterCTA() {

  return (

    <section className="relative overflow-hidden py-32">

      <div className="absolute inset-0 bg-gradient-to-b from-deep-purple/40 to-background" />

      <ParticleBackground />



      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">

        <motion.h2

          className="font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl"

          initial={{ opacity: 0, y: 30 }}

          whileInView={{ opacity: 1, y: 0 }}

          viewport={{ once: true }}

        >

          Go from AI experiments to{" "}

          <span className="text-accent">real results</span>

        </motion.h2>



        <motion.div

          className="mt-10 flex flex-wrap justify-center gap-4"

          initial={{ opacity: 0, y: 20 }}

          whileInView={{ opacity: 1, y: 0 }}

          viewport={{ once: true }}

          transition={{ delay: 0.2 }}

        >

          <Link

            href={ROUTES.signup}

            className="cta-glow rounded-full bg-accent px-8 py-4 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-accent-hover"

          >

            Start free

          </Link>

          <Link

            href={ROUTES.contactSales}

            className="rounded-full border border-white/20 px-8 py-4 text-sm font-semibold text-white transition-all hover:border-accent/50 hover:bg-white/5"

          >

            Talk to sales

          </Link>

        </motion.div>

      </div>

    </section>

  );

}


