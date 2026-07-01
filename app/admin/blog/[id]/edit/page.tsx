"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Upload, Loader2 } from "lucide-react";
import api, { getErrorMessage } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

const CATEGORIES = [
  "Saddle Guides",
  "Saddle Care",
  "Disciplines",
  "Buying Advice",
  "Equine Health",
  "General",
];

export default function AdminEditBlogPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [coverImage, setCoverImage] = useState("");
  const [readingTime, setReadingTime] = useState("5");
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    let mounted = true;
    api
      .get(`/admin/blog/${params.id}`)
      .then((res) => {
        if (!mounted) return;
        const p = res.data.post;
        setTitle(p.title ?? "");
        setSlug(p.slug ?? "");
        setExcerpt(p.excerpt ?? "");
        setContent(p.content ?? "");
        setCategory(p.category ?? CATEGORIES[0]);
        setCoverImage(p.cover_image ?? "");
        setReadingTime(String(p.reading_time ?? 5));
        setIsPublished(p.is_published ?? false);
      })
      .catch((err) => showToast(getErrorMessage(err), "error"))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [params.id, showToast]);

  const handleCoverUpload = async (files: FileList | null) => {
    if (!files?.[0]) return;
    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("image", files[0]);
      const res = await api.post("/upload/blog", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCoverImage(res.data.data.url);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setUploadingCover(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast("Title and content are required.", "error");
      return;
    }
    setSaving(true);
    try {
      await api.patch(`/admin/blog/${params.id}`, {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        category,
        coverImage: coverImage || undefined,
        readingTime: Number(readingTime) || 5,
        isPublished,
      });
      showToast("Post updated", "success");
      router.push("/admin/blog");
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
          Edit Blog Post
        </h1>
        <Link href="/admin/blog" className="btn-secondary px-4 py-2 text-sm">
          Back
        </Link>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-7 space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Title *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Slug
                <span className="ml-2 text-xs text-gray-400 font-normal">Edit with care — changes URL</span>
              </label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} className="input-field font-mono text-sm" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
              <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Reading Time (minutes)</label>
              <input
                type="number"
                min="1"
                value={readingTime}
                onChange={(e) => setReadingTime(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Excerpt
                <span className="ml-2 text-xs text-gray-400 font-normal">Short summary shown in listings</span>
              </label>
              <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="input-field" />
            </div>
          </div>

          {/* Cover image */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Cover Image</label>
            {coverImage ? (
              <div className="relative rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverImage} alt="Cover" className="w-full max-h-56 object-cover rounded-xl" />
                <button
                  type="button"
                  onClick={() => setCoverImage("")}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-full px-3 py-1 text-xs shadow transition-colors"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 cursor-pointer transition-colors ${
                  uploadingCover ? "border-primary-300 bg-primary-50" : "border-gray-200 hover:border-primary-400 hover:bg-gray-50"
                }`}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleCoverUpload(e.target.files)}
                />
                {uploadingCover ? (
                  <Loader2 size={24} className="animate-spin text-primary-500" />
                ) : (
                  <Upload size={24} className="text-gray-400" />
                )}
                <p className="text-sm text-gray-500">{uploadingCover ? "Uploading…" : "Click to upload cover image"}</p>
              </label>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
          <label className="mb-2 block text-sm font-medium text-gray-700">Content *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            className="input-field font-mono text-sm"
            placeholder="Write your article here… HTML is supported."
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 accent-primary-500"
            />
            <span className="text-sm text-gray-700">Published</span>
          </label>
          <Link href="/admin/blog" className="btn-secondary px-5 py-2 text-center text-sm">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-primary px-5 py-2 text-sm disabled:opacity-50">
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
