"use client";

import { useEffect, useState, useCallback } from "react";
import api, { getErrorMessage } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/siteConfig";
import { Plus, Search, Edit2, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/products", {
        params: { page, limit: 20, search: search || undefined },
      });
      setProducts(res.data.products);
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

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/products/${id}`);
      showToast("Product deleted", "success");
      load();
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setDeleteId(null);
    }
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    try {
      await api.patch(`/admin/products/${id}`, { is_featured: !featured });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_featured: !featured } : p)),
      );
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl font-bold text-gray-900">
          Products
        </h1>
        <Link
          href="/admin/products/new"
          className="btn-primary flex items-center gap-2 py-2 px-5 text-sm"
        >
          <Plus size={16} /> New Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search products..."
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
                <th className="px-5 py-3 text-left">Product</th>
                <th className="px-5 py-3 text-left">Price</th>
                <th className="px-5 py-3 text-left">Stock</th>
                <th className="px-5 py-3 text-left">Condition</th>
                <th className="px-5 py-3 text-left">Featured</th>
                <th className="px-5 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td colSpan={6} className="px-5 py-3">
                        <div className="h-6 bg-gray-100 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                : products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {product.primary_image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.primary_image}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate max-w-xs">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {product.brand ?? "—"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-medium text-gray-900">
                        {formatPrice(Number(product.price))}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${Number(product.stock_quantity) > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                        >
                          {product.stock_quantity} in stock
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500 capitalize">
                        {product.condition}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() =>
                            handleToggleFeatured(product.id, product.is_featured)
                          }
                          className={`w-9 h-5 rounded-full transition-colors relative ${product.is_featured ? "bg-primary-500" : "bg-gray-200"}`}
                        >
                          <span
                            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${product.is_featured ? "translate-x-4" : "translate-x-0.5"}`}
                          />
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/product/${product.slug}`}
                            target="_blank"
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Eye size={15} />
                          </Link>
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={15} />
                          </Link>
                          <button
                            onClick={() => setDeleteId(product.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
                className="px-3 py-1 rounded-lg text-sm border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded-lg text-sm border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full">
            <h3 className="font-semibold text-gray-900 mb-2">
              Delete Product?
            </h3>
            <p className="text-gray-500 text-sm mb-5">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="btn-secondary flex-1 py-2"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
