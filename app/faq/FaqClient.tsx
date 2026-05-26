'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FaqCategory } from './page';
import { motion, AnimatePresence } from 'framer-motion';

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
