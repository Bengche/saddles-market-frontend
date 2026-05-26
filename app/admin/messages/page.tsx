'use client';

import { useEffect, useState, useCallback } from 'react';
import api, { getErrorMessage } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { MessageSquare, CheckCheck, Trash2, ChevronDown } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/messages', { params: { unread: filter === 'unread' ? true : undefined, limit: 50 } });
      setMessages(res.data.messages ?? []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const markRead = async (id: string) => {
    try {
      await api.patch(`/admin/messages/${id}`, { is_read: true });
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, is_read: true } : m));
    } catch (err) {
      toast({ type: 'error', message: getErrorMessage(err) });
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await api.delete(`/admin/messages/${id}`);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast({ type: 'success', message: 'Message deleted' });
    } catch (err) {
      toast({ type: 'error', message: getErrorMessage(err) });
    }
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => prev === id ? null : id);
    const msg = messages.find((m) => m.id === id);
    if (msg && !msg.is_read) markRead(id);
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Contact Messages</h1>
          {unreadCount > 0 && <p className="text-sm text-red-500 mt-0.5">{unreadCount} unread</p>}
        </div>
        <div className="flex gap-2">
          {(['all', 'unread'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-xl text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>{f}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse shadow-sm" />)}
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-14 text-center">
          <MessageSquare size={36} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg) => (
            <div key={msg.id} className={`bg-white rounded-2xl shadow-sm overflow-hidden ${!msg.is_read ? 'border-l-4 border-primary-500' : ''}`}>
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpand(msg.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`font-medium text-sm ${!msg.is_read ? 'text-gray-900' : 'text-gray-600'}`}>{msg.name}</span>
                    <span className="text-gray-400 text-xs">·</span>
                    <span className="text-gray-400 text-xs">{msg.email}</span>
                    {!msg.is_read && <span className="w-2 h-2 bg-primary-500 rounded-full" />}
                  </div>
                  <p className="text-sm text-gray-700 font-medium truncate">{msg.subject}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(msg.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!msg.is_read && (
                    <button onClick={(e) => { e.stopPropagation(); markRead(msg.id); }} className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg" title="Mark as read">
                      <CheckCheck size={15} />
                    </button>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 size={15} />
                  </button>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${expanded === msg.id ? 'rotate-180' : ''}`} />
                </div>
              </div>
              {expanded === msg.id && (
                <div className="px-5 pb-5 border-t border-gray-50">
                  <p className="text-gray-600 leading-relaxed mt-4 text-sm whitespace-pre-wrap">{msg.message}</p>
                  {msg.phone && <p className="text-xs text-gray-400 mt-3">Phone: {msg.phone}</p>}
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    className="inline-flex items-center gap-2 mt-4 text-sm text-primary-500 hover:underline font-medium"
                  >
                    Reply by email
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
