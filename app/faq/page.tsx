import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';
import FaqClient, { FAQ_DATA } from './FaqClient';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Find answers to common questions about saddle selection, our 30-day free trial, shipping, returns, and fitting at Saddles Market.',
  alternates: { canonical: '/faq' },
};

export default function FaqPage() {
  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="bg-primary-800 py-20 text-center">
        <p className="text-gold-400 text-sm font-medium tracking-widest uppercase mb-3">Help Center</p>
        <h1 className="font-serif text-5xl font-bold text-white mb-4">Frequently Asked Questions</h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto">Can't find your answer? Email us at <a href={`mailto:${SITE_CONFIG.email.support}`} className="text-gold-400 hover:underline">{SITE_CONFIG.email.support}</a></p>
      </div>

      <div className="container-custom py-16 max-w-4xl">
        <FaqClient data={FAQ_DATA} />
      </div>
    </div>
  );
}
