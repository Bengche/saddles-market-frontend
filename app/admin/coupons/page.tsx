"use client";

import { useEffect, useState, useCallback } from "react";
import api, { getErrorMessage } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/siteConfig";
import { Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface Coupon {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  minimum_order?: number;
  maximum_discount?: number;
  times_used: number;
  usage_limit?: number;
  valid_until?: string;
  is_active: boolean;
}

const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 chars")
    .max(20)
    .toUpperCase(),
  discount_type: z.enum(["percentage", "fixed"]),
  discount_value: z.coerce.number().min(0.01, "Required"),
  min_order_amount: z.coerce.number().optional(),
  usage_limit: z.coerce.number().optional(),
  expires_at: z.string().optional(),
});

type CouponFormData = z.infer<typeof couponSchema>;

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: { discount_type: "percentage" },
  });

  const discountType = watch("discount_type");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/coupons");
      setCoupons(res.data.coupons);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createCoupon = async (data: CouponFormData) => {
    try {
      await api.post("/admin/coupons", data);
      showToast("Coupon created", "success");
      reset();
      setCreating(false);
      load();
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      await api.delete(`/admin/coupons/${id}`);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      showToast("Coupon deleted", "success");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setDeleteId(null);
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      await api.patch(`/admin/coupons/${id}`, { is_active: !current });
      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? { ...c, is_active: !current } : c)),
      );
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl font-bold text-gray-900">Coupons</h1>
        <button
          onClick={() => setCreating(true)}
          className="btn-primary flex items-center gap-2 py-2 px-5 text-sm"
        >
          <Plus size={16} /> New Coupon
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3 text-left">Code</th>
                <th className="px-5 py-3 text-left">Discount</th>
                <th className="px-5 py-3 text-left">Min Order</th>
                <th className="px-5 py-3 text-left">Usage</th>
                <th className="px-5 py-3 text-left">Expires</th>
                <th className="px-5 py-3 text-left">Active</th>
                <th className="px-5 py-3 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td colSpan={7} className="px-5 py-3">
                        <div className="h-6 bg-gray-100 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                : coupons.map((coupon) => (
                    <tr
                      key={coupon.id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="px-5 py-3 font-mono font-semibold text-gray-900">
                        {coupon.code}
                      </td>
                      <td className="px-5 py-3 font-medium text-green-600">
                        {coupon.discount_type === "percentage"
                          ? `${coupon.discount_value}%`
                          : formatPrice(coupon.discount_value)}
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        {coupon.minimum_order
                          ? formatPrice(coupon.minimum_order)
                          : "—"}
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        {coupon.times_used}
                        {coupon.usage_limit ? ` / ${coupon.usage_limit}` : ""}
                      </td>
                      <td className="px-5 py-3 text-gray-400">
                        {coupon.valid_until
                          ? new Date(coupon.valid_until).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() =>
                            toggleActive(coupon.id, coupon.is_active)
                          }
                          className={`w-9 h-5 rounded-full transition-colors relative ${coupon.is_active ? "bg-green-500" : "bg-gray-200"}`}
                        >
                          <span
                            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${coupon.is_active ? "translate-x-4" : "translate-x-0.5"}`}
                          />
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => setDeleteId(coupon.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-md">
            <h3 className="font-serif text-xl font-semibold text-gray-900 mb-5">
              Create Coupon
            </h3>
            <form onSubmit={handleSubmit(createCoupon)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code *
                </label>
                <input
                  {...register("code")}
                  className="input-field font-mono"
                  placeholder="SUMMER20"
                />
                {errors.code && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.code.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <select
                    {...register("discount_type")}
                    className="input-field"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Value * ({discountType === "percentage" ? "%" : "$"})
                  </label>
                  <input
                    type="number"
                    step={discountType === "percentage" ? "1" : "0.01"}
                    {...register("discount_value")}
                    className="input-field"
                  />
                  {errors.discount_value && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.discount_value.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Order ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("min_order_amount")}
                    className="input-field"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    {...register("usage_limit")}
                    className="input-field"
                    placeholder="Unlimited"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expires At
                </label>
                <input
                  type="date"
                  {...register("expires_at")}
                  className="input-field"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreating(false)}
                  className="btn-secondary flex-1 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex-1 py-2"
                >
                  {isSubmitting ? "Creating..." : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full">
            <h3 className="font-semibold text-gray-900 mb-2">Delete Coupon?</h3>
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
                onClick={() => deleteCoupon(deleteId)}
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
