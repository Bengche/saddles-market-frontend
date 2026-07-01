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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45 }}
      className={cn(
        "group relative bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-400 flex flex-col",
        className,
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-200">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.primary_image || "/placeholder-saddle.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.is_featured && (
            <span className="badge bg-gold-400 text-white text-xs font-semibold">
              Featured
            </span>
          )}
          {discountPercent > 0 && (
            <span className="badge bg-red-500 text-white text-xs font-semibold">
              -{discountPercent}%
            </span>
          )}
          {product.condition === "new" && (
            <span className="badge bg-green-500 text-white text-xs font-semibold">
              New
            </span>
          )}
        </div>

        {/* Actions overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-300">
          <button
            onClick={() => toggleFavorite(product.id)}
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-all duration-200",
              isFav
                ? "bg-red-500 text-white"
                : "bg-white text-gray-700 hover:text-red-500",
            )}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={16} fill={isFav ? "currentColor" : "none"} />
          </button>

          <Link
            href={`/product/${product.slug}`}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-700 hover:text-primary-600 shadow-sm transition-colors"
            aria-label="Quick view"
          >
            <Eye size={16} />
          </Link>
        </div>

        {/* Quick add to cart — bottom overlay on hover */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={() => addToCart(product.id)}
            disabled={cartLoading || product.stock_quantity === 0}
            className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white py-3 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={16} />
            {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {product.category?.name && (
          <span className="text-xs text-gold-500 font-medium uppercase tracking-wider mb-1">
            {product.category.name}
          </span>
        )}

        <Link href={`/product/${product.slug}`} className="group/title flex-1">
          <h3 className="font-serif text-base font-semibold text-gray-900 group-hover/title:text-primary-600 transition-colors line-clamp-2 leading-snug mb-2">
            {product.name}
          </h3>
        </Link>

        {product.brand && (
          <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
        )}

        {/* Rating */}
        {product.review_count > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={
                    i < Math.round(product.avg_rating)
                      ? "fill-gold-400 text-gold-400"
                      : "fill-gray-200 text-gray-200"
                  }
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({product.review_count})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-lg font-bold text-primary-600">
            {formatPrice(product.price)}
          </span>
          {product.compare_price && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.compare_price)}
            </span>
          )}
        </div>

        {product.stock_quantity <= 3 && product.stock_quantity > 0 && (
          <p className="text-xs text-amber-600 mt-1.5 font-medium">
            Only {product.stock_quantity} left in stock
          </p>
        )}
      </div>
    </motion.div>
  );
}
