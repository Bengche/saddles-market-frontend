'use client';

import { useEffect, useState, useCallback } from 'react';
import api, { getErrorMessage } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  is_published: boolean;
  created_at: string;
  author_name: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/blog', { params: { limit: 50 } });
      setPosts(res.data.posts);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/blog/${id}`);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      showToast('Post deleted', 'success');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const togglePublish = async (post: BlogPost) => {
    try {
      await api.patch(`/admin/blog/${post.id}`, { is_published: !post.is_published });
      setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, is_published: !post.is_published } : p));
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl font-bold text-gray-900">Blog Posts</h1>
        <Link href="/admin/blog/new" className="btn-primary flex items-center gap-2 py-2 px-5 text-sm">
          <Plus size={16} /> New Post
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3 text-left">Title</th>
                <th className="px-5 py-3 text-left">Category</th>
                <th className="px-5 py-3 text-left">Author</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-left">Published</th>
                <th className="px-5 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td colSpan={6} className="px-5 py-3"><div className="h-6 bg-gray-100 rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : posts.map((post) => (
                <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900 max-w-xs truncate">{post.title}</td>
                  <td className="px-5 py-3 text-gray-500 capitalize">{post.category}</td>
                  <td className="px-5 py-3 text-gray-500">{post.author_name}</td>
                  <td className="px-5 py-3 text-gray-400">{new Date(post.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => togglePublish(post)} className={`w-9 h-5 rounded-full transition-colors relative ${post.is_published ? 'bg-green-500' : 'bg-gray-200'}`}>
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${post.is_published ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/blog/${post.slug}`} target="_blank" className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><Eye size={15} /></Link>
                      <Link href={`/admin/blog/${post.id}/edit`} className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg"><Edit2 size={15} /></Link>
                      <button onClick={() => setDeleteId(post.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full">
            <h3 className="font-semibold text-gray-900 mb-2">Delete Post?</h3>
            <p className="text-gray-500 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 py-2">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium text-sm transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
