"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import {
  Shield,
  RotateCcw,
  Truck,
  Award,
  MessageSquare,
  Zap,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Shield,
    title: "30-Day Free Trial",
    description:
      "Ride with your new saddle for 30 days. If it's not right for you or your horse, return it for a full refund — no questions asked.",
    color: "text-primary-500",
    bg: "bg-primary-50",
  },
  {
    icon: Award,
    title: "Expert Curation",
    description:
      "Every saddle in our collection is hand-selected by our team of experienced equestrians. We only carry what we would use ourselves.",
    color: "text-gold-500",
    bg: "bg-gold-50",
  },
  {
    icon: Truck,
    title: `Free Shipping Over $${require("@/lib/siteConfig").SITE_CONFIG.shipping.freeShippingThreshold}`,
    description: `Orders over $${require("@/lib/siteConfig").SITE_CONFIG.shipping.freeShippingThreshold} ship free anywhere in the United States. Express shipping available on all orders at checkout.`,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: RotateCcw,
    title: "Hassle-Free Returns",
    description:
      "Our return process is simple and rider-friendly. We understand that saddle fit can be complex, so we make returns easy.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: MessageSquare,
    title: "Expert Saddle Fitting",
    description:
      "Not sure what saddle is right? Our equestrian specialists are available via phone and chat to guide your decision.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Zap,
    title: "Fast, Secure Checkout",
    description:
      "Multiple payment options, SSL-encrypted checkout, and real-time order tracking from warehouse to your barn.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 2000, bounce: 0 });

  useEffect(() => {
    if (inView) motionValue.set(to);
  }, [inView, to, motionValue]);

  useEffect(
    () =>
      spring.on("change", (v) => {
        if (ref.current)
          ref.current.textContent = Math.round(v).toLocaleString() + suffix;
      }),
    [spring, suffix],
  );

  return <span ref={ref}>0{suffix}</span>;
}

export default function WhyChooseUsSection() {
  return (
    <section className="py-24 bg-cream-100">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gold-500 text-sm font-medium tracking-widest uppercase mb-3">
            Why Saddles Market
          </p>
          <h2 className="section-heading section-heading-center font-bold text-primary-500 inline-block pb-4">
            The Equestrian Standard
          </h2>
          <p className="text-gray-500 mt-6 max-w-2xl mx-auto text-base leading-relaxed">
            We&apos;ve built our business on a simple principle: equestrians
            deserve a saddle buying experience as refined as the sport itself.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl p-7 shadow-card hover:shadow-card-hover transition-shadow duration-300 group"
            >
              <div
                className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon size={22} className={feature.color} />
              </div>
              <h3 className="font-serif text-lg font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats banner */}
        <div className="bg-primary-500 rounded-3xl p-10 md:p-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              {
                value: 1200,
                suffix: "+",
                label: "Happy Riders",
                sub: "and counting",
              },
              {
                value: 500,
                suffix: "+",
                label: "Saddles in Stock",
                sub: "all disciplines",
              },
              {
                value: 30,
                suffix: "-Day",
                label: "Free Trial",
                sub: "no risk",
              },
              {
                value: 98,
                suffix: "%",
                label: "Satisfaction Rate",
                sub: "from verified buyers",
              },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-serif text-4xl md:text-5xl font-bold text-white mb-1">
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-white font-semibold text-sm mb-1">
                  {stat.label}
                </p>
                <p className="text-white/50 text-xs">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/why-us" className="btn-secondary px-8 py-3">
            Learn More About Us
          </Link>
        </div>
      </div>
    </section>
  );
}
