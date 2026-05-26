import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/siteConfig';
import { Shield, Repeat, Truck, Star, UserCheck, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Why Choose Saddles Market',
  description: 'Discover why thousands of riders trust Saddles Market for premium horse saddles — 30-day free trial, expert curation, free shipping, and unmatched support.',
  alternates: { canonical: '/why-us' },
};

const pillars = [
  {
    icon: Shield,
    title: '30-Day Free Trial',
    desc: `We're the only saddle retailer offering a genuine 30-day free trial on every purchase. Ride at home, at your barn, on the trail. If it's not the perfect fit, return it — no fee, no argument. This exists because we believe confidence should come before commitment.`,
    stat: '30 days',
    statLabel: 'risk-free trial',
  },
  {
    icon: Award,
    title: 'Expert-Curated Selection',
    desc: "Every saddle in our collection has been vetted by our team of working equestrians. We don't list every saddle we're offered — we list the ones we'd actually ride in. Quality, not quantity.",
    stat: '500+',
    statLabel: 'curated saddles',
  },
  {
    icon: Truck,
    title: `Free Shipping Over $${SITE_CONFIG.shipping.freeShippingThreshold}`,
    desc: `Premium saddles deserve white-glove delivery. Orders over $${SITE_CONFIG.shipping.freeShippingThreshold} ship free. Express delivery available. Every shipment is fully insured and tracked end-to-end.`,
    stat: 'Free',
    statLabel: `over $${SITE_CONFIG.shipping.freeShippingThreshold}`,
  },
  {
    icon: Repeat,
    title: 'Hassle-Free Returns',
    desc: 'Changed your mind? Saddle doesn\'t fit? Contact us within the trial window and we\'ll send a prepaid return label same day. Refunds are processed within 3–5 business days. No restocking fees, ever.',
    stat: '100%',
    statLabel: 'free returns',
  },
  {
    icon: UserCheck,
    title: 'Real Expert Guidance',
    desc: `Our customer support team are active equestrians — not call-center agents reading scripts. When you ask about tree width or panel fit, you get a real answer from someone who rides. Reach us at ${SITE_CONFIG.phone} or via WhatsApp at ${SITE_CONFIG.whatsapp}.`,
    stat: '< 24h',
    statLabel: 'response time',
  },
  {
    icon: Star,
    title: '98% Satisfaction Rate',
    desc: 'Over 1,200 riders have found their perfect saddle with us. Our satisfaction rate isn\'t a marketing number — it\'s the result of a selection process, a trial policy, and a team that genuinely cares.',
    stat: '98%',
    statLabel: 'satisfaction rate',
  },
];

const comparisons = [
  { label: '30-day free trial', us: true, others: false },
  { label: 'Expert equestrian support', us: true, others: false },
  { label: `Free shipping over $${SITE_CONFIG.shipping.freeShippingThreshold}`, us: true, others: false },
  { label: 'No restocking fees', us: true, others: false },
  { label: 'Curated, tested selection', us: true, others: false },
  { label: 'Same-day return labels', us: true, others: false },
];

export default function WhyUsPage() {
  return (
    <div className="bg-cream-100">
      {/* Hero */}
      <div className="relative bg-primary-900 py-28 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1553284965-5dd67897f9a5?w=1600&q=80"
          alt="Equestrian riding"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/80 to-primary-900/50" />
        <div className="container-custom relative z-10 text-center">
          <p className="text-gold-400 text-sm font-medium tracking-widest uppercase mb-4">The Saddles Market Difference</p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-6 max-w-3xl mx-auto leading-tight">
            Why Thousands of Riders Choose Us
          </h1>
          <p className="text-white/60 text-xl max-w-2xl mx-auto">
            We built the saddle-buying experience we always wished existed — transparent, risk-free, and backed by real equestrians.
          </p>
        </div>
      </div>

      {/* Pillars */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="bg-white rounded-2xl shadow-card p-8 hover:shadow-luxury transition-shadow">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-5">
                  <pillar.icon size={26} className="text-primary-500" />
                </div>
                <h3 className="font-serif text-xl font-bold text-primary-500 mb-3">{pillar.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm mb-5">{pillar.desc}</p>
                <div className="border-t border-cream-200 pt-4 flex items-end gap-2">
                  <span className="font-serif text-3xl font-bold text-gold-500">{pillar.stat}</span>
                  <span className="text-xs text-gray-400 mb-1">{pillar.statLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-white">
        <div className="container-custom max-w-3xl">
          <h2 className="font-serif text-4xl font-bold text-primary-500 text-center mb-2">How We Compare</h2>
          <p className="text-gray-500 text-center mb-10">Saddles Market vs. typical online saddle stores</p>
          <div className="rounded-2xl border border-gray-100 shadow-card overflow-hidden">
            <div className="grid grid-cols-3 bg-primary-500 text-white px-6 py-3 text-sm font-medium">
              <span>Feature</span>
              <span className="text-center">Saddles Market</span>
              <span className="text-center">Others</span>
            </div>
            {comparisons.map((row, idx) => (
              <div key={row.label} className={`grid grid-cols-3 px-6 py-4 text-sm items-center ${idx % 2 === 0 ? 'bg-cream-50' : 'bg-white'}`}>
                <span className="text-gray-700">{row.label}</span>
                <span className="text-center text-green-600 font-bold text-lg">{row.us ? '✓' : '✗'}</span>
                <span className={`text-center font-bold text-lg ${row.others ? 'text-green-600' : 'text-red-400'}`}>{row.others ? '✓' : '✗'}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container-custom text-center">
          <h2 className="font-serif text-4xl font-bold text-primary-500 mb-4">Ready to Find Your Perfect Saddle?</h2>
          <p className="text-gray-500 text-lg mb-8">Browse over 500 saddles — all backed by our 30-day free trial.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-gold px-10 py-4 text-base">Shop Saddles</Link>
            <Link href="/contact" className="btn-secondary px-10 py-4 text-base">Talk to an Expert</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
