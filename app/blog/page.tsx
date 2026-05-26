'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, ChevronRight, Search } from 'lucide-react';
import { BlogPost } from '@/types';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Metadata } from 'next';

const CATEGORIES = ['All', 'Saddle Guides', 'Saddle Care', 'Disciplines', 'Buying Advice', 'Equine Health'];

function BlogSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card animate-pulse">
      <div className="aspect-[16/9] bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-5 bg-gray-200 rounded w-4/5" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '9' });
    if (activeCategory !== 'All') params.set('category', activeCategory);
    api.get(`/blog?${params.toString()}`)
      .then((r) => {
        setPosts(r.data.data?.posts || []);
        setTotalPages(r.data.data?.pagination?.pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, activeCategory]);

  const filtered = search
    ? posts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase()))
    : posts;

  return (
    <div className="bg-cream-100 min-h-screen">
      {/* Header */}
      <div className="bg-primary-500 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%"><pattern id="p2" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M0 20h40M20 0v40" stroke="white" strokeWidth="0.5"/></pattern><rect width="100%" height="100%" fill="url(#p2)"/></svg>
        </div>
        <div className="container-custom relative z-10 text-center">
          <p className="text-gold-400 text-sm font-medium tracking-widest uppercase mb-4">Knowledge Hub</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">The Tack Room Blog</h1>
          <p className="text-white/70 max-w-xl mx-auto text-lg">
            Expert guides, saddle care tips, and equestrian insights from our team of riders.
          </p>

          {/* Search */}
          <div className="relative max-w-lg mx-auto mt-8">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-12 pr-5 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400 text-sm shadow-luxury"
            />
          </div>
        </div>
      </div>

      <div className="container-custom py-10">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-600 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 9 }).map((_, i) => <BlogSkeleton key={i} />)
            : filtered.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow flex flex-col"
                >
                  <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-cream-200 flex-shrink-0">
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
                        <span className="font-serif text-3xl font-bold text-primary-200">{post.title.charAt(0)}</span>
                      </div>
                    )}
                  </Link>

                  <div className="flex flex-col flex-1 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="badge bg-primary-50 text-primary-600 text-xs">{post.category}</span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={12} /> {post.read_time} min read
                      </span>
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="font-serif text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2 leading-snug">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="text-sm text-gray-500 line-clamp-2 flex-1 mb-4">{post.excerpt}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                      <span className="text-xs text-gray-400">{formatDate(post.published_at)}</span>
                      <Link href={`/blog/${post.slug}`} className="flex items-center gap-1 text-xs font-medium text-primary-500 hover:text-primary-700 transition-colors">
                        Read More <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="font-serif text-xl text-gray-600">No articles found</p>
            <p className="text-gray-400 text-sm mt-2">Try a different search term or category.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                  page === i + 1 ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 hover:bg-primary-50 border border-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
