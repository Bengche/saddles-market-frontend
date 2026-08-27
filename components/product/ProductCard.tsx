"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { cn, formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart, loading: cartLoading } = useCart();
  const { toggle: toggleFavorite, isFavorite } = useFavorites();
  const isFav = isFavorite(product.id);
  const discountPercent = product.compare_price
    ? Math.round(
        ((product.compare_price - product.price) / product.compare_price) * 100,
      )
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className={cn(
        "group relative bg-white rounded-3xl overflow-hidden flex flex-col",
        "shadow-card hover:shadow-luxury-lg transition-all duration-500",
        className,
      )}
    >
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden bg-cream-200">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.primary_image || "/placeholder-saddle.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </Link>

        {/* Subtle bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[11px] font-bold tracking-wide shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.is_featured && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-white text-[11px] font-bold tracking-wide shadow-sm">
              Featured
            </span>
          )}
          {product.created_at &&
            Date.now() - new Date(product.created_at).getTime() <
              7 * 24 * 60 * 60 * 1000 && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[11px] font-bold tracking-wide shadow-sm">
                New
              </span>
            )}
        </div>

        {/* Wishlist — glass morphism, always visible */}
        <button
          onClick={() => toggleFavorite(product.id)}
          className={cn(
            "absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center",
            "backdrop-blur-md shadow-sm transition-all duration-200 hover:scale-110",
            isFav
              ? "bg-red-500 text-white"
              : "bg-white/80 text-gray-600 hover:text-red-500",
          )}
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={15} fill={isFav ? "currentColor" : "none"} />
        </button>

        {/* Quick view — slides up from bottom on hover */}
        <Link
          href={`/product/${product.slug}`}
          className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-2 bg-black/50 backdrop-blur-sm text-white text-sm font-medium py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        >
          <Eye size={15} />
          View Details
        </Link>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Discipline + seat size */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-primary-400">
            {product.discipline?.replace(/_/g, " ") ||
              product.category?.name ||
              "Saddle"}
          </span>
          {product.seat_size && (
            <span className="text-[10px] font-semibold bg-cream-200 text-primary-500 px-2 py-0.5 rounded-full">
              {product.seat_size}&quot; seat
            </span>
          )}
        </div>

        {/* Name */}
        <Link href={`/product/${product.slug}`} className="flex-1 mb-1">
          <h3 className="font-serif text-[1.05rem] font-bold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-400 mt-0.5 mb-3">{product.brand}</p>
        )}

        {/* Rating */}
        {product.review_count > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={
                    i < Math.round(product.avg_rating)
                      ? "fill-gold-400 text-gold-400"
                      : "fill-gray-200 text-gray-200"
                  }
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-400">
              ({product.review_count})
            </span>
          </div>
        )}

        {/* Price row + add-to-cart */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.compare_price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>
          <button
            onClick={() => addToCart(product.id)}
            disabled={cartLoading || product.stock_quantity === 0}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shadow-sm",
              "transition-all duration-200 hover:scale-110 active:scale-95",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              product.stock_quantity === 0
                ? "bg-gray-100 text-gray-400"
                : "bg-primary-500 hover:bg-primary-600 text-white",
            )}
            aria-label={
              product.stock_quantity === 0 ? "Out of stock" : "Add to cart"
            }
          >
            <ShoppingCart size={16} />
          </button>
        </div>

        {/* Low stock warning */}
        {product.stock_quantity <= 3 && product.stock_quantity > 0 && (
          <p className="text-[11px] text-amber-600 font-semibold mt-2">
            Only {product.stock_quantity} left in stock
          </p>
        )}
      </div>
    </motion.div>
  );
}
