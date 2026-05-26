'use client';

import { useEffect, useState, useCallback } from 'react';
import api, { getErrorMessage } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/siteConfig';
import { Search, Eye, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  shipping_method: string;
  first_name: string;
  last_name: string;
  email: string;
  tracking_number?: string;
}

const STATUSES = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/orders', {
        params: { page, limit: 20, status: status === 'all' ? undefined : status, search: search || undefined },
      });
      setOrders(res.data.orders);
      setTotal(res.data.total);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [page, status, search]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      await api.patch(`/admin/orders/${orderId}`, { status: newStatus });
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
      toast({ type: 'success', message: `Order status updated to "${newStatus}"` });
    } catch (err) {
      toast({ type: 'error', message: getErrorMessage(err) });
    } finally {
      setUpdating(null);
    }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-6">Orders</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-9 text-sm w-64"
          />
        </div>
        <div className="flex gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors ${status === s ? 'bg-primary-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3 text-left">Order ID</th>
                <th className="px-5 py-3 text-left">Customer</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-left">Total</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Update Status</th>
                <th className="px-5 py-3 text-left">Tracking</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td colSpan={7} className="px-5 py-3"><div className="h-6 bg-gray-100 rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-xs text-gray-600">#{order.id.slice(0, 8)}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">{order.first_name} {order.last_name}</p>
                    <p className="text-xs text-gray-400">{order.email}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3 font-medium text-gray-900">{formatPrice(Number(order.total_amount))}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="relative">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        disabled={updating === order.id}
                        className="appearance-none pl-3 pr-7 py-1 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary-300 cursor-pointer disabled:opacity-50"
                      >
                        {STATUSES.filter((s) => s !== 'all').map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-400 font-mono">{order.tracking_number ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">Showing {((page - 1) * 20) + 1}–{Math.min(page * 20, total)} of {total}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded-lg text-sm border border-gray-200 disabled:opacity-50 hover:bg-gray-50">Prev</button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded-lg text-sm border border-gray-200 disabled:opacity-50 hover:bg-gray-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
