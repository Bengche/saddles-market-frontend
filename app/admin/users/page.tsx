"use client";

import { useEffect, useState, useCallback } from "react";
import api, { getErrorMessage } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { Search, ShieldCheck, ShieldOff, User } from "lucide-react";

interface AdminUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users", {
        params: { page, limit: 20, search: search || undefined },
      });
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleActive = async (id: string, current: boolean) => {
    try {
      await api.patch(`/admin/users/${id}`, { is_active: !current });
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, is_active: !current } : u)),
      );
      showToast(`User ${!current ? "activated" : "deactivated"}`, "success");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  };

  const toggleAdmin = async (id: string, currentRole: string) => {
    const makeAdmin = currentRole !== "admin";
    try {
      await api.patch(`/admin/users/${id}`, { is_admin: makeAdmin });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, role: makeAdmin ? "admin" : "customer" } : u,
        ),
      );
      showToast(`Admin status ${makeAdmin ? "granted" : "revoked"}`, "success");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-6">
        Users
      </h1>

      <div className="relative mb-6 max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="input-field pl-9 text-sm"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3 text-left">User</th>
                <th className="px-5 py-3 text-left">Email</th>
                <th className="px-5 py-3 text-left">Joined</th>
                <th className="px-5 py-3 text-left">Active</th>
                <th className="px-5 py-3 text-left">Admin</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td colSpan={5} className="px-5 py-3">
                        <div className="h-6 bg-gray-100 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                : users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <User size={14} className="text-primary-500" />
                          </div>
                          <span className="font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{user.email}</td>
                      <td className="px-5 py-3 text-gray-400">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => toggleActive(user.id, user.is_active)}
                          title={user.is_active ? "Deactivate" : "Activate"}
                          className={`w-9 h-5 rounded-full transition-colors relative ${user.is_active ? "bg-green-500" : "bg-gray-200"}`}
                        >
                          <span
                            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${user.is_active ? "translate-x-4" : "translate-x-0.5"}`}
                          />
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => toggleAdmin(user.id, user.role)}
                          title={user.role === "admin" ? "Revoke admin" : "Grant admin"}
                          className={`p-1.5 rounded-lg transition-colors ${user.role === "admin" ? "bg-gold-100 text-gold-600 hover:bg-gold-200" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}
                        >
                          {user.role === "admin" ? (
                            <ShieldCheck size={16} />
                          ) : (
                            <ShieldOff size={16} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of{" "}
              {total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded-lg text-sm border border-gray-200 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded-lg text-sm border border-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
