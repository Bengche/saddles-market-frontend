"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { X, Plus, Upload, Star, Loader2 } from "lucide-react";
import Image from "next/image";
import api, { getErrorMessage } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import type { Category, SaddleCondition, SaddleDiscipline } from "@/types";

interface UploadedImage {
  cloudinaryId: string;
  url: string;
  altText: string;
  isPrimary: boolean;
}

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
  '13"', '13.5"', '14"', '14.5"', '15"', '15.5"',
  '16"', '16.5"', '17"', '17.5"', '18"', '18.5"',
];

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
    if (trimmed && !tags.includes(trimmed)) onChange([...tags, trimmed]);
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
      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(input); }
          }}
          placeholder={placeholder ?? "Type and press Enter to add"}
          className="input-field text-sm flex-1"
        />
        <button type="button" onClick={() => addTag(input)} className="btn-secondary px-3 py-2 text-sm flex items-center gap-1">
          <Plus size={14} /> Add
        </button>
      </div>
    </div>
  );
}

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("0");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [discipline, setDiscipline] = useState<SaddleDiscipline>("all_purpose");
  const [condition, setCondition] = useState<SaddleCondition>("new");
  const [availableSeatSizes, setAvailableSeatSizes] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableTreeSizes, setAvailableTreeSizes] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [productRes, catRes] = await Promise.all([
          api.get(`/admin/products/${params.id}`),
          api.get("/products/categories"),
        ]);

        if (!mounted) return;

        const p = productRes.data.product;
        setName(p.name ?? "");
        setDescription(p.description ?? "");
        setPrice(String(p.price ?? ""));
        setStockQuantity(String(p.stock_quantity ?? 0));
        setBrand(p.brand ?? "");
        setCategoryId(p.category_id ?? "");
        setDiscipline((p.discipline as SaddleDiscipline) ?? "all_purpose");
        setCondition((p.condition as SaddleCondition) ?? "new");
        setAvailableSeatSizes(p.available_seat_sizes ?? []);
        setAvailableColors(p.available_colors ?? []);
        setAvailableTreeSizes(p.available_tree_sizes ?? []);
        setUploadedImages(
          (p.images ?? []).map(
            (img: { cloudinary_id: string; url: string; alt_text: string; is_primary: boolean }) => ({
              cloudinaryId: img.cloudinary_id,
              url: img.url,
              altText: img.alt_text ?? "",
              isPrimary: img.is_primary,
            }),
          ),
        );

        const cats: Category[] = catRes.data?.data?.categories ?? [];
        setCategories(cats);
      } catch (err) {
        if (mounted) showToast(getErrorMessage(err), "error");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [params.id, showToast]);

  const handleImageFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = 10 - uploadedImages.length;
    if (remaining <= 0) { showToast("Maximum of 10 images allowed.", "error"); return; }
    const fileArray = Array.from(files).slice(0, remaining);
    setUploading(true);
    try {
      const formData = new FormData();
      fileArray.forEach((file) => formData.append("images", file));
      const res = await api.post("/upload/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const incoming: { cloudinaryId: string; url: string; altText: string }[] =
        res.data?.data?.images ?? [];
      setUploadedImages((prev) => {
        const isFirstBatch = prev.length === 0;
        return [
          ...prev,
          ...incoming.map((img, idx) => ({
            ...img,
            isPrimary: isFirstBatch && idx === 0,
          })),
        ];
      });
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = async (index: number) => {
    const img = uploadedImages[index];
    try { await api.delete(`/upload/${encodeURIComponent(img.cloudinaryId)}`); } catch { /* non-critical */ }
    setUploadedImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (img.isPrimary && next.length > 0) next[0] = { ...next[0], isPrimary: true };
      return next;
    });
  };

  const setPrimaryImage = (index: number) =>
    setUploadedImages((prev) => prev.map((img, i) => ({ ...img, isPrimary: i === index })));

  const canSubmit = useMemo(
    () => name.trim().length > 1 && description.trim().length > 5 && Number(price) > 0,
    [name, description, price],
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) { showToast("Please complete required fields.", "error"); return; }

    setSaving(true);
    try {
      await api.patch(`/admin/products/${params.id}`, {
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
        images: uploadedImages.map(({ cloudinaryId, url, altText, isPrimary }) => ({
          cloudinaryId,
          url,
          altText,
          isPrimary,
        })),
      });
      showToast("Product updated", "success");
      router.push("/admin/products");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-gray-900 sm:text-3xl">
          Edit Product
        </h1>
        <Link href="/admin/products" className="btn-secondary px-4 py-2 text-sm">
          Back
        </Link>
      </div>

      <form onSubmit={submit} className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="input-field"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Price *</label>
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
            <label className="mb-1 block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              min="0"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
            <select
              className="input-field"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Discipline</label>
            <select
              className="input-field"
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value as SaddleDiscipline)}
            >
              {disciplines.map((d) => (
                <option key={d} value={d}>{d.replace("_", " ")}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Condition</label>
            <select
              className="input-field"
              value={condition}
              onChange={(e) => setCondition(e.target.value as SaddleCondition)}
            >
              {conditions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Brand</label>
            <input value={brand} onChange={(e) => setBrand(e.target.value)} className="input-field" />
          </div>
        </div>

        {/* ─── Variant Options ──────────────────────────────────────── */}
        <div className="mt-7 border-t border-gray-100 pt-7 space-y-6">
          <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Variant Options
            <span className="ml-2 text-xs font-normal text-gray-400 normal-case">
              Optional — only shown to buyers when at least one option is added
            </span>
          </p>

          <TagInput
            label="Available Seat Sizes"
            hint='e.g. 15" 16" 17"'
            tags={availableSeatSizes}
            onChange={setAvailableSeatSizes}
            presets={STANDARD_SEAT_SIZES}
            placeholder='e.g. 15.5" or 16"'
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

        {/* ─── Images ───────────────────────────────────────────────── */}
        <div className="mt-7 border-t border-gray-100 pt-7 space-y-5">
          <div>
            <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Product Images
              <span className="ml-2 text-xs font-normal text-gray-400 normal-case">
                Up to 10 images — stored on Cloudinary
              </span>
            </p>
            <p className="mt-1 text-xs text-gray-400">
              JPEG, PNG, or WebP · Max 10 MB each. The image marked{" "}
              <span className="font-medium text-amber-600">Main</span> will be the primary listing photo.
            </p>
          </div>

          {/* Upload zone */}
          <div
            className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 transition-colors ${
              uploading
                ? "border-primary-300 bg-primary-50"
                : "border-gray-200 hover:border-primary-400 hover:bg-gray-50 cursor-pointer"
            }`}
            onClick={() => !uploading && fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleImageFiles(e.dataTransfer.files); }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => handleImageFiles(e.target.files)}
            />
            {uploading ? (
              <Loader2 size={28} className="animate-spin text-primary-500" />
            ) : (
              <Upload size={28} className="text-gray-400" />
            )}
            <p className="text-sm text-gray-500">
              {uploading ? "Uploading…" : "Click to select or drag & drop images here"}
            </p>
            {uploadedImages.length > 0 && !uploading && (
              <p className="text-xs text-gray-400">{uploadedImages.length} / 10 uploaded</p>
            )}
          </div>

          {/* Preview grid */}
          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {uploadedImages.map((img, idx) => (
                <div
                  key={img.cloudinaryId}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                    img.isPrimary ? "border-amber-400 shadow-md" : "border-gray-200"
                  }`}
                >
                  <div className="aspect-square relative bg-gray-50">
                    <Image
                      src={img.url}
                      alt={img.altText || `Product image ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>

                  {img.isPrimary && (
                    <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-amber-400 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow">
                      <Star size={9} fill="white" />
                      Main
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1.5 right-1.5 bg-white/80 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-full p-1 shadow transition-colors"
                    aria-label="Remove image"
                  >
                    <X size={12} />
                  </button>

                  {!img.isPrimary && (
                    <button
                      type="button"
                      onClick={() => setPrimaryImage(idx)}
                      className="absolute bottom-0 left-0 right-0 bg-black/50 hover:bg-black/70 text-white text-[11px] font-medium py-1.5 transition-colors"
                    >
                      Set as Main
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── Submit ────────────────────────────────────────────────── */}
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link href="/admin/products" className="btn-secondary px-5 py-2 text-center text-sm">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || !canSubmit}
            className="btn-primary px-5 py-2 text-sm disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
