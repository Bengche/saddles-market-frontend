"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { BlogPost } from "@/types";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";

function SkeletonBlog() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card">
      <div className="aspect-[16/9] skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-3 skeleton rounded w-1/4" />
        <div className="h-5 skeleton rounded w-4/5" />
        <div className="h-3 skeleton rounded w-full" />
        <div className="h-3 skeleton rounded w-3/4" />
      </div>
    </div>
  );
}

export default function BlogPreviewSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/blog?limit=3")
      .then((res) => setPosts(res.data.data?.posts || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && posts.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-gold-500 text-sm font-medium tracking-widest uppercase mb-3">
              Equestrian Insights
            </p>
            <h2 className="section-heading font-bold text-primary-500 pb-4">
              From the Tack Room Blog
            </h2>
          </div>
          <Link
            href="/blog"
            className="flex items-center gap-2 text-primary-500 font-medium text-sm hover:text-primary-700 group transition-colors"
          >
            All articles
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonBlog key={i} />)
            : posts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300 flex flex-col"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block relative aspect-[16/9] overflow-hidden bg-cream-200 flex-shrink-0"
                  >
                    {post.cover_image ? (
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-100 to-cream-300 flex items-center justify-center">
                        <span className="font-serif text-2xl font-bold text-primary-300">
                          {post.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </Link>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="badge bg-primary-50 text-primary-600">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={12} /> {post.reading_time} min read
                      </span>
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="font-serif text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-sm text-gray-500 line-clamp-2 flex-1 mb-4">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-400">
                        {formatDate(post.published_at)}
                      </span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-xs font-medium text-primary-500 hover:text-primary-700 flex items-center gap-1 group/link"
                      >
                        Read more
                        <ArrowRight
                          size={12}
                          className="group-hover/link:translate-x-0.5 transition-transform"
                        />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
        </div>
      </div>
    </section>
  );
}
