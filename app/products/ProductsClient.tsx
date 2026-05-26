'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, GridIcon, List, Search } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { Product, ProductFilters } from '@/types';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';

const DISCIPLINES = ['western', 'english', 'dressage', 'jumping', 'trail', 'barrel_racing', 'youth', 'all_purpose'];
const CONDITIONS = ['new', 'excellent', 'good', 'fair'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name_asc', label: 'Name A-Z' },
];

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-6 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filters: ProductFilters = {
    search: searchParams.get('search') || '',
    discipline: searchParams.get('discipline') || '',
    condition: searchParams.get('condition') || '',
    minPrice: Number(searchParams.get('minPrice') || 0),
    maxPrice: Number(searchParams.get('maxPrice') || 0),
    sort: (searchParams.get('sort') as ProductFilters['sort']) || 'newest',
    page: Number(searchParams.get('page') || 1),
    limit: 12,
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, String(v)); });
      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data.data?.products || []);
      setTotal(res.data.data?.pagination?.total || 0);
      setTotalPages(res.data.data?.pagination?.pages || 1);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, [searchParams]); // eslint-disable-line

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.delete('page'); // reset page on filter change
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => router.push('/products');

  const hasActiveFilters = filters.discipline || filters.condition || filters.search || filters.minPrice || filters.maxPrice;

  return (
    <div className="bg-cream-100 min-h-screen">
      {/* Page header */}
      <div className="bg-primary-500 py-14 md:py-20">
        <div className="container-custom">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
            Horse Saddles
          </h1>
          <p className="text-white/70 text-lg max-w-lg">
            {total > 0 ? `${total.toLocaleString()} saddles available` : 'Browse our complete collection'}
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 btn-secondary text-sm py-2.5"
            >
              <SlidersHorizontal size={16} />
              Filters
              {hasActiveFilters && <span className="w-2 h-2 bg-gold-400 rounded-full" />}
            </button>

            {/* Search */}
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                defaultValue={filters.search}
                onKeyDown={(e) => { if (e.key === 'Enter') setParam('search', (e.target as HTMLInputElement).value); }}
                placeholder="Search saddles..."
                className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none w-64"
              />
            </div>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700">
                <X size={14} /> Clear filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative">
              <select
                value={filters.sort}
                onChange={(e) => setParam('sort', e.target.value)}
                className="pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:border-primary-300 outline-none appearance-none cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* View mode */}
            <div className="hidden sm:flex gap-1 border border-gray-200 rounded-lg p-0.5 bg-white">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                <GridIcon size={16} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter drawer */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white rounded-2xl shadow-card p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {/* Discipline */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Discipline</p>
                    <div className="space-y-2">
                      {DISCIPLINES.map((d) => (
                        <label key={d} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="discipline"
                            checked={filters.discipline === d}
                            onChange={() => setParam('discipline', filters.discipline === d ? '' : d)}
                            className="text-primary-500"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-primary-600 capitalize">{d.replace('_', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Condition */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Condition</p>
                    <div className="space-y-2">
                      {CONDITIONS.map((c) => (
                        <label key={c} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="condition"
                            checked={filters.condition === c}
                            onChange={() => setParam('condition', filters.condition === c ? '' : c)}
                            className="text-primary-500"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-primary-600 capitalize">{c}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price range */}
                  <div className="md:col-span-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Price Range</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Min Price</label>
                        <input
                          type="number"
                          min={0}
                          placeholder="$0"
                          defaultValue={filters.minPrice || ''}
                          onBlur={(e) => setParam('minPrice', e.target.value)}
                          className="input-field text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Max Price</label>
                        <input
                          type="number"
                          min={0}
                          placeholder="No limit"
                          defaultValue={filters.maxPrice || ''}
                          onBlur={(e) => setParam('maxPrice', e.target.value)}
                          className="input-field text-sm"
                        />
                      </div>
                    </div>
                    {(filters.minPrice || filters.maxPrice) && (
                      <p className="text-xs text-primary-500 mt-2">
                        {filters.minPrice ? formatPrice(filters.minPrice) : '$0'} — {filters.maxPrice ? formatPrice(filters.maxPrice) : 'Any'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif text-2xl text-gray-600 mb-4">No saddles found</p>
            <p className="text-gray-400 mb-8">Try adjusting your filters or search terms.</p>
            <button onClick={clearFilters} className="btn-primary">Clear all filters</button>
          </div>
        ) : (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'flex flex-col gap-4'
          }>
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setParam('page', String(page))}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    filters.page === page
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 shadow-sm border border-gray-200'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
