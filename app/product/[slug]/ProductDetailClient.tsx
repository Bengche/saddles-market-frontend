"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Star,
  Shield,
  RotateCcw,
  Truck,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Share2,
  Tag,
} from "lucide-react";
import { Product, Review } from "@/types";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";
import api from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";

interface Props {
  initialProduct: Product;
  slug: string;
}

const CONDITION_LABELS: Record<string, string> = {
  new: "Brand New",
  excellent: "Excellent",
  good: "Good",
  fair: "Fair",
};

export default function ProductDetailClient({ initialProduct, slug }: Props) {
  const [product] = useState<Product>(initialProduct);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    body: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const { addToCart, loading: cartLoading } = useCart();
  const { toggle: toggleFav, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const isFav = isFavorite(product.id);

  const images =
    product.images?.length > 0
      ? product.images
      : [{ url: "/placeholder-saddle.jpg", alt: product.name }];
  const discountPct = product.compare_price
    ? Math.round(
        ((product.compare_price - product.price) / product.compare_price) * 100,
      )
    : 0;

  useEffect(() => {
    api
      .get(`/reviews/product/${product.id}`)
      .then((r) => setReviews(r.data.data?.reviews || []))
      .catch(() => {});
    api
      .get(`/products?category=${product.category_id}&limit=4`)
      .then((r) =>
        setRelatedProducts(
          (r.data.data?.products || [])
            .filter((p: Product) => p.id !== product.id)
            .slice(0, 4),
        ),
      )
      .catch(() => {});
  }, [product.id, product.category_id]);

  const handleAddToCart = () => addToCart(product.id, qty);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast("Please log in to leave a review", "info");
      return;
    }
    setSubmittingReview(true);
    try {
      await api.post("/reviews", { productId: product.id, ...reviewForm });
      showToast("Review submitted — pending approval", "success");
      setReviewForm({ rating: 5, title: "", body: "" });
    } catch {
      showToast("Could not submit review", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  const specRows = [
    { label: "Brand", value: product.brand },
    { label: "Discipline", value: product.discipline?.replace("_", " ") },
    { label: "Condition", value: CONDITION_LABELS[product.condition] },
    { label: "Seat Size", value: product.seat_size },
    { label: "Gullet Width", value: product.gullet_width },
    { label: "Tree Type", value: product.tree_type },
    { label: "Leather Type", value: product.leather_type },
    { label: "Color", value: product.color },
    {
      label: "Weight",
      value: product.weight_kg ? `${product.weight_kg} kg` : null,
    },
    { label: "SKU", value: product.sku },
  ].filter((r) => r.value);

  return (
    <div className="bg-cream-100">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary-600">
              Saddles
            </Link>
            {product.category && (
              <>
                <span>/</span>
                <Link
                  href={`/products?discipline=${product.discipline}`}
                  className="hover:text-primary-600 capitalize"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900 truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-10">
        {/* Main product section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-card">
              <Image
                src={images[activeImage]?.url || "/placeholder-saddle.jpg"}
                alt={images[activeImage]?.alt || product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImage(
                        (p) => (p + images.length - 1) % images.length,
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-sm text-gray-700 hover:bg-white"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImage((p) => (p + 1) % images.length)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-sm text-gray-700 hover:bg-white"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              {discountPct > 0 && (
                <span className="absolute top-3 left-3 badge bg-red-500 text-white font-semibold">
                  -{discountPct}%
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-thin pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? "border-primary-500 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <Image
                      src={img.url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.category && (
              <Link
                href={`/products?discipline=${product.discipline}`}
                className="text-xs text-gold-500 font-semibold uppercase tracking-widest hover:text-gold-600 block mb-2"
              >
                {product.category.name}
              </Link>
            )}

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary-900 mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating summary */}
            {product.review_count > 0 && (
              <div className="flex items-center gap-3 mb-5">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.round(product.avg_rating)
                          ? "fill-gold-400 text-gold-400"
                          : "fill-gray-200 text-gray-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {product.avg_rating.toFixed(1)}
                </span>
                <a
                  href="#reviews"
                  className="text-sm text-primary-500 hover:underline"
                >
                  ({product.review_count} reviews)
                </a>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-primary-600">
                {formatPrice(product.price)}
              </span>
              {product.compare_price && (
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.compare_price)}
                </span>
              )}
            </div>

            {product.short_description && (
              <p className="text-gray-600 leading-relaxed mb-6">
                {product.short_description}
              </p>
            )}

            {/* Condition badge */}
            <div className="flex items-center gap-2 mb-6">
              <span
                className={`badge text-sm ${product.condition === "new" ? "bg-green-100 text-green-700" : "bg-gold-50 text-gold-700"}`}
              >
                {CONDITION_LABELS[product.condition]}
              </span>
              {product.brand && (
                <span className="badge bg-primary-50 text-primary-600 text-sm">
                  {product.brand}
                </span>
              )}
            </div>

            {/* Stock */}
            {product.stock_quantity > 0 ? (
              <div className="flex items-center gap-2 mb-6 text-sm text-green-700">
                <CheckCircle size={16} className="text-green-500" />
                {product.stock_quantity <= 5
                  ? `Only ${product.stock_quantity} left in stock`
                  : "In stock — ships within 1-2 business days"}
              </div>
            ) : (
              <p className="text-red-600 font-medium mb-6 text-sm">
                Out of stock
              </p>
            )}

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-50 text-lg"
                >
                  −
                </button>
                <span className="px-5 py-3 font-semibold text-gray-900 min-w-[50px] text-center">
                  {qty}
                </span>
                <button
                  onClick={() =>
                    setQty((q) => Math.min(product.stock_quantity, q + 1))
                  }
                  className="px-4 py-3 text-gray-600 hover:bg-gray-50 text-lg"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={cartLoading || product.stock_quantity === 0}
                className="btn-primary flex-1 py-4 text-base disabled:opacity-60"
              >
                <ShoppingCart size={20} />
                {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
              </button>

              <button
                onClick={() => toggleFav(product.id)}
                className={`p-4 rounded-lg border transition-all ${isFav ? "border-red-300 bg-red-50 text-red-500" : "border-gray-200 bg-white text-gray-500 hover:border-red-300 hover:text-red-500"}`}
              >
                <Heart size={20} fill={isFav ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Trust features */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Shield, text: "30-Day Trial" },
                { icon: RotateCcw, text: "Free Returns" },
                { icon: Truck, text: `Free Shipping $${require("@/lib/siteConfig").SITE_CONFIG.shipping.freeShippingThreshold}+` },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-gray-100 text-center"
                >
                  <Icon size={18} className="text-primary-500" />
                  <span className="text-xs text-gray-600 leading-tight">
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Share */}
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                showToast("Link copied!", "success");
              }}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mt-5 transition-colors"
            >
              <Share2 size={15} /> Share this saddle
            </button>
          </div>
        </div>

        {/* Description & Specs tabs */}
        <div className="bg-white rounded-2xl shadow-card p-8 mb-10">
          <h2 className="font-serif text-2xl font-bold text-primary-500 mb-6">
            Description
          </h2>
          <div
            className="prose-luxury max-w-none"
            dangerouslySetInnerHTML={{
              __html: product.description.replace(/\n/g, "<br/>"),
            }}
          />

          {specRows.length > 0 && (
            <>
              <h3 className="font-serif text-xl font-bold text-primary-500 mt-10 mb-5">
                Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {specRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center gap-3 py-3 px-4 bg-cream-100 rounded-lg"
                  >
                    <Tag size={14} className="text-gold-400 flex-shrink-0" />
                    <span className="text-sm text-gray-500 w-28 flex-shrink-0">
                      {row.label}
                    </span>
                    <span className="text-sm font-medium text-gray-800 capitalize">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Reviews */}
        <div
          id="reviews"
          className="bg-white rounded-2xl shadow-card p-8 mb-10"
        >
          <h2 className="font-serif text-2xl font-bold text-primary-500 mb-6">
            Reviews ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <p className="text-gray-500 text-sm mb-8">
              No reviews yet. Be the first to share your experience.
            </p>
          ) : (
            <div className="space-y-6 mb-8">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex gap-0.5 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < r.rating
                                ? "fill-gold-400 text-gold-400"
                                : "fill-gray-200 text-gray-200"
                            }
                          />
                        ))}
                      </div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {r.first_name} {r.last_name?.charAt(0)}.
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">
                        {new Date(r.created_at).toLocaleDateString()}
                      </p>
                      {r.is_verified && (
                        <span className="badge bg-green-50 text-green-700 text-xs mt-1">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                  {r.title && (
                    <p className="font-medium text-gray-800 mb-1">{r.title}</p>
                  )}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {r.body}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Review form */}
          <div className="border-t border-gray-100 pt-8">
            <h3 className="font-serif text-lg font-semibold mb-5">
              Write a Review
            </h3>
            {!isAuthenticated ? (
              <p className="text-sm text-gray-500">
                <Link
                  href="/account/login"
                  className="text-primary-500 underline"
                >
                  Sign in
                </Link>{" "}
                to leave a review.
              </p>
            ) : (
              <form
                onSubmit={handleSubmitReview}
                className="space-y-4 max-w-lg"
              >
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setReviewForm((f) => ({ ...f, rating }))}
                        className="focus:outline-none"
                      >
                        <Star
                          size={28}
                          className={
                            rating <= reviewForm.rating
                              ? "fill-gold-400 text-gold-400"
                              : "fill-gray-200 text-gray-200"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Review Title
                  </label>
                  <input
                    value={reviewForm.title}
                    onChange={(e) =>
                      setReviewForm((f) => ({ ...f, title: e.target.value }))
                    }
                    placeholder="Summarize your experience"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Your Review
                  </label>
                  <textarea
                    value={reviewForm.body}
                    onChange={(e) =>
                      setReviewForm((f) => ({ ...f, body: e.target.value }))
                    }
                    required
                    rows={4}
                    placeholder="Tell other riders about your experience with this saddle..."
                    className="input-field resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="btn-primary disabled:opacity-60"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-primary-500 mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
