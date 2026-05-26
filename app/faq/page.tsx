import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';
import FaqClient from './FaqClient';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Find answers to common questions about saddle selection, our 30-day free trial, shipping, returns, and fitting at Saddles Market.',
  alternates: { canonical: '/faq' },
};

export interface FaqItem {
  question: string;
  answer: string;
}

export type FaqCategory = {
  label: string;
  items: FaqItem[];
};

export const FAQ_DATA: FaqCategory[] = [
  {
    label: 'Orders & Shipping',
    items: [
      {
        question: 'How long does shipping take?',
        answer: `Standard shipping takes 5–8 business days. Express shipping takes 1–3 business days. Orders over $${SITE_CONFIG.shipping.freeShippingThreshold} qualify for free standard shipping automatically.`,
      },
      {
        question: 'Do you ship internationally?',
        answer: 'We currently ship within the United States. International shipping is being added — sign up for our newsletter to be notified when it launches.',
      },
      {
        question: 'Can I track my order?',
        answer: 'Yes. Once your order ships, you will receive a tracking number by email. You can also view tracking from your Orders page in your account.',
      },
      {
        question: 'What happens if my saddle arrives damaged?',
        answer: `Contact us at ${SITE_CONFIG.email.support} within 48 hours of delivery with photos of the damage. We'll arrange a replacement or full refund at no cost to you.`,
      },
    ],
  },
  {
    label: '30-Day Free Trial',
    items: [
      {
        question: 'How does the 30-day free trial work?',
        answer: 'Every saddle you purchase comes with a 30-day free trial. Ride it at home or at your barn. If you\'re not completely satisfied within 30 days, return it for a full refund — no restocking fee, no questions asked.',
      },
      {
        question: 'When does my trial period start?',
        answer: 'Your 30-day trial starts on the date your order is delivered, not the date you order.',
      },
      {
        question: 'What condition does the saddle need to be in to return it?',
        answer: 'We expect normal trial wear — some saddle soap, light sweat marks. The saddle does not need to be returned in pristine condition. We simply ask that it isn\'t damaged through misuse.',
      },
    ],
  },
  {
    label: 'Saddle Selection & Fitting',
    items: [
      {
        question: 'How do I know which saddle fits my horse?',
        answer: 'The best way is to use our 30-day trial — try the saddle on your horse with the help of a qualified saddle fitter. We also recommend using a gullet gauge to measure your horse\'s withers. Our team can advise: email us photos of your horse\'s back and withers and we\'ll recommend options.',
      },
      {
        question: 'Can saddles be adjusted for fit?',
        answer: 'Many saddles can have their tree width and panel flocking adjusted by a qualified saddle fitter. We note adjustability on each product page.',
      },
      {
        question: 'What\'s the difference between Western, English, Dressage, and Jumping saddles?',
        answer: 'Western saddles have a horn and deep seat, designed for ranch work and trail riding. English saddles are lighter with no horn — they include dressage saddles (deep seat, long flap for leg position) and jumping saddles (forward-cut flap for two-point position). We carry all disciplines — browse by category.',
      },
    ],
  },
  {
    label: 'Returns & Refunds',
    items: [
      {
        question: 'How do I initiate a return?',
        answer: `Log into your account, go to Orders, and click "Return / Refund" on your order. Alternatively email ${SITE_CONFIG.email.support} with your order number. We'll send a prepaid return label within 1 business day.`,
      },
      {
        question: 'How long does a refund take?',
        answer: 'Once we receive your return, refunds are processed within 3–5 business days back to your original payment method.',
      },
      {
        question: 'Can I exchange a saddle instead of returning it?',
        answer: 'Yes. During your 30-day trial, you can exchange for a different saddle at no penalty. Contact us to arrange the exchange.',
      },
    ],
  },
  {
    label: 'Account & Payments',
    items: [
      {
        question: 'Do I need an account to purchase?',
        answer: 'You can browse without an account, but an account is required at checkout to track your order, manage returns, and use your 30-day trial.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit and debit cards (Visa, Mastercard, Amex), PayPal, and bank transfer.',
      },
      {
        question: 'Is my payment information secure?',
        answer: 'Yes. All transactions are SSL-encrypted. We do not store card numbers on our servers.',
      },
    ],
  },
];

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
