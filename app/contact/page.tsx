import type { Metadata } from 'next';
import ContactClient from './ContactClient';
import { SITE_CONFIG } from '@/lib/siteConfig';
import { MapPin, Phone, Mail, MessageSquare, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Get in touch with Saddles Market. We're here to help with saddle selection, orders, and returns. Call ${SITE_CONFIG.phone} or email ${SITE_CONFIG.email.support}.`,
  alternates: { canonical: '/contact' },
};

const contactInfo = [
  { icon: MapPin, label: 'Address', value: SITE_CONFIG.address.full, href: undefined },
  { icon: Phone, label: 'Phone', value: SITE_CONFIG.phone, href: `tel:${SITE_CONFIG.phone}` },
  { icon: Mail, label: 'Email', value: SITE_CONFIG.email.support, href: `mailto:${SITE_CONFIG.email.support}` },
  { icon: MessageSquare, label: 'WhatsApp', value: SITE_CONFIG.whatsapp, href: `https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, '')}` },
  { icon: Clock, label: 'Hours', value: 'Mon–Fri, 9am–6pm EST', href: undefined },
];

export default function ContactPage() {
  return (
    <div className="bg-cream-100 min-h-screen">
      {/* Hero */}
      <div className="bg-primary-800 py-20 text-center">
        <p className="text-gold-400 text-sm font-medium tracking-widest uppercase mb-3">Get In Touch</p>
        <h1 className="font-serif text-5xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto">Our team of equestrian experts is ready to help you find the perfect saddle.</p>
      </div>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Contact info */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl font-bold text-primary-500 mb-6">Our Details</h2>
            <div className="space-y-5">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon size={18} className="text-primary-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-gray-700 hover:text-primary-500 transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-gray-700">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 bg-primary-500 rounded-2xl p-6 text-white">
              <h3 className="font-serif text-lg font-semibold mb-2">30-Day Free Trial</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Every saddle comes with our signature 30-day free trial. Ride it, try it, love it — or return it, no questions asked.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <ContactClient />
          </div>
        </div>
      </div>
    </div>
  );
}
