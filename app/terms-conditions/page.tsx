import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Read the Saddles Market terms and conditions governing your use of our website and purchase of products.',
  alternates: { canonical: '/terms-conditions' },
};

export default function TermsConditionsPage() {
  return (
    <div className="bg-cream-100 min-h-screen py-16">
      <div className="container-custom max-w-3xl">
        <div className="mb-10">
          <h1 className="font-serif text-5xl font-bold text-primary-500 mb-3">Terms &amp; Conditions</h1>
          <p className="text-gray-400 text-sm">Last updated: January 1, 2025</p>
        </div>
        <div className="prose-luxury">
          <p>
            These Terms and Conditions ("Terms") govern your use of the website at <strong>{SITE_CONFIG.url}</strong> and your purchase of products from <strong>{SITE_CONFIG.name}</strong>, located at {SITE_CONFIG.address.full} ("we", "us", "our"). By using our site or placing an order, you agree to these Terms.
          </p>

          <h2>1. Eligibility</h2>
          <p>
            You must be at least 18 years old to make a purchase on this site. By placing an order, you represent that you are 18 or older and legally capable of entering into a binding contract.
          </p>

          <h2>2. Products</h2>
          <p>
            We reserve the right to limit quantities, discontinue products, or modify prices at any time. Product descriptions and images are provided for informational purposes. We make reasonable efforts to display colors and details accurately; slight variations may occur.
          </p>

          <h2>3. Pricing</h2>
          <p>
            All prices are displayed in US Dollars (USD) and are subject to change without notice. Applicable taxes are calculated at checkout based on your shipping address.
          </p>

          <h2>4. Orders & Payment</h2>
          <p>
            Your order is an offer to purchase. We may reject or cancel any order at our discretion, including in cases of pricing errors, suspected fraud, or stock unavailability. If we cancel an order after payment, you will receive a full refund.
          </p>
          <p>
            Payment must be made in full at the time of ordering. We accept major credit/debit cards, PayPal, and bank transfer.
          </p>

          <h2>5. Shipping</h2>
          <p>
            Please refer to our <a href="/shipping-policy">Shipping Policy</a> for full details on shipping methods, timelines, and costs. Risk of loss passes to you upon delivery to the carrier.
          </p>

          <h2>6. Returns & Refunds</h2>
          <p>
            Please refer to our <a href="/returns-refunds">Returns &amp; Refunds Policy</a> for full details, including our 30-day free trial.
          </p>

          <h2>7. Intellectual Property</h2>
          <p>
            All content on this website — including logos, images, text, and code — is the property of {SITE_CONFIG.name} or its licensors and is protected by copyright law. You may not reproduce, distribute, or create derivative works without written permission.
          </p>

          <h2>8. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized account access. We are not liable for losses arising from unauthorized account use.
          </p>

          <h2>9. User-Generated Content</h2>
          <p>
            By submitting a product review or other content, you grant us a non-exclusive, royalty-free license to use, display, and reproduce that content. You represent that your content does not infringe any third-party rights.
          </p>

          <h2>10. Disclaimers</h2>
          <p>
            Our website and products are provided "as is." We disclaim all warranties, express or implied, to the fullest extent permitted by law. Saddle fit and suitability depends on individual horse and rider factors; we recommend consulting a qualified saddle fitter.
          </p>

          <h2>11. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, {SITE_CONFIG.name} shall not be liable for any indirect, incidental, or consequential damages arising from your use of our site or products. Our total liability shall not exceed the amount you paid for the specific product giving rise to the claim.
          </p>

          <h2>12. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless {SITE_CONFIG.name} from any claims, damages, or expenses arising from your violation of these Terms or your use of our site.
          </p>

          <h2>13. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the Commonwealth of Kentucky, USA, without regard to conflict-of-law provisions. Any disputes shall be resolved in the courts of Fayette County, Kentucky.
          </p>

          <h2>14. Changes to These Terms</h2>
          <p>
            We may update these Terms at any time. Changes will be posted on this page with an updated date. Continued use of our site after changes constitutes acceptance.
          </p>

          <h2>15. Contact</h2>
          <p>
            <strong>{SITE_CONFIG.name}</strong><br />
            {SITE_CONFIG.address.full}<br />
            <a href={`mailto:${SITE_CONFIG.email.support}`}>{SITE_CONFIG.email.support}</a><br />
            <a href={`tel:${SITE_CONFIG.phone}`}>{SITE_CONFIG.phone}</a>
          </p>
        </div>
      </div>
    </div>
  );
}
