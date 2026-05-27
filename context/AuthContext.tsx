"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import api, { getErrorMessage } from "@/lib/api";
import { User } from "@/types";
import { useToast } from "./ToastContext";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    data: RegisterData,
  ) => Promise<{ requiresVerification: boolean; email: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  newsletter?: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => ({ requiresVerification: true, email: "" }),
  logout: () => {},
  refreshUser: async () => {},
  isAuthenticated: false,
  isAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.data.user);
    } catch {
      setUser(null);
      setToken(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("sm_token");
      }
    }
  }, []);

  // Restore session on mount
  useEffect(() => {
    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("sm_token") : null;
    if (storedToken) {
      setToken(storedToken);
      refreshUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const { token: newToken, user: newUser } = res.data.data;
    localStorage.setItem("sm_token", newToken);
    setToken(newToken);
    setUser(newUser);
    showToast(`Welcome back, ${newUser.first_name}!`, "success");
  };

  const register = async (data: RegisterData) => {
    const res = await api.post("/auth/register", data);
    return { requiresVerification: true, email: data.email };
  };

  const logout = () => {
    localStorage.removeItem("sm_token");
    setToken(null);
    setUser(null);
    showToast("You have been logged out.", "info");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
