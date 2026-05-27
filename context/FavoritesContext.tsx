"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import api, { getErrorMessage } from "@/lib/api";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

interface FavoritesContextType {
  favorites: Set<string>;
  loading: boolean;
  toggle: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: new Set(),
  loading: false,
  toggle: async () => {},
  isFavorite: () => false,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites(new Set());
      return;
    }
    try {
      const res = await api.get("/favorites");
      const ids = res.data.data.favorites.map(
        (f: { product_id: string }) => f.product_id,
      );
      setFavorites(new Set(ids));
    } catch {
      /* silent */
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggle = async (productId: string) => {
    if (!isAuthenticated) {
      showToast("Please log in to save favorites", "info");
      return;
    }
    setLoading(true);
    const isFav = favorites.has(productId);
    // Optimistic update
    setFavorites((prev) => {
      const next = new Set(prev);
      isFav ? next.delete(productId) : next.add(productId);
      return next;
    });
    try {
      if (isFav) {
        await api.delete(`/favorites/${productId}`);
        showToast("Removed from favorites", "success");
      } else {
        await api.post("/favorites", { productId });
        showToast("Added to favorites", "success");
      }
    } catch (err) {
      // Revert
      setFavorites((prev) => {
        const next = new Set(prev);
        isFav ? next.add(productId) : next.delete(productId);
        return next;
      });
      showToast(getErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        toggle,
        isFavorite: (id) => favorites.has(id),
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
