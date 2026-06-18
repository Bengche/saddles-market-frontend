"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, Plus } from "lucide-react";
import api, { getErrorMessage } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import type { Category, SaddleCondition, SaddleDiscipline } from "@/types";

const disciplines: SaddleDiscipline[] = [
  "western",
  "english",
  "dressage",
  "jumping",
  "trail",
  "barrel_racing",
  "youth",
  "all_purpose",
];

const conditions: SaddleCondition[] = ["new", "excellent", "good", "fair"];

const STANDARD_SEAT_SIZES = [
  "13\"", "13.5\"", "14\"", "14.5\"", "15\"", "15.5\"",
  "16\"", "16.5\"", "17\"", "17.5\"", "18\"", "18.5\"",
];

/** Reusable tag-input component for multi-value fields */
function TagInput({
  label,
  hint,
  tags,
  onChange,
  presets,
  placeholder,
}: {
  label: string;
  hint?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  presets?: string[];
  placeholder?: string;
}) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
    inputRef.current?.focus();
  };

  const removeTag = (t: string) => onChange(tags.filter((x) => x !== t));

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        {hint && <span className="ml-2 text-xs text-gray-400 font-normal">{hint}</span>}
      </label>
      {/* Preset quick-add chips */}
      {presets && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => addTag(p)}
              disabled={tags.includes(p)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                tags.includes(p)
                  ? "bg-primary-100 border-primary-300 text-primary-600 opacity-50 cursor-not-allowed"
                  : "border-gray-200 text-gray-600 hover:border-primary-400 hover:text-primary-600"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
      {/* Selected tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((t) => (
          <span
            key={t}
            className="flex items-center gap-1 bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1.5 rounded-full border border-primary-200"
          >
            {t}
            <button type="button" onClick={() => removeTag(t)} className="text-primary-400 hover:text-primary-600 ml-0.5">
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      {/* Text input */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag(input);
            }
          }}
          placeholder={placeholder ?? "Type and press Enter to add"}
          className="input-field text-sm flex-1"
        />
        <button
          type="button"
          onClick={() => addTag(input)}
          className="btn-secondary px-3 py-2 text-sm flex items-center gap-1"
        >
          <Plus size={14} /> Add
        </button>
      </div>
    </div>
  );
}

export default function AdminNewProductPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("1");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [discipline, setDiscipline] = useState<SaddleDiscipline>("all_purpose");
  const [condition, setCondition] = useState<SaddleCondition>("new");

  // Variant option arrays
  const [availableSeatSizes, setAvailableSeatSizes] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableTreeSizes, setAvailableTreeSizes] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.get("/products/categories");
        const list: Category[] = res.data?.data?.categories ?? [];
        if (!mounted) return;
        setCategories(list);
        if (list.length) setCategoryId(list[0].id);
      } catch (err) {
        if (mounted) showToast(getErrorMessage(err), "error");
      } finally {
        if (mounted) setLoadingCategories(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [showToast]);

  const canSubmit = useMemo(
    () =>
      name.trim().length > 1 &&
      description.trim().length > 5 &&
      Number(price) > 0,
    [name, description, price],
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      showToast("Please complete required fields.", "error");
      return;
    }

    setSaving(true);
    try {
      await api.post("/admin/products", {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        stockQuantity: Number(stockQuantity || 0),
        brand: brand.trim() || undefined,
        categoryId: categoryId || undefined,
        discipline,
        condition,
        availableSeatSizes,
        availableColors,
        availableTreeSizes,
      });
      showToast("Product created", "success");
      router.push("/admin/products");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-gray-900 sm:text-3xl">
          Add Product
        </h1>
        <Link
          href="/admin/products"
          className="btn-secondary px-4 py-2 text-sm"
        >
          Back
        </Link>
      </div>

      <form
        onSubmit={submit}
        className="rounded-2xl bg-white p-5 shadow-sm sm:p-7"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="input-field"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Price *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Stock *
            </label>
            <input
              type="number"
              min="0"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              className="input-field"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={loadingCategories}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Discipline
            </label>
            <select
              className="input-field"
              value={discipline}
              onChange={(e) =>
                setDiscipline(e.target.value as SaddleDiscipline)
              }
            >
              {disciplines.map((d) => (
                <option key={d} value={d}>
                  {d.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Condition
            </label>
            <select
              className="input-field"
              value={condition}
              onChange={(e) => setCondition(e.target.value as SaddleCondition)}
            >
              {conditions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Brand
            </label>
            <input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        {/* ─── Variant Options ─────────────────────────────────────── */}
        <div className="mt-7 border-t border-gray-100 pt-7 space-y-6">
          <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Variant Options
            <span className="ml-2 text-xs font-normal text-gray-400 normal-case">
              Optional — only shown to buyers when at least one option is added
            </span>
          </p>

          <TagInput
            label="Available Seat Sizes"
            hint="e.g. 15\" 16\" 17\""
            tags={availableSeatSizes}
            onChange={setAvailableSeatSizes}
            presets={STANDARD_SEAT_SIZES}
            placeholder={`e.g. 15.5\" or 16\"`}
          />

          <TagInput
            label="Available Colors"
            hint="e.g. Black, Brown, Tan"
            tags={availableColors}
            onChange={setAvailableColors}
            placeholder="e.g. Dark Oil, Chocolate, Black"
          />

          <TagInput
            label="Tree Sizes"
            hint="e.g. Quarter Horse Bars, Full QH Bars, Arabian Bars"
            tags={availableTreeSizes}
            onChange={setAvailableTreeSizes}
            placeholder="e.g. Quarter Horse Bars"
          />
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/admin/products"
            className="btn-secondary px-5 py-2 text-center text-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || !canSubmit}
            className="btn-primary px-5 py-2 text-sm disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
