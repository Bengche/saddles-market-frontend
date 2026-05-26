'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api, { getErrorMessage } from '@/lib/api';
import { CheckCircle } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Please enter a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

const SUBJECTS = [
  'Saddle Selection Help',
  'Order Status / Tracking',
  'Returns & Trial Policy',
  'Saddle Fitting',
  'Wholesale Inquiry',
  'Other',
];

export default function ContactClient() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/contact', data);
      setSent(true);
    } catch (err) {
      setError('root', { message: getErrorMessage(err) });
    }
  };

  if (sent) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-10 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={30} className="text-green-500" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-primary-500 mb-3">Message Sent!</h3>
        <p className="text-gray-500 leading-relaxed">Thanks for reaching out. Our team will get back to you within 1 business day.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-card p-8">
      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {(errors as { root?: { message?: string } }).root?.message && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{(errors as { root?: { message?: string } }).root?.message}</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
            <input {...register('name')} className="input-field" placeholder="Jane Smith" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" {...register('email')} className="input-field" placeholder="you@example.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
            <input type="tel" {...register('phone')} className="input-field" placeholder="+1 (555) 000-0000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
            <select {...register('subject')} className="input-field">
              <option value="">Select a topic...</option>
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
          <textarea
            {...register('message')}
            rows={5}
            placeholder="Tell us how we can help..."
            className="input-field resize-none"
          />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5">
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
