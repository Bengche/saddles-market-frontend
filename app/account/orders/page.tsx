"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, Clock, ChevronRight, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Order } from "@/types";
import { formatDate, formatPrice } from "@/lib/utils";
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

export default function OrdersPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/account/login?redirect=/account/orders");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    api
      .get("/orders")
      .then((r) => setOrders(r.data.data?.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-cream-100 py-16">
        <div className="container-custom max-w-4xl">
          <div className="h-8 skeleton rounded w-48 mb-8" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-card p-6 mb-4 animate-pulse"
            >
              <div className="h-4 skeleton rounded w-1/4 mb-3" />
              <div className="h-6 skeleton rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream-100 min-h-screen py-10">
      <div className="container-custom max-w-4xl">
        <h1 className="font-serif text-3xl font-bold text-primary-500 mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="font-serif text-xl text-gray-600 mb-3">
              No orders yet
            </p>
            <p className="text-gray-500 text-sm mb-8">
              Your order history will appear here once you place your first
              order.
            </p>
            <Link href="/products" className="btn-primary">
              Shop Saddles
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl shadow-card p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Order Number</p>
                    <p className="font-bold text-gray-900 text-lg">
                      {order.order_number}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Order Date</p>
                    <p className="text-sm font-medium text-gray-700">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <span
                    className={`badge text-sm font-semibold ${STATUS_MAP[order.status]?.color || "bg-gray-100 text-gray-600"}`}
                  >
                    {STATUS_MAP[order.status]?.label || order.status}
                  </span>
                </div>

                {/* Items preview */}
                <div className="flex flex-col gap-2 mb-4">
                  {order.items?.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-2 bg-cream-100 rounded-lg px-3 py-2"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-gray-700 truncate max-w-[200px] block">
                          {item.product_name}
                        </span>
                        {/* Variant summary */}
                        {(item.seatSize || item.selectedWidth || item.selectedColor || item.selectedTreeSize) && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.seatSize && (
                              <span className="text-xs bg-white text-primary-600 border border-primary-100 rounded px-1.5 py-0.5">Seat: {item.seatSize}</span>
                            )}
                            {item.selectedWidth && (
                              <span className="text-xs bg-white text-primary-600 border border-primary-100 rounded px-1.5 py-0.5">Width: {item.selectedWidth}</span>
                            )}
                            {item.selectedColor && (
                              <span className="text-xs bg-white text-primary-600 border border-primary-100 rounded px-1.5 py-0.5">Color: {item.selectedColor}</span>
                            )}
                            {item.selectedTreeSize && (
                              <span className="text-xs bg-white text-primary-600 border border-primary-100 rounded px-1.5 py-0.5">Tree: {item.selectedTreeSize}</span>
                            )}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        x{item.quantity}
                      </span>
                    </div>
                  ))}
                  {(order.items?.length || 0) > 3 && (
                    <div className="bg-cream-100 rounded-lg px-3 py-2 text-xs text-gray-500">
                      +{order.items.length - 3} more
                    </div>
                  )}
                </div>

                {order.tracking_number && (
                  <div className="flex items-center gap-2 text-sm text-primary-600 mb-4">
                    <ExternalLink size={14} />
                    Tracking:{" "}
                    <span className="font-mono font-medium">
                      {order.tracking_number}
                    </span>
                  </div>
                )}

                {order.trial_end_date && order.status === "delivered" && (
                  <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg mb-4">
                    <Clock size={13} />
                    30-day trial ends: {formatDate(order.trial_end_date)}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <p className="font-bold text-xl text-primary-600">
                    {formatPrice(order.total)}
                  </p>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="flex items-center gap-1.5 text-sm text-primary-500 font-medium hover:text-primary-700 transition-colors"
                  >
                    View Details <ChevronRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
