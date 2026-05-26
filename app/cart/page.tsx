"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Shield,
  RotateCcw,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/siteConfig";

export default function CartPage() {
  const { cart, updateItem, removeItem, loading } = useCart();
  const freeShippingThreshold =
    require("@/lib/siteConfig").SITE_CONFIG.shipping.freeShippingThreshold;
  const remaining = Math.max(0, freeShippingThreshold - cart.subtotal);

  if (!cart.items.length) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-primary-300" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 mb-3">
            Your cart is empty
          </h1>
          <p className="text-gray-500 mb-8">
            Discover our premium saddle collection and find the perfect fit for
            you and your horse.
          </p>
          <Link href="/products" className="btn-primary">
            Browse Saddles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="container-custom">
          <h1 className="font-serif text-3xl font-bold text-primary-500">
            Shopping Cart
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {cart.item_count} item{cart.item_count !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free shipping banner */}
            {remaining > 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
                <p className="text-sm text-amber-700">
                  Add{" "}
                  <span className="font-bold">{formatPrice(remaining)}</span>{" "}
                  more to qualify for <strong>free shipping</strong>!
                </p>
                <div className="mt-2 h-2 bg-amber-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (cart.subtotal / freeShippingThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 flex items-center gap-3">
                <Shield size={18} className="text-green-500 flex-shrink-0" />
                <p className="text-sm text-green-700 font-medium">
                  You qualify for free shipping!
                </p>
              </div>
            )}

            {cart.items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl shadow-card p-5 flex gap-5"
              >
                <Link
                  href={`/product/${item.product.slug}`}
                  className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-cream-200"
                >
                  <Image
                    src={
                      item.product.primary_image || "/placeholder-saddle.jpg"
                    }
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="font-serif font-semibold text-gray-900 hover:text-primary-600 transition-colors text-base leading-snug block mb-1"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-lg font-bold text-primary-600 mb-3">
                    {formatPrice(item.product.price)}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateItem(item.id, item.quantity - 1)}
                        disabled={loading || item.quantity <= 1}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4 py-2 font-semibold text-sm min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                        disabled={
                          loading ||
                          item.quantity >= item.product.stock_quantity
                        }
                        className="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="font-bold text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={loading}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal ({cart.item_count} items)
                  </span>
                  <span className="font-semibold">
                    {formatPrice(cart.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span
                    className={
                      cart.subtotal >= freeShippingThreshold
                        ? "text-green-600 font-semibold"
                        : "font-semibold"
                    }
                  >
                    {cart.subtotal >= freeShippingThreshold
                      ? "Free"
                      : formatPrice(SITE_CONFIG.shipping.standardRate)}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">
                    Estimated Total
                  </span>
                  <span className="font-bold text-xl text-primary-600">
                    {formatPrice(
                      cart.subtotal +
                        (cart.subtotal >= freeShippingThreshold
                          ? 0
                          : SITE_CONFIG.shipping.standardRate),
                    )}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="btn-primary w-full py-4 text-base"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </Link>

              <div className="mt-5 space-y-3">
                {[
                  { icon: Shield, text: "30-day free trial on all saddles" },
                  { icon: RotateCcw, text: "Hassle-free returns" },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-2 text-xs text-gray-500"
                  >
                    <Icon size={13} className="text-primary-400" />
                    {text}
                  </div>
                ))}
              </div>

              <div className="gold-divider" />

              <Link
                href="/products"
                className="flex items-center justify-center gap-2 text-sm text-primary-500 hover:text-primary-700 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
