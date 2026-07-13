"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatDate, formatPrice } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/siteConfig";
import api from "@/lib/api";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700" },
  processing: { label: "Processing", color: "bg-indigo-100 text-indigo-700" },
  shipped: { label: "Shipped", color: "bg-purple-100 text-purple-700" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
  refund_requested: {
    label: "Refund Requested",
    color: "bg-orange-100 text-orange-700",
  },
  refunded: { label: "Refunded", color: "bg-gray-100 text-gray-600" },
};

interface OrderDetail {
  id: string;
  order_number: string;
  status: string;
  created_at: string;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  total: number;
  shipping_method: string;
  coupon_code?: string;
  customer_notes?: string;
  tracking_number?: string;
  carrier_name?: string;
  trial_end_date?: string;
  // shipping address
  ship_first_name: string;
  ship_last_name: string;
  ship_street_line1: string;
  ship_street_line2?: string;
  ship_city: string;
  ship_state: string;
  ship_zip: string;
  ship_country: string;
  ship_phone?: string;
  // billing
  bill_same_as_ship: boolean;
  bill_first_name?: string;
  bill_last_name?: string;
  bill_street_line1?: string;
  bill_city?: string;
  bill_state?: string;
  bill_zip?: string;
  bill_country?: string;
  items: Array<{
    id: string;
    product_name: string;
    product_image?: string;
    quantity: number;
    price: number;
    total: number;
    seat_size?: string;
    selected_color?: string;
    selected_tree_size?: string;
    selected_width?: string;
  }>;
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/account/login?redirect=/account/orders/${id}`);
    }
  }, [isAuthenticated, authLoading, router, id]);

  useEffect(() => {
    if (!isAuthenticated || !id) return;
    api
      .get(`/orders/${id}`)
      .then((r) => setOrder(r.data.data?.order || null))
      .catch((err) => {
        if (err?.response?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, id]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-cream-100 py-16">
        <div className="container-custom max-w-4xl">
          <div className="h-8 skeleton rounded w-48 mb-8 animate-pulse bg-gray-200" />
          <div className="bg-white rounded-2xl shadow-card p-6 animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4">
        <div className="text-center">
          <Package size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-primary-500 mb-2">
            Order not found
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            This order does not exist or does not belong to your account.
          </p>
          <Link href="/account/orders" className="btn-primary">
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  const status = STATUS_MAP[order.status] || {
    label: order.status,
    color: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="min-h-screen bg-cream-100 py-10">
      <div className="container-custom max-w-4xl">
        {/* Back */}
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to My Orders
        </Link>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">Order Number</p>
            <h1 className="font-serif text-2xl font-bold text-primary-500">
              {order.order_number}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>
          <span
            className={`badge text-sm font-semibold px-4 py-1.5 ${status.color}`}
          >
            {status.label}
          </span>
        </div>

        <div className="space-y-5">
          {/* Items */}
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">
                Items ({order.items.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 px-6 py-4">
                  {item.product_image && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 leading-snug">
                      {item.product_name}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {item.seat_size && (
                        <span className="text-xs bg-cream-100 text-primary-600 border border-primary-100 rounded px-2 py-0.5">
                          Seat: {item.seat_size}&quot;
                        </span>
                      )}
                      {item.selected_width && (
                        <span className="text-xs bg-cream-100 text-primary-600 border border-primary-100 rounded px-2 py-0.5">
                          Width: {item.selected_width}
                        </span>
                      )}
                      {item.selected_color && (
                        <span className="text-xs bg-cream-100 text-primary-600 border border-primary-100 rounded px-2 py-0.5">
                          Color: {item.selected_color}
                        </span>
                      )}
                      {item.selected_tree_size && (
                        <span className="text-xs bg-cream-100 text-primary-600 border border-primary-100 rounded px-2 py-0.5">
                          Tree: {item.selected_tree_size}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      Qty: {item.quantity} &times; {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 whitespace-nowrap">
                    {formatPrice(item.total)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="px-6 py-4 bg-cream-50 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>
                  Shipping
                  {order.shipping_method && (
                    <span className="ml-1 text-xs text-gray-400 capitalize">
                      ({order.shipping_method.replace("_", " ")})
                    </span>
                  )}
                </span>
                <span>
                  {parseFloat(String(order.shipping_cost)) === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    formatPrice(order.shipping_cost)
                  )}
                </span>
              </div>
              {parseFloat(String(order.discount_amount)) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>
                    Discount
                    {order.coupon_code && (
                      <span className="ml-1 text-xs">
                        ({order.coupon_code})
                      </span>
                    )}
                  </span>
                  <span>- {formatPrice(order.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Tracking */}
          {order.tracking_number && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex items-center gap-3 mb-1">
                <Truck size={18} className="text-primary-500" />
                <h2 className="font-semibold text-gray-900">Tracking</h2>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                {order.carrier_name || "Carrier"} &mdash; tracking number:
              </p>
              <p className="font-mono font-semibold text-primary-600 text-lg">
                {order.tracking_number}
              </p>
            </div>
          )}

          {/* Trial period */}
          {order.trial_end_date && order.status === "delivered" && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
              <Clock
                size={18}
                className="text-amber-500 flex-shrink-0 mt-0.5"
              />
              <div>
                <p className="font-semibold text-amber-800 text-sm">
                  30-Day Free Trial Active
                </p>
                <p className="text-amber-700 text-sm mt-0.5">
                  Your trial ends on{" "}
                  <strong>{formatDate(order.trial_end_date)}</strong>. If the
                  saddle is not right for you, contact us before this date for a
                  full refund or exchange.
                </p>
              </div>
            </div>
          )}

          {/* Addresses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-primary-400" />
                <h2 className="font-semibold text-gray-900 text-sm">
                  Shipping Address
                </h2>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {order.ship_first_name} {order.ship_last_name}
                <br />
                {order.ship_street_line1}
                {order.ship_street_line2 && (
                  <>
                    <br />
                    {order.ship_street_line2}
                  </>
                )}
                <br />
                {order.ship_city}, {order.ship_state} {order.ship_zip}
                <br />
                {order.ship_country}
                {order.ship_phone && (
                  <>
                    <br />
                    <span className="text-gray-400">{order.ship_phone}</span>
                  </>
                )}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-primary-400" />
                <h2 className="font-semibold text-gray-900 text-sm">
                  Billing Address
                </h2>
              </div>
              {order.bill_same_as_ship ? (
                <p className="text-sm text-gray-500">
                  Same as shipping address
                </p>
              ) : (
                <p className="text-sm text-gray-700 leading-relaxed">
                  {order.bill_first_name} {order.bill_last_name}
                  <br />
                  {order.bill_street_line1}
                  <br />
                  {order.bill_city}, {order.bill_state} {order.bill_zip}
                  <br />
                  {order.bill_country}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          {order.customer_notes && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-semibold text-gray-900 text-sm mb-2">
                Order Notes
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {order.customer_notes}
              </p>
            </div>
          )}

          {/* Contact / Help */}
          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6">
            <h2 className="font-semibold text-primary-800 text-sm mb-2">
              Need help with this order?
            </h2>
            <p className="text-sm text-primary-700 mb-4">
              Our team is ready to assist you with any questions about your
              order, payment, or delivery.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${SITE_CONFIG.contact.salesEmail}?subject=Order ${order.order_number}`}
                className="btn-primary text-sm py-2 px-4"
              >
                Email Us
              </a>
              <Link href="/contact" className="btn-secondary text-sm py-2 px-4">
                Contact Page <ChevronRight size={14} className="inline" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
