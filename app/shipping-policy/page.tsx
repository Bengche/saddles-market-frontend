import type { Metadata } from "next";
import { SITE_CONFIG, formatPrice } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: `Saddles Market shipping information — free shipping over $${SITE_CONFIG.shipping.freeShippingThreshold}, standard and express options, timelines and tracking.`,
  alternates: { canonical: "/shipping-policy" },
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-cream-100 min-h-screen py-16">
      <div className="container-custom max-w-3xl">
        <div className="mb-10">
          <h1 className="font-serif text-5xl font-bold text-primary-500 mb-3">
            Shipping Policy
          </h1>
          <p className="text-gray-400 text-sm">Last updated: January 1, 2025</p>
        </div>

        {/* Shipping options summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl shadow-card p-5 text-center">
            <p className="font-serif text-2xl font-bold text-green-600 mb-1">
              FREE
            </p>
            <p className="text-sm font-medium text-gray-900">Free Shipping</p>
            <p className="text-xs text-gray-400 mt-1">
              Orders over{" "}
              {formatPrice(SITE_CONFIG.shipping.freeShippingThreshold)}
            </p>
            <p className="text-xs text-gray-400">5–8 business days</p>
          </div>
          <div className="bg-white rounded-2xl shadow-card p-5 text-center">
            <p className="font-serif text-2xl font-bold text-primary-500 mb-1">
              {formatPrice(SITE_CONFIG.shipping.standardRate)}
            </p>
            <p className="text-sm font-medium text-gray-900">
              Standard Shipping
            </p>
            <p className="text-xs text-gray-400 mt-1">5–8 business days</p>
          </div>
          <div className="bg-white rounded-2xl shadow-card p-5 text-center">
            <p className="font-serif text-2xl font-bold text-gold-500 mb-1">
              {formatPrice(SITE_CONFIG.shipping.expressRate)}
            </p>
            <p className="text-sm font-medium text-gray-900">
              Express Shipping
            </p>
            <p className="text-xs text-gray-400 mt-1">1–3 business days</p>
          </div>
        </div>

        <div className="prose-luxury">
            <p className="text-xs text-gray-400 mt-1">
              Orders over {formatPrice(SITE_CONFIG.shipping.freeShippingThreshold)}
            </p>
            <p>
              <strong>
                {formatPrice(SITE_CONFIG.shipping.freeShippingThreshold)} or more
              </strong>{" "}
              qualify for free standard shipping within the United States. The
              free shipping option is automatically applied at checkout.
            </p>

          <h2>
            Standard Shipping — {formatPrice(SITE_CONFIG.shipping.standardRate)}
          </h2>
          <p>
            Delivered in <strong>5–8 business days</strong> after order
            processing. Business days are Monday–Friday, excluding US federal
            holidays. Standard shipping applies to orders under{" "}
            {formatPrice(SITE_CONFIG.shipping.freeShippingThreshold)}.
          </p>

          <h2>
            Express Shipping — {formatPrice(SITE_CONFIG.shipping.expressRate)}
          </h2>
          <p>
            Delivered in <strong>1–3 business days</strong> after order
            processing. Express orders placed before 2pm EST on a business day
            are typically processed same day.
          </p>

          <h2>Processing Time</h2>
            Orders are typically processed within <strong>1 business day</strong> of being placed. You will receive an email with your tracking number once your order ships.
          </p>

          <h2>Tracking</h2>
          <p>
            Every shipment is fully tracked. Your tracking number will be
            emailed to you when your order ships. You can also view your
            tracking number on your <strong>Orders</strong> page after logging
            into your account.
          </p>
          
          <h2>Insurance</h2>
          <p>
            All shipments are fully insured. If your saddle is lost or damaged
            in transit, we will file the insurance claim on your behalf and send
            a replacement or issue a refund.
          </p>

          <h2>Shipping Address</h2>
          <p>
            Please ensure your shipping address is correct before placing your
            order. We are not responsible for orders shipped to incorrect
            addresses provided at checkout. If you need to change your shipping
            address after placing an order, contact us immediately at{" "}
            <a href={`mailto:${SITE_CONFIG.email.support}`}>
              {SITE_CONFIG.email.support}
            </a>{" "}
            — we can usually update the address if the order has not yet
            shipped.
          </p>

          <h2>International Shipping</h2>
          <p>
            We currently ship within the United States only. International
            shipping is coming soon — sign up for our newsletter to be notified.
          </p>

          <h2>Shipping Carriers</h2>
          <p>
            We primarily use UPS, FedEx, and USPS depending on your location and
            the selected shipping method.
          </p>

          <h2>Contact</h2>
          <p>
            Shipping questions? Contact us at{" "}
            <a href={`mailto:${SITE_CONFIG.email.support}`}>
              {SITE_CONFIG.email.support}
            </a>{" "}
            or call <a href={`tel:${SITE_CONFIG.phone}`}>{SITE_CONFIG.phone}</a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
