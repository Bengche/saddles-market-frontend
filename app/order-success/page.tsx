"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Mail, Phone } from "lucide-react";
import { SITE_CONFIG } from "@/lib/siteConfig";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">
        {/* Success card */}
        <div className="bg-white rounded-3xl shadow-card p-10 text-center mb-6">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>

          <h1 className="font-serif text-3xl font-bold text-primary-500 mb-3">
            Order Placed Successfully
          </h1>

          <p className="text-gray-600 leading-relaxed mb-3">
            Thank you for your order. A confirmation has been sent to your email
            address.
          </p>

          {orderNumber && (
            <p className="text-sm font-medium text-primary-400 bg-cream-100 rounded-lg px-4 py-2 inline-block mb-6">
              Order #{orderNumber}
            </p>
          )}

          <div className="flex flex-col gap-3">
            <Link href="/account/orders" className="btn-primary">
              Track My Order
            </Link>
            <Link href="/products" className="btn-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* What happens next */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-serif text-lg font-semibold text-primary-500 mb-4">
            What Happens Next
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-semibold font-serif">
                1
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Order review &amp; payment confirmation
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Our team will contact you within 24 hours to confirm payment
                  details and answer any questions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-semibold font-serif">
                2
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Inspection &amp; dispatch
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Once payment is confirmed, your saddle is carefully inspected
                  and shipped with tracking.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-gold-400 text-white flex items-center justify-center flex-shrink-0 text-sm font-semibold font-serif">
                3
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  30-Day free trial begins on delivery
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Ride in it, assess the fit. If it is not right — for any
                  reason — we will refund or exchange it, no questions asked.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-3">
              Have a question? We are here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`mailto:${SITE_CONFIG.contact.salesEmail}`}
                className="flex items-center justify-center gap-2 text-sm text-primary-500 hover:text-primary-600 font-medium"
              >
                <Mail size={15} />
                {SITE_CONFIG.contact.salesEmail}
              </a>
              <a
                href={`tel:${SITE_CONFIG.contact.phone}`}
                className="flex items-center justify-center gap-2 text-sm text-primary-500 hover:text-primary-600 font-medium"
              >
                <Phone size={15} />
                {SITE_CONFIG.contact.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream-100 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
