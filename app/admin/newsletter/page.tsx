"use client";

import { useEffect, useState, useCallback } from "react";
import api, { getErrorMessage } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { Users, Send, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface Subscriber {
  id: string;
  email: string;
  first_name?: string;
  is_active: boolean;
  subscribed_at: string;
}

const broadcastSchema = z.object({
  subject: z.string().min(3, "Required"),
  content: z.string().min(20, "Minimum 20 characters"),
});

type BroadcastFormData = z.infer<typeof broadcastSchema>;

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BroadcastFormData>({ resolver: zodResolver(broadcastSchema) });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/newsletter", {
        params: { page, limit: 30, search: search || undefined },
      });
      setSubscribers(res.data.subscribers);
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

  const sendBroadcast = async (data: BroadcastFormData) => {
    try {
      await api.post("/admin/newsletter/broadcast", data);
      showToast("Newsletter broadcast sent!", "success");
      reset();
      setBroadcastOpen(false);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  };

  const totalPages = Math.ceil(total / 30);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Newsletter
          </h1>
          {!loading && (
            <p className="text-gray-500 text-sm mt-0.5">
              {total.toLocaleString()} subscribers
            </p>
          )}
        </div>
        <button
          onClick={() => setBroadcastOpen(true)}
          className="btn-primary flex items-center gap-2 py-2 px-5 text-sm"
        >
          <Send size={16} /> Send Broadcast
        </button>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search subscribers..."
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
                <th className="px-5 py-3 text-left">Email</th>
                <th className="px-5 py-3 text-left">Name</th>
                <th className="px-5 py-3 text-left">Subscribed</th>
                <th className="px-5 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td colSpan={4} className="px-5 py-3">
                        <div className="h-6 bg-gray-100 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                : subscribers.map((sub) => (
                    <tr
                      key={sub.id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="px-5 py-3 text-gray-700">{sub.email}</td>
                      <td className="px-5 py-3 text-gray-500">
                        {sub.first_name ?? "—"}
                      </td>
                      <td className="px-5 py-3 text-gray-400">
                        {new Date(sub.subscribed_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${sub.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                        >
                          {sub.is_active ? "Active" : "Unsubscribed"}
                        </span>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              {(page - 1) * 30 + 1}–{Math.min(page * 30, total)} of {total}
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

      {/* Broadcast Modal */}
      {broadcastOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-lg">
            <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">
              Send Newsletter Broadcast
            </h3>
            <p className="text-gray-500 text-sm mb-5">
              This will be sent to all active subscribers (
              {total.toLocaleString()}).
            </p>
            <form onSubmit={handleSubmit(sendBroadcast)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  {...register("subject")}
                  className="input-field"
                  placeholder="Your weekly saddle digest"
                />
                {errors.subject && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.subject.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content (HTML or plain text) *
                </label>
                <textarea
                  {...register("content")}
                  rows={8}
                  className="input-field resize-none font-mono text-xs"
                  placeholder="<p>Hello,</p><p>Here are this week's highlights...</p>"
                />
                {errors.content && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.content.message}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setBroadcastOpen(false)}
                  className="btn-secondary flex-1 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex-1 py-2 flex items-center justify-center gap-2"
                >
                  <Send size={15} /> {isSubmitting ? "Sending..." : "Send Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
