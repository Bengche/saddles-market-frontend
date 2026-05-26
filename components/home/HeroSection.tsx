"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShoppingBag, Award, ChevronDown } from "lucide-react";

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden bg-primary-900"
    >
      {/* Parallax background */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <Image
          src="https://media.istockphoto.com/id/184942536/photo/english-saddle.webp?a=1&b=1&s=612x612&w=0&k=20&c=gP0imBeFkc7bPxrvPyRndTmN-3O5_uYutW2dFX8DDh0="
          alt="Premium horse saddle in use"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 via-primary-900/60 to-primary-900/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary-900/50" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative container-custom py-32 pt-44 z-10"
        style={{ opacity }}
      >
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="h-px w-12 bg-gold-400" />
            <span className="text-gold-400 text-sm font-medium tracking-widest uppercase">
              Premium Equestrian
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            Saddles Crafted{" "}
            <span className="text-gradient-gold italic">for Excellence</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-white/75 text-lg md:text-xl leading-relaxed mb-10 max-w-lg"
          >
            Discover our curated collection of premium horse saddles — from
            Western to Dressage, handpicked for quality, comfort, and
            performance.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.7 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/products"
              className="btn-gold text-base px-8 py-4 shadow-gold"
            >
              <ShoppingBag size={20} />
              Shop Now
            </Link>
            <Link
              href="/about"
              className="btn-outline text-white border-white/50 hover:bg-white/10 text-base px-8 py-4"
            >
              <Award size={20} />
              Our Story
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-wrap items-center gap-6 mt-12 pt-10 border-t border-white/15"
          >
            {[
              { value: "500+", label: "Saddles in Stock" },
              { value: "30-Day", label: "Free Trial" },
              { value: "4.9/5", label: "Customer Rating" },
              { value: "Free", label: "Shipping $500+" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-white font-bold text-lg leading-none">
                  {stat.value}
                </p>
                <p className="text-white/55 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 z-10"
      >
        <ChevronDown size={28} />
      </motion.div>
    </section>
  );
}
