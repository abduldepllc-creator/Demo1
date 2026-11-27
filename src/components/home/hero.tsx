"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, BadgeCheck, Star, Truck } from "lucide-react";
import { useRef } from "react";
import { siteConfig } from "@/config/site";
import { Bubbles } from "@/components/shared/bubbles";
import { SoapBlock } from "@/components/shared/soap-block";
import { PakistanFlag } from "@/components/shared/icons";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE },
});

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-navy pt-32 pb-36 sm:pt-40 lg:pt-44 lg:pb-48">
      {/* Background layers */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(55%_70%_at_85%_15%,rgba(41,157,54,0.45),transparent_60%),radial-gradient(45%_60%_at_5%_90%,rgba(56,120,220,0.35),transparent_60%),linear-gradient(180deg,#0d2c50_0%,#0a2341_100%)]" />
      <div className="grid-pattern absolute inset-0 -z-10" />
      <Bubbles className="-z-10" />

      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        {/* Copy */}
        <motion.div style={{ y: textY }} className="text-center lg:text-left">
          <motion.p
            {...fadeUp(0.1)}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1.5 pr-4 pl-1.5 text-xs font-semibold text-white/85 backdrop-blur sm:text-sm"
          >
            <span className="flex items-center gap-1.5 rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold text-white">
              <PakistanFlag className="h-3 w-auto" /> PK
            </span>
            Pakistan&apos;s trusted soap base supplier
          </motion.p>

          <motion.h1
            {...fadeUp(0.2)}
            className="mt-6 text-[2.6rem] leading-[1.05] font-extrabold tracking-tight text-white sm:text-6xl lg:text-[4.2rem] xl:text-7xl"
          >
            Premium Raw <br className="hidden sm:block" />
            Soap Base, <span className="text-gradient">in Bulk.</span>
          </motion.h1>

          <motion.p {...fadeUp(0.35)} className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg lg:mx-0">
            Factory-direct melt &amp; pour soap bases for soap makers, cosmetic brands and resellers. Consistent
            quality, wholesale pricing and fast nationwide dispatch.
          </motion.p>

          <motion.div {...fadeUp(0.5)} className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Link href="/products" className="btn btn-primary group !px-7 !py-4 text-base">
              Explore Products
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/contact" className="btn btn-ghost-light !px-7 !py-4 text-base">
              Get a Bulk Quote
            </Link>
          </motion.div>

          <motion.ul
            {...fadeUp(0.65)}
            className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-semibold text-white/80 lg:justify-start"
          >
            {siteConfig.positioning.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <BadgeCheck className="size-5 text-brand-400" />
                {p}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Visual */}
        <motion.div style={{ y: visualY }} className="relative mx-auto w-full max-w-[540px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
            className="relative aspect-square"
          >
            {/* Rings */}
            <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.02)_60%,transparent_70%)]" />
            <div className="animate-spin-slow absolute inset-[2%] rounded-full border-2 border-dashed border-white/15" />
            <div className="absolute inset-[14%] rounded-full border border-white/10" />
            <div className="animate-spin-slow absolute inset-[2%] [animation-direction:reverse] [animation-duration:18s]">
              <span className="absolute top-1/2 -left-1.5 size-3 rounded-full bg-brand-400 shadow-[0_0_20px_4px_rgba(76,194,90,0.7)]" />
              <span className="absolute -top-1 left-1/2 size-2 rounded-full bg-white/80" />
            </div>

            {/* Logo mark */}
            <div className="animate-float absolute inset-[16%] grid place-items-center">
              <Image
                src="/images/logo-mark.png"
                alt="SoapBase transparent and milky soap base blocks"
                width={478}
                height={555}
                priority
                className="h-full w-auto drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]"
              />
            </div>
          </motion.div>

          {/* Floating cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.8, ease: EASE }}
            className="absolute top-[8%] -left-2 sm:-left-8"
          >
            <div className="animate-float-slow flex items-center gap-3 rounded-2xl border border-white/60 bg-white/95 p-2.5 pr-4 shadow-lift backdrop-blur sm:p-3 sm:pr-5">
              <span className="grid size-11 place-items-center rounded-xl bg-[#e6f6fa] sm:size-12">
                <SoapBlock color="#cfeef5" translucent stamp={false} shadow={false} className="w-9 sm:w-10" />
              </span>
              <span>
                <span className="block text-xs font-extrabold text-navy sm:text-sm">Crystal Clear</span>
                <span className="block text-[11px] text-muted sm:text-xs">Transparent base</span>
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 1, ease: EASE }}
            className="absolute top-[38%] -right-2 hidden sm:-right-6 sm:block"
          >
            <div className="animate-float flex items-center gap-3 rounded-2xl border border-white/60 bg-white/95 p-3 pr-5 shadow-lift backdrop-blur [animation-delay:1.5s]">
              <span className="grid size-12 place-items-center rounded-xl bg-amber-50">
                <Star className="size-6 fill-amber-400 text-amber-400" />
              </span>
              <span>
                <span className="block text-sm font-extrabold text-navy">4.9 / 5 rating</span>
                <span className="block text-xs text-muted">850+ business clients</span>
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.2, ease: EASE }}
            className="absolute bottom-[4%] left-[6%] sm:left-[10%]"
          >
            <div className="animate-float-slow flex items-center gap-3 rounded-2xl bg-brand p-2.5 pr-4 text-white shadow-glow [animation-delay:3s] sm:p-3 sm:pr-5">
              <span className="grid size-11 place-items-center rounded-xl bg-white/15 sm:size-12">
                <Truck className="size-5 sm:size-6" />
              </span>
              <span>
                <span className="block text-xs font-extrabold sm:text-sm">MOQ from 20 kg</span>
                <span className="block text-[11px] text-white/80 sm:text-xs">Dispatch in 48–72 hrs</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Wave */}
      <svg
        className="absolute -bottom-px left-0 h-16 w-full text-white sm:h-24"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path fill="currentColor" fillOpacity="0.25" d="M0 120V60c200-50 420-60 720-20s560 40 720-10v90H0Z" />
        <path fill="currentColor" d="M0 120V80c240-40 480-50 720-15s480 40 720 0v55H0Z" />
      </svg>
    </section>
  );
}
