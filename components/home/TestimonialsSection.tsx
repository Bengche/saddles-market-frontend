'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Dressage competitor, 12 years',
    quote: "The Hanoverian Dressage saddle I purchased has completely transformed my riding. The craftsmanship is extraordinary — every stitch, every panel speaks to quality. My horse moved in a way I hadn't seen before.",
    rating: 5,
    location: 'Lexington, KY',
    initials: 'SM',
  },
  {
    name: 'James Crawford',
    role: 'Ranch owner, 25 years',
    quote: "I've bought saddles from everywhere, and nothing compares to the value and quality here. Their 30-day trial took all the risk out of it. The Western saddle fits both me and my quarter horse perfectly.",
    rating: 5,
    location: 'Fort Worth, TX',
    initials: 'JC',
  },
  {
    name: 'Emily Rhodes',
    role: 'Show jumping trainer',
    quote: "Ordered a jumping saddle for one of my students and the process was seamless. Communication was excellent, delivery was fast, and the saddle exceeded expectations. Highly recommend.",
    rating: 5,
    location: 'Ocala, FL',
    initials: 'ER',
  },
  {
    name: 'Michael Torres',
    role: 'Trail riding enthusiast',
    quote: "After years of discomfort on long rides, this trail saddle has been a revelation. The weight distribution is perfect. I can ride for 8+ hours with no issues. Worth every penny.",
    rating: 5,
    location: 'Santa Fe, NM',
    initials: 'MT',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-primary-500 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%"><pattern id="p" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M0 20h40M20 0v40" stroke="white" strokeWidth="0.5"/></pattern><rect width="100%" height="100%" fill="url(#p)"/></svg>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-14">
          <p className="text-gold-400 text-sm font-medium tracking-widest uppercase mb-3">What Riders Say</p>
          <h2 className="font-serif text-4xl font-bold text-white mb-4">Real Experiences, Real Riders</h2>
          <p className="text-white/65 max-w-lg mx-auto">
            Over a thousand riders trust Saddles Market for their most important equipment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-7 relative"
            >
              <Quote size={32} className="text-gold-400 mb-5 opacity-80" />
              <p className="text-white/85 text-base leading-relaxed mb-6 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gold-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {t.initials}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-white/55 text-xs">{t.role} — {t.location}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="fill-gold-400 text-gold-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
