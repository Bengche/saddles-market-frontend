"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import api, { getErrorMessage } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/siteConfig";
import {
  Search,
  Eye,
  ChevronDown,
  X,
  Mail,
  MapPin,
  Package,
  Loader2,
  User,
  CreditCard,
} from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  total: number;
  total_amount: number;
  status: string;
  shipping_method: string;
  first_name: string;
  last_name: string;
  email: string;
  tracking_number?: string;
}

interface OrderItem {
  id: string;
  product_name: string;
  product_image?: string;
  seat_size?: string;
  selected_color?: string;
  selected_tree_size?: string;
  price: number;
  quantity: number;
  total: number;
}

interface OrderDetail {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  payment_status: string;
  payment_method?: string;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  total: number;
  coupon_code?: string;
  shipping_method: string;
  tracking_number?: string;
  customer_notes?: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone?: string;
  ship_street_line1: string;
  ship_street_line2?: string;
  ship_city: string;
  ship_state: string;
  ship_zip: string;
  ship_country: string;
}

const STATUSES = [
  "all",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const PAYMENT_LABELS: Record<string, string> = {
  bank_transfer: "Bank Transfer",
  zelle: "Zelle",
  crypto: "Cryptocurrency",
};

function formatPaymentMethod(pm?: string) {
  if (!pm) return "Bank Transfer";
  return (
    PAYMENT_LABELS[pm] ??
    pm.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
}

// ─── Order Detail Drawer ──────────────────────────────────────────────────────

function OrderDetailDrawer({
  orderId,
  onClose,
}: {
  orderId: string;
  onClose: () => void;
}) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get(`/admin/orders/${orderId}`)
      .then((res) => {
        if (!cancelled) {
          setOrder(res.data.order);
          setItems(res.data.items);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const mailtoLink = useMemo(() => {
    if (!order) return "#";
    const name = `${order.customer_first_name} ${order.customer_last_name}`;
    const paymentLabel = formatPaymentMethod(order.payment_method);
    const date = new Date(order.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const itemsList = items
      .map(
        (i) =>
          `  - ${i.product_name}${i.seat_size ? ` (Seat ${i.seat_size}")` : ""}${i.selected_color ? ` / ${i.selected_color}` : ""} x${i.quantity} — $${parseFloat(String(i.total)).toFixed(2)}`,
      )
      .join("\n");

    const subject = `Re: Your Order #${order.order_number} — Saddles Market`;
    const body = [
      `Dear ${name},`,
      ``,
      `Thank you for your order #${order.order_number} placed on ${date}.`,
      ``,
      `To complete your purchase, please send your ${paymentLabel} payment of $${parseFloat(String(order.total)).toFixed(2)} to our team. Once we confirm receipt, your order will be processed and shipped promptly.`,
      ``,
      `Order Summary:`,
      itemsList,
      ``,
      `Subtotal:  $${parseFloat(String(order.subtotal)).toFixed(2)}`,
      parseFloat(String(order.discount_amount)) > 0
        ? `Discount:  -$${parseFloat(String(order.discount_amount)).toFixed(2)}`
        : null,
      `Shipping:  $${parseFloat(String(order.shipping_cost)).toFixed(2)}`,
      `Total:     $${parseFloat(String(order.total)).toFixed(2)}`,
      ``,
      `If you have any questions, simply reply to this email — we are here to help.`,
      ``,
      `Warm regards,`,
      `Saddles Market Team`,
      `support@saddlesmarket.com`,
      `+1 (914) 432-9936`,
    ]
      .filter((l) => l !== null)
      .join("\n");

    return `mailto:${order.customer_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [order, items]);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-xl bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-primary-500">
          <div>
            <p className="text-xs text-white/70 uppercase tracking-widest">
              Order Notification
            </p>
            <h2 className="text-lg font-bold text-white font-serif">
              {order ? `#${order.order_number}` : "Loading…"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 size={28} className="animate-spin text-primary-400" />
            </div>
          ) : order ? (
            <div className="p-6 space-y-6">
              {/* Status row */}
              <div className="flex flex-wrap items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm">
                <span className="text-amber-700 font-medium">Payment:</span>
                <span className="capitalize text-amber-800 font-semibold">
                  {order.payment_status}
                </span>
                <span className="ml-auto text-amber-700 font-medium">
                  Order:
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}
                >
                  {order.status}
                </span>
              </div>

              {/* Customer */}
              <section>
                <SectionHeading icon={<User size={14} />} title="Customer Details" />
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <Row
                    label="Name"
                    value={`${order.customer_first_name} ${order.customer_last_name}`}
                  />
                  <Row
                    label="Email"
                    value={
                      <a
                        href={`mailto:${order.customer_email}`}
                        className="text-primary-600 font-medium hover:underline"
                      >
                        {order.customer_email}
                      </a>
                    }
                  />
                  {order.customer_phone && (
                    <Row
                      label="Phone"
                      value={
                        <a
                          href={`tel:${order.customer_phone}`}
                          className="text-primary-600 hover:underline"
                        >
                          {order.customer_phone}
                        </a>
                      }
                    />
                  )}
                  <Row
                    label="Placed On"
                    value={new Date(order.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  />
                </div>
              </section>

              {/* Payment */}
              <section>
                <SectionHeading icon={<CreditCard size={14} />} title="Payment" />
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <Row
                    label="Method"
                    value={
                      <span className="font-semibold text-primary-700">
                        {formatPaymentMethod(order.payment_method)}
                      </span>
                    }
                  />
                  {order.coupon_code && (
                    <Row
                      label="Coupon"
                      value={
                        <span className="font-mono text-green-700">
                          {order.coupon_code}
                        </span>
                      }
                    />
                  )}
                </div>
              </section>

              {/* Items */}
              <section>
                <SectionHeading icon={<Package size={14} />} title="Items Ordered" />
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-primary-500 text-white text-xs uppercase tracking-wide">
                        <th className="px-4 py-2.5 text-left font-medium">
                          Product
                        </th>
                        <th className="px-4 py-2.5 text-center font-medium">
                          Qty
                        </th>
                        <th className="px-4 py-2.5 text-right font-medium">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, i) => (
                        <tr
                          key={item.id}
                          className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <td className="px-4 py-3 text-gray-800">
                            <p className="font-medium">{item.product_name}</p>
                            {(item.seat_size ||
                              item.selected_color ||
                              item.selected_tree_size) && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {[
                                  item.seat_size && `Seat ${item.seat_size}"`,
                                  item.selected_color,
                                  item.selected_tree_size &&
                                    `Tree: ${item.selected_tree_size}`,
                                ]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-600">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-primary-700">
                            ${parseFloat(String(item.total)).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Pricing */}
              <section>
                <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 space-y-2 text-sm">
                  <SummaryRow
                    label="Subtotal"
                    value={`$${parseFloat(String(order.subtotal)).toFixed(2)}`}
                  />
                  {parseFloat(String(order.discount_amount)) > 0 && (
                    <SummaryRow
                      label={`Discount${order.coupon_code ? ` (${order.coupon_code})` : ""}`}
                      value={`-$${parseFloat(String(order.discount_amount)).toFixed(2)}`}
                      className="text-green-700"
                    />
                  )}
                  <SummaryRow
                    label={`Shipping (${order.shipping_method})`}
                    value={
                      parseFloat(String(order.shipping_cost)) === 0
                        ? "Free"
                        : `$${parseFloat(String(order.shipping_cost)).toFixed(2)}`
                    }
                  />
                  <div className="border-t border-primary-200 pt-2">
                    <SummaryRow
                      label="Order Total"
                      value={`$${parseFloat(String(order.total)).toFixed(2)}`}
                      bold
                    />
                  </div>
                </div>
              </section>

              {/* Shipping address */}
              <section>
                <SectionHeading icon={<MapPin size={14} />} title="Shipping Address" />
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">
                  <p>
                    {order.customer_first_name} {order.customer_last_name}
                  </p>
                  <p>{order.ship_street_line1}</p>
                  {order.ship_street_line2 && <p>{order.ship_street_line2}</p>}
                  <p>
                    {order.ship_city}, {order.ship_state} {order.ship_zip}
                  </p>
                  <p>{order.ship_country}</p>
                </div>
              </section>

              {order.customer_notes && (
                <section>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Customer Notes
                  </p>
                  <p className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-gray-700 italic">
                    {order.customer_notes}
                  </p>
                </section>
              )}
            </div>
          ) : (
            <p className="p-6 text-sm text-gray-400">
              Could not load order details.
            </p>
          )}
        </div>

        {/* Footer */}
        {order && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-400 mb-3">
              Opens your email client — sends directly from your inbox, bypassing automated email.
            </p>
            <a
              href={mailtoLink}
              className="flex items-center justify-center gap-2 w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              <Mail size={16} />
              Reply to Customer via Email
            </a>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionHeading({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <h3 className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
      {icon}
      {title}
    </h3>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="w-24 shrink-0 text-gray-400">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  bold,
  className,
}: {
  label: string;
  value: string;
  bold?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex justify-between ${bold ? "font-bold text-primary-700 text-base" : "text-gray-600"} ${className ?? ""}`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [detailOrderId, setDetailOrderId] = useState<string | null>(null);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/orders", {
        params: {
          page,
          limit: 20,
          status: status === "all" ? undefined : status,
          search: search || undefined,
        },
      });
      setOrders(res.data.orders);
      setTotal(res.data.total);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      await api.patch(`/admin/orders/${orderId}`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
      showToast(`Order status updated to "${newStatus}"`, "success");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setUpdating(null);
    }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="p-8">
      {detailOrderId && (
        <OrderDetailDrawer
          orderId={detailOrderId}
          onClose={() => setDetailOrderId(null)}
        />
      )}

      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-6">
        Orders
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="input-field pl-9 text-sm w-64"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors ${status === s ? "bg-primary-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"}`}
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
                <th className="px-5 py-3 text-left">Order</th>
                <th className="px-5 py-3 text-left">Customer</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-left">Total</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Update Status</th>
                <th className="px-5 py-3 text-left">Tracking</th>
                <th className="px-5 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td colSpan={8} className="px-5 py-3">
                        <div className="h-6 bg-gray-100 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                : orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="px-5 py-3 font-mono text-xs text-gray-600">
                        {order.order_number
                          ? `#${order.order_number}`
                          : `#${order.id.slice(0, 8)}`}
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900">
                          {order.first_name} {order.last_name}
                        </p>
                        <p className="text-xs text-gray-400">{order.email}</p>
                      </td>
                      <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 font-medium text-gray-900">
                        {formatPrice(Number(order.total_amount))}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateStatus(order.id, e.target.value)
                            }
                            disabled={updating === order.id}
                            className="appearance-none pl-3 pr-7 py-1 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary-300 cursor-pointer disabled:opacity-50"
                          >
                            {STATUSES.filter((s) => s !== "all").map((s) => (
                              <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={12}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          />
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-400 font-mono">
                        {order.tracking_number ?? "—"}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => setDetailOrderId(order.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors"
                        >
                          <Eye size={13} />
                          View
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
    </div>
  );
}

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

const STATUSES = [
  "all",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/orders", {
        params: {
          page,
          limit: 20,
          status: status === "all" ? undefined : status,
          search: search || undefined,
        },
      });
      setOrders(res.data.orders);
      setTotal(res.data.total);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      await api.patch(`/admin/orders/${orderId}`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
      showToast(`Order status updated to "${newStatus}"`, "success");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setUpdating(null);
    }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-6">
        Orders
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="input-field pl-9 text-sm w-64"
          />
        </div>
        <div className="flex gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors ${status === s ? "bg-primary-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"}`}
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
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td colSpan={7} className="px-5 py-3">
                        <div className="h-6 bg-gray-100 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                : orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="px-5 py-3 font-mono text-xs text-gray-600">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900">
                          {order.first_name} {order.last_name}
                        </p>
                        <p className="text-xs text-gray-400">{order.email}</p>
                      </td>
                      <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 font-medium text-gray-900">
                        {formatPrice(Number(order.total_amount))}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateStatus(order.id, e.target.value)
                            }
                            disabled={updating === order.id}
                            className="appearance-none pl-3 pr-7 py-1 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary-300 cursor-pointer disabled:opacity-50"
                          >
                            {STATUSES.filter((s) => s !== "all").map((s) => (
                              <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={12}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          />
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-400 font-mono">
                        {order.tracking_number ?? "—"}
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
    </div>
  );
}
