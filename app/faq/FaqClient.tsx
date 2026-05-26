'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE_CONFIG } from '@/lib/siteConfig';

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

export default function FaqClient({ data }: { data: FaqCategory[] }) {
  const [active, setActive] = useState<string | null>(null);

  const toggle = (key: string) => setActive((prev) => (prev === key ? null : key));

  return (
    <div className="space-y-10">
      {data.map((cat) => (
        <div key={cat.label}>
          <h2 className="font-serif text-2xl font-bold text-primary-500 mb-4 border-b border-gold-200 pb-3">{cat.label}</h2>
          <div className="space-y-2">
            {cat.items.map((item, idx) => {
              const key = `${cat.label}-${idx}`;
              const isOpen = active === key;
              return (
                <div key={key} className="bg-white rounded-2xl shadow-card overflow-hidden">
                  <button
                    onClick={() => toggle(key)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900 text-base">{item.question}</span>
                    <ChevronDown
                      size={18}
                      className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-50 pt-3">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
