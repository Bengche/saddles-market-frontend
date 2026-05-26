import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Saddles Market privacy policy to understand how we collect, use, and protect your personal information.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 1, 2025";
  return (
    <div className="bg-cream-100 min-h-screen py-16">
      <div className="container-custom max-w-3xl">
        <div className="mb-10">
          <h1 className="font-serif text-5xl font-bold text-primary-500 mb-3">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-sm">Last updated: {lastUpdated}</p>
        </div>
        <div className="prose-luxury">
          <p>
            This Privacy Policy describes how <strong>Saddles Market</strong> ("
            {SITE_CONFIG.name}", "we", "us", or "our"), located at{" "}
            {SITE_CONFIG.address.full}, collects, uses, and shares information
            when you visit or make a purchase from{" "}
            <strong>{SITE_CONFIG.url}</strong>.
          </p>

          <h2>1. Information We Collect</h2>
          <p>When you use our site, we may collect:</p>
          <ul>
            <li>
              <strong>Device &amp; log data:</strong> IP address, browser type,
              operating system, referring URLs, pages visited, and timestamps.
            </li>
            <li>
              <strong>Account information:</strong> First name, last name, email
              address, phone number, and password (stored as a one-way hash).
            </li>
            <li>
              <strong>Order information:</strong> Shipping and billing
              addresses, payment method type (not card numbers — see Payment
              Processing below), and order history.
            </li>
            <li>
              <strong>Communications:</strong> Any messages you send us via
              contact forms, email, or WhatsApp.
            </li>
            <li>
              <strong>Marketing preferences:</strong> Whether you have opted in
              or out of our newsletter.
            </li>
            <li>
              <strong>Cookies &amp; tracking data:</strong> With your consent,
              analytics cookies to understand usage patterns.
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>
              To process and fulfill your orders, including sending order
              confirmation and shipping updates.
            </li>
            <li>To authenticate your account and keep it secure.</li>
            <li>To respond to your support inquiries.</li>
            <li>
              To send you marketing emails if you have subscribed (you can
              unsubscribe at any time).
            </li>
            <li>
              To improve our website and product selection using anonymized
              analytics.
            </li>
            <li>To comply with legal obligations.</li>
          </ul>

          <h2>3. Payment Processing</h2>
          <p>
            We do not store your credit card or bank account numbers on our
            servers. Payments are processed by third-party payment processors.
            Please review their privacy policies for details on how your payment
            data is handled.
          </p>

          <h2>4. Sharing Your Information</h2>
          <p>
            We do not sell your personal information. We may share your data
            with:
          </p>
          <ul>
            <li>
              <strong>Shipping carriers</strong> to fulfill your orders (name,
              address, phone).
            </li>
            <li>
              <strong>Email service providers</strong> (SendGrid) to send
              transactional and marketing emails.
            </li>
            <li>
              <strong>Analytics providers</strong> (with consent) to understand
              site usage.
            </li>
            <li>
              <strong>Law enforcement or regulators</strong> if required by law.
            </li>
          </ul>

          <h2>5. Cookies</h2>
          <p>
            We use essential cookies required for the site to function (cart,
            authentication). With your consent, we also use analytics cookies.
            You can manage your cookie preferences at any time using the cookie
            consent banner.
          </p>

          <h2>6. Data Retention</h2>
          <p>
            We retain your account information for as long as your account is
            active or as required for legal purposes. Order data is retained for
            a minimum of 7 years for accounting compliance. You may request
            deletion of your account and personal data at any time — see Section
            7.
          </p>

          <h2>7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate data.</li>
            <li>
              Request deletion of your account and personal data (subject to
              legal retention requirements).
            </li>
            <li>Opt out of marketing communications at any time.</li>
            <li>
              Lodge a complaint with your local data protection authority.
            </li>
          </ul>
          <p>
            To exercise these rights, contact us at{" "}
            <a href={`mailto:${SITE_CONFIG.email.support}`}>
              {SITE_CONFIG.email.support}
            </a>
            .
          </p>

          <h2>8. Security</h2>
          <p>
            We use industry-standard security measures including SSL encryption,
            secure password hashing, and access controls to protect your data.
            No system is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2>9. Children&apos;s Privacy</h2>
          <p>
            Our site is not directed to children under 13. We do not knowingly
            collect personal information from children. If we learn that we have
            collected data from a child under 13, we will delete it promptly.
          </p>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. Changes will be posted
            on this page with an updated date. Continued use of our site after
            changes constitutes acceptance.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            For privacy-related questions or to exercise your rights:
            <br />
            <strong>{SITE_CONFIG.name}</strong>
            <br />
            {SITE_CONFIG.address.full}
            <br />
            <a href={`mailto:${SITE_CONFIG.email.support}`}>
              {SITE_CONFIG.email.support}
            </a>
            <br />
            <a href={`tel:${SITE_CONFIG.phone}`}>{SITE_CONFIG.phone}</a>
          </p>
        </div>
      </div>
    </div>
  );
}
