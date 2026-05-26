import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Returns & Refunds Policy',
  description: `Learn about Saddles Market's 30-day free trial and hassle-free return policy. Full refunds, no restocking fees.`,
  alternates: { canonical: '/returns-refunds' },
};

export default function ReturnsRefundsPage() {
  return (
    <div className="bg-cream-100 min-h-screen py-16">
      <div className="container-custom max-w-3xl">
        <div className="mb-10">
          <h1 className="font-serif text-5xl font-bold text-primary-500 mb-3">Returns &amp; Refunds</h1>
          <p className="text-gray-400 text-sm">Last updated: January 1, 2025</p>
        </div>
        <div className="bg-gold-50 border border-gold-200 rounded-2xl p-6 mb-10">
          <p className="font-serif text-xl font-semibold text-primary-500 mb-2">Our Commitment: 30-Day Free Trial</p>
          <p className="text-gray-700 leading-relaxed">
            Every saddle purchased through Saddles Market comes with a <strong>30-day free trial</strong>. If for any reason you are not completely satisfied, return it for a <strong>full refund</strong> — no questions asked, no restocking fee.
          </p>
        </div>

        <div className="prose-luxury">
          <h2>Trial Period</h2>
          <p>
            Your 30-day trial period begins on the <strong>date of delivery</strong> as confirmed by the carrier. You have 30 full calendar days to try the saddle and decide.
          </p>

          <h2>What Can Be Returned</h2>
          <p>Any saddle purchased from Saddles Market may be returned within the 30-day trial window, including:</p>
          <ul>
            <li>New saddles</li>
            <li>Pre-owned / used saddles listed on our platform</li>
            <li>Saddles that show normal trial wear (light sweat marks, saddle soap residue)</li>
          </ul>
          <p><strong>Items not eligible for return:</strong></p>
          <ul>
            <li>Custom-made or bespoke saddles (unless defective)</li>
            <li>Saddles that have been structurally damaged through misuse</li>
            <li>Accessories, pads, or consumables that have been used</li>
          </ul>

          <h2>How to Initiate a Return</h2>
          <ol>
            <li>Log into your account and visit <strong>My Orders</strong>.</li>
            <li>Click <strong>Request Return</strong> on the order you want to return.</li>
            <li>Select a reason (optional — all reasons are accepted within the trial period).</li>
            <li>We will email you a <strong>prepaid return shipping label</strong> within 1 business day.</li>
            <li>Pack the saddle securely and drop it at any authorized carrier location.</li>
          </ol>
          <p>Alternatively, email <a href={`mailto:${SITE_CONFIG.email.support}`}>{SITE_CONFIG.email.support}</a> with your order number and we will arrange everything.</p>

          <h2>Refund Processing</h2>
          <p>
            Once we receive your return and inspect it (typically within 2 business days of receipt), we will process your refund. Refunds are issued to your <strong>original payment method</strong> and typically appear within <strong>3–5 business days</strong>, depending on your bank.
          </p>

          <h2>Exchanges</h2>
          <p>
            Would you like to exchange your saddle for a different model? Contact us at <a href={`mailto:${SITE_CONFIG.email.support}`}>{SITE_CONFIG.email.support}</a> or call <a href={`tel:${SITE_CONFIG.phone}`}>{SITE_CONFIG.phone}</a> within your 30-day trial window. We will arrange an exchange at no additional shipping charge.
          </p>

          <h2>Damaged or Defective Items</h2>
          <p>
            If your saddle arrives damaged or has a manufacturing defect, contact us within <strong>48 hours of delivery</strong> with photos. We will arrange a replacement or full refund at no cost to you — outside the standard trial window if needed.
          </p>

          <h2>Contact Us</h2>
          <p>
            Questions? We&apos;re here to help.<br />
            Email: <a href={`mailto:${SITE_CONFIG.email.support}`}>{SITE_CONFIG.email.support}</a><br />
            Phone: <a href={`tel:${SITE_CONFIG.phone}`}>{SITE_CONFIG.phone}</a><br />
            WhatsApp: <a href={`https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">{SITE_CONFIG.whatsapp}</a>
          </p>
        </div>
      </div>
    </div>
  );
}
