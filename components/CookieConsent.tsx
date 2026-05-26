'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Shield, BarChart3 } from 'lucide-react';
import Link from 'next/link';

type ConsentState = { essential: boolean; analytics: boolean; marketing: boolean };

const CONSENT_KEY = 'sm_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(CONSENT_KEY) : null;
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const save = (settings: ConsentState) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ ...settings, savedAt: Date.now() }));
    setVisible(false);
  };

  const acceptAll = () => save({ essential: true, analytics: true, marketing: true });
  const saveCustom = () => save(consent);
  const declineAll = () => save({ essential: true, analytics: false, marketing: false });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-lg z-[150]"
        >
          <div className="bg-white rounded-2xl shadow-luxury-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between p-5 pb-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Cookie size={18} className="text-primary-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Cookie Preferences</p>
                  <p className="text-xs text-gray-500">We value your privacy</p>
                </div>
              </div>
              <button onClick={declineAll} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                <X size={16} />
              </button>
            </div>

            <div className="p-5">
              <p className="text-sm text-gray-600 leading-relaxed">
                We use cookies to enhance your experience and analyze site traffic. You can manage your preferences
                or learn more in our{' '}
                <Link href="/privacy-policy" className="text-primary-600 underline underline-offset-2">
                  Privacy Policy
                </Link>
                .
              </p>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                      {[
                        { key: 'essential', icon: Shield, label: 'Essential', desc: 'Required for the site to work. Cannot be disabled.', disabled: true },
                        { key: 'analytics', icon: BarChart3, label: 'Analytics', desc: 'Help us understand how visitors use the site.' },
                        { key: 'marketing', icon: Cookie, label: 'Marketing', desc: 'Used to deliver relevant advertisements.' },
                      ].map(({ key, icon: Icon, label, desc, disabled }) => (
                        <label key={key} className={`flex items-start gap-3 ${disabled ? 'opacity-70' : 'cursor-pointer'}`}>
                          <div className="relative mt-0.5">
                            <input
                              type="checkbox"
                              checked={consent[key as keyof ConsentState]}
                              disabled={disabled}
                              onChange={(e) => setConsent((prev) => ({ ...prev, [key]: e.target.checked }))}
                              className="sr-only"
                            />
                            <div className={`w-10 h-6 rounded-full transition-colors duration-200 flex items-center ${consent[key as keyof ConsentState] ? 'bg-primary-500' : 'bg-gray-200'}`}>
                              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 mx-1 ${consent[key as keyof ConsentState] ? 'translate-x-4' : 'translate-x-0'}`} />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <Icon size={13} className="text-gray-500" />
                              <span className="text-sm font-medium text-gray-800">{label}</span>
                              {disabled && <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">Always on</span>}
                            </div>
                            <p className="text-xs text-gray-500">{desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-wrap items-center gap-2 mt-4">
                <button onClick={acceptAll} className="btn-primary text-sm py-2.5 flex-1 min-w-[140px]">
                  Accept All
                </button>
                {showDetails ? (
                  <button onClick={saveCustom} className="btn-secondary text-sm py-2.5 flex-1 min-w-[120px]">
                    Save Preferences
                  </button>
                ) : (
                  <button onClick={() => setShowDetails(true)} className="btn-secondary text-sm py-2.5 flex-1 min-w-[120px]">
                    Manage
                  </button>
                )}
                <button onClick={declineAll} className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-2">
                  Decline
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
