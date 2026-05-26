"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { formatPrice } from "@/lib/siteConfig";
import Link from "next/link";
import {
  ShoppingBag,
  Users,
  Package,
  DollarSign,
  MessageSquare,
  Mail,
  TrendingUp,
  Clock,
} from "lucide-react";

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  unreadMessages: number;
  newsletterSubscribers: number;
  recentOrders: {
    id: string;
    created_at: string;
    total_amount: number;
    status: string;
    first_name: string;
    last_name: string;
    email: string;
  }[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        {
          icon: DollarSign,
          label: "Total Revenue",
          value: formatPrice(stats.totalRevenue),
          color: "bg-green-500",
          link: "/admin/orders",
        },
        {
          icon: ShoppingBag,
          label: "Total Orders",
          value: stats.totalOrders.toLocaleString(),
          color: "bg-blue-500",
          link: "/admin/orders",
        },
        {
          icon: Clock,
          label: "Pending Orders",
          value: stats.pendingOrders.toLocaleString(),
          color: "bg-yellow-500",
          link: "/admin/orders?status=pending",
        },
        {
          icon: Users,
          label: "Customers",
          value: stats.totalCustomers.toLocaleString(),
          color: "bg-indigo-500",
          link: "/admin/users",
        },
        {
          icon: Package,
          label: "Products",
          value: stats.totalProducts.toLocaleString(),
          color: "bg-purple-500",
          link: "/admin/products",
        },
        {
          icon: MessageSquare,
          label: "Unread Messages",
          value: stats.unreadMessages.toLocaleString(),
          color: "bg-red-500",
          link: "/admin/messages",
        },
        {
          icon: Mail,
          label: "Newsletter Subscribers",
          value: stats.newsletterSubscribers.toLocaleString(),
          color: "bg-teal-500",
          link: "/admin/newsletter",
        },
        {
          icon: TrendingUp,
          label: "Active Products",
          value: stats.totalProducts.toLocaleString(),
          color: "bg-orange-500",
          link: "/admin/products",
        },
      ]
    : [];

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-8">
        Dashboard
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-28 bg-white rounded-2xl shadow-sm animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.link}
              className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div
                className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center mb-3`}
              >
                <card.icon size={20} className="text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-primary-500 hover:underline"
          >
            View all
          </Link>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-10 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                  <th className="px-6 py-3 text-left">Order</th>
                  <th className="px-6 py-3 text-left">Customer</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Total</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="px-6 py-3 font-medium text-gray-900">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {order.first_name} {order.last_name}
                    </td>
                    <td className="px-6 py-3 text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {formatPrice(Number(order.total_amount))}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <Link
                        href={`/admin/orders?id=${order.id}`}
                        className="text-primary-500 hover:underline text-xs"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
