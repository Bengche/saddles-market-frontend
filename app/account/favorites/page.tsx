'use client';

import { useEffect, useState } from 'react';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Loader2 } from 'lucide-react';
import api, { getErrorMessage } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/siteConfig';
import type { Product } from '@/types';

export default function FavoritesPage() {
  const { favorites, toggle } = useFavorites();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/account/login?redirect=/account/favorites');
      return;
    }
    loadFavorites();
  }, [isAuthenticated]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const res = await api.get('/favorites');
      setProducts(res.data.favorites ?? []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (product: Product) => {
    await toggle(product.id);
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    toast({ type: 'info', message: `${product.name} removed from favorites` });
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id, 1);
      toast({ type: 'success', message: 'Added to cart' });
    } catch (err) {
      toast({ type: 'error', message: getErrorMessage(err) });
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-cream-100 py-10">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-4xl font-bold text-primary-500">My Favorites</h1>
          {products.length > 0 && (
            <span className="text-gray-500 text-sm">{products.length} {products.length === 1 ? 'item' : 'items'}</span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-primary-300" />
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-card p-16 text-center">
            <Heart size={48} className="text-gray-200 mx-auto mb-5" />
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3">No favorites yet</h2>
            <p className="text-gray-500 mb-8">Browse our collection and tap the heart icon to save saddles you love.</p>
            <Link href="/products" className="btn-primary inline-flex">Browse Saddles</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-card overflow-hidden group hover:shadow-luxury transition-shadow duration-300">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-cream-100">
                  <Link href={`/product/${product.slug}`}>
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl font-serif">S</div>
                    )}
                  </Link>
                  {/* Remove from favorites */}
                  <button
                    onClick={() => handleRemove(product)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center group/btn hover:bg-red-50 transition-colors"
                    aria-label="Remove from favorites"
                  >
                    <Heart size={16} className="text-red-500 fill-red-500" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4">
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-primary-500 transition-colors line-clamp-2 mb-1 leading-snug">{product.name}</h3>
                  </Link>
                  {product.brand && <p className="text-xs text-gray-400 mb-2">{product.brand}</p>}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-primary-500">{formatPrice(Number(product.price))}</span>
                      {product.compare_price && Number(product.compare_price) > Number(product.price) && (
                        <span className="text-xs text-gray-400 line-through ml-2">{formatPrice(Number(product.compare_price))}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-3 w-full btn-secondary py-2 text-sm flex items-center justify-center gap-2 group/btn"
                  >
                    <ShoppingCart size={15} className="group-hover/btn:scale-110 transition-transform" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
