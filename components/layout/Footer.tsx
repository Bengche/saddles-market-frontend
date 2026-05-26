'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Send, ChevronRight } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/siteConfig';
import api, { getErrorMessage } from '@/lib/api';

const footerLinks = {
  'Shop': [
    { label: 'All Saddles', href: '/products' },
    { label: 'Western Saddles', href: '/products?discipline=western' },
    { label: 'English Saddles', href: '/products?discipline=english' },
    { label: 'Dressage Saddles', href: '/products?discipline=dressage' },
    { label: 'Jumping Saddles', href: '/products?discipline=jumping' },
    { label: 'Youth Saddles', href: '/products?discipline=youth' },
  ],
  'Company': [
    { label: 'About Us', href: '/about' },
    { label: 'Why Choose Us', href: '/why-us' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
  ],
  'Support': [
    { label: 'Shipping Policy', href: '/shipping-policy' },
    { label: 'Returns & Refunds', href: '/returns-refunds' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms-conditions' },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subMessage, setSubMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubStatus('loading');
    try {
      await api.post('/newsletter/subscribe', { email });
      setSubStatus('success');
      setSubMessage('Thank you! Check your inbox to confirm your subscription.');
      setEmail('');
    } catch (err) {
      setSubStatus('error');
      setSubMessage(getErrorMessage(err));
    }
  };

  return (
    <footer className="bg-primary-900 text-white">
      {/* Newsletter band */}
      <div className="bg-primary-800 border-b border-white/10">
        <div className="container-custom py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-white mb-2">
                Join Our Newsletter
              </h3>
              <p className="text-white/70 text-sm">
                Saddle care tips, new arrivals, and exclusive offers — delivered to your inbox.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-3 w-full md:w-auto md:min-w-[400px]">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                disabled={subStatus === 'loading' || subStatus === 'success'}
                className="flex-1 px-5 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-400 focus:bg-white/15 transition-all text-sm"
                required
              />
              <button
                type="submit"
                disabled={subStatus === 'loading' || subStatus === 'success'}
                className="px-6 py-3 bg-gold-400 hover:bg-gold-500 text-white font-medium text-sm rounded-lg transition-colors flex items-center gap-2 flex-shrink-0 disabled:opacity-60"
              >
                <Send size={16} />
                {subStatus === 'loading' ? 'Sending...' : 'Subscribe'}
              </button>
            </form>
          </div>
          {subMessage && (
            <p className={`mt-4 text-sm text-center md:text-left ${subStatus === 'success' ? 'text-green-300' : 'text-red-300'}`}>
              {subMessage}
            </p>
          )}
        </div>
      </div>

      {/* Main footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="block mb-6">
              <Image src="/logo-white.svg" alt="Saddles Market" width={200} height={54} className="h-10 w-auto" />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
              The premier destination for high-quality horse saddles. Serving equestrians with craftsmanship and passion since our founding.
            </p>

            {/* Contact Info */}
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/70">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-gold-400" />
                <span>{SITE_CONFIG.address.full}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Phone size={16} className="flex-shrink-0 text-gold-400" />
                <a href={`tel:${SITE_CONFIG.phone}`} className="hover:text-white transition-colors">{SITE_CONFIG.phone}</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Mail size={16} className="flex-shrink-0 text-gold-400" />
                <a href={`mailto:${SITE_CONFIG.email.support}`} className="hover:text-white transition-colors">{SITE_CONFIG.email.support}</a>
              </li>
            </ul>

            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-gold-400 hover:text-white transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-semibold tracking-widest uppercase text-white/50 mb-5">
                {heading}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/65 hover:text-white transition-colors flex items-center gap-1.5 group"
                    >
                      <ChevronRight size={13} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-gold-400" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="gold-divider opacity-20 my-10" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p>
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy-policy" className="hover:text-white/70 transition-colors">Privacy</Link>
            <Link href="/terms-conditions" className="hover:text-white/70 transition-colors">Terms</Link>
            <Link href="/returns-refunds" className="hover:text-white/70 transition-colors">Returns</Link>
          </div>
          <p className="text-white/30 text-xs">
            30-day free trial on all saddles
          </p>
        </div>
      </div>
    </footer>
  );
}
