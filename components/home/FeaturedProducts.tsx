"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types";
import api from "@/lib/api";

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 skeleton rounded w-1/3" />
        <div className="h-4 skeleton rounded w-3/4" />
        <div className="h-4 skeleton rounded w-1/2" />
        <div className="h-6 skeleton rounded w-1/3" />
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products?featured=true&limit=6")
      .then((res) => setProducts(res.data.data?.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-cream-100">
      <div className="container-custom">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-gold-500 text-sm font-medium tracking-widest uppercase mb-3">
              Handpicked Selection
            </p>
            <h2 className="section-heading font-bold text-primary-500 pb-4">
              Featured Saddles
            </h2>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-2 text-primary-500 font-medium text-sm hover:text-primary-700 group transition-colors"
          >
            View all saddles
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>

        {!loading && products.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-gray-500"
          >
            <p>No featured products at the moment. Check back soon.</p>
          </motion.div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/products" className="btn-primary px-10 py-4 text-base">
            Explore All Saddles
          </Link>
        </div>
      </div>
    </section>
  );
}
