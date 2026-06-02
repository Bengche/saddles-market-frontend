"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import api, { getErrorMessage } from "@/lib/api";
import { Cart, CartItem } from "@/types";
import { useToast } from "./ToastContext";

interface CartContextType {
  cart: Cart;
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const defaultCart: Cart = { items: [], subtotal: 0, item_count: 0 };

const CartContext = createContext<CartContextType>({
  cart: defaultCart,
  loading: false,
  addToCart: async () => {},
  updateItem: async () => {},
  removeItem: async () => {},
  clearCart: async () => {},
  refreshCart: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(defaultCart);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // Ensure session id exists
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !localStorage.getItem("sm_session_id")
    ) {
      localStorage.setItem("sm_session_id", crypto.randomUUID());
    }
  }, []);

  // Only fetch cart if session id exists
  const refreshCart = useCallback(async () => {
    if (typeof window === "undefined") return;
    const sessionId = localStorage.getItem("sm_session_id");
    if (!sessionId) return;
    try {
      const res = await api.get("/cart", {
        headers: { "x-session-id": sessionId },
      });
      setCart(res.data.data);
    } catch {
      // silently fail — cart stays at default
    }
  }, []);

  // Only fetch cart on mount if session id exists and only on cart-related pages
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sessionId = localStorage.getItem("sm_session_id");
    const cartPages = ["/cart", "/checkout", "/products", "/product/"];
    if (
      sessionId &&
      cartPages.some((p) => window.location.pathname.startsWith(p))
    ) {
      refreshCart();
    }
  }, [refreshCart]);

  const addToCart = async (productId: string, quantity = 1) => {
    setLoading(true);
    try {
      await api.post("/cart/add", { productId, quantity });
      await refreshCart();
      showToast("Item added to cart", "success");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId: string, quantity: number) => {
    setLoading(true);
    try {
      await api.put(`/cart/item/${itemId}`, { quantity });
      await refreshCart();
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    setLoading(true);
    try {
      await api.delete(`/cart/item/${itemId}`);
      await refreshCart();
      showToast("Item removed from cart", "success");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await api.delete("/cart/clear");
      setCart(defaultCart);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateItem,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
