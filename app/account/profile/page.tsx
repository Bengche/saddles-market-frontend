'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import api, { getErrorMessage } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, MapPin, Lock, Plus, Trash2, Edit2, Eye, EyeOff } from 'lucide-react';
import type { Address } from '@/types';

const profileSchema = z.object({
  first_name: z.string().min(1, 'Required'),
  last_name: z.string().min(1, 'Required'),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword: z.string().min(8, 'Minimum 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

const addressSchema = z.object({
  label: z.string().optional(),
  street: z.string().min(3, 'Required'),
  city: z.string().min(2, 'Required'),
  state: z.string().min(2, 'Required'),
  zip_code: z.string().min(3, 'Required'),
  country: z.string().min(2, 'Required'),
  is_default: z.boolean().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;
type AddressFormData = z.infer<typeof addressSchema>;

type Tab = 'profile' | 'security' | 'addresses';

export default function ProfilePage() {
  const { user, refreshUser, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('profile');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.push('/account/login?redirect=/account/profile');
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (tab === 'addresses') loadAddresses();
  }, [tab]);

  const loadAddresses = async () => {
    try {
      const res = await api.get('/auth/addresses');
      setAddresses(res.data.addresses ?? []);
    } catch {
      // ignore
    }
  };

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { first_name: user?.first_name ?? '', last_name: user?.last_name ?? '', phone: user?.phone ?? '' },
  });

  const passwordForm = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });
  const addressForm = useForm<AddressFormData>({ resolver: zodResolver(addressSchema), defaultValues: { country: 'United States' } });

  const saveProfile = async (data: ProfileFormData) => {
    try {
      await api.put('/auth/profile', data);
      await refreshUser();
      toast({ type: 'success', message: 'Profile updated successfully' });
    } catch (err) { toast({ type: 'error', message: getErrorMessage(err) }); }
  };

  const changePassword = async (data: PasswordFormData) => {
    try {
      await api.put('/auth/change-password', { currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast({ type: 'success', message: 'Password changed successfully' });
      passwordForm.reset();
    } catch (err) { toast({ type: 'error', message: getErrorMessage(err) }); }
  };

  const saveAddress = async (data: AddressFormData) => {
    try {
      if (editingAddress) {
        await api.put(`/auth/addresses/${editingAddress.id}`, data);
      } else {
        await api.post('/auth/addresses', data);
      }
      await loadAddresses();
      setAddressModalOpen(false);
      setEditingAddress(null);
      addressForm.reset();
      toast({ type: 'success', message: editingAddress ? 'Address updated' : 'Address added' });
    } catch (err) { toast({ type: 'error', message: getErrorMessage(err) }); }
  };

  const deleteAddress = async (id: string) => {
    try {
      await api.delete(`/auth/addresses/${id}`);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast({ type: 'success', message: 'Address deleted' });
    } catch (err) { toast({ type: 'error', message: getErrorMessage(err) }); }
  };

  const openEditAddress = (address: Address) => {
    setEditingAddress(address);
    addressForm.reset({ label: address.label ?? '', street: address.street, city: address.city, state: address.state, zip_code: address.zip_code, country: address.country, is_default: address.is_default });
    setAddressModalOpen(true);
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'Personal Info', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-cream-100 py-10">
      <div className="container-custom max-w-4xl">
        <h1 className="font-serif text-4xl font-bold text-primary-500 mb-8">My Account</h1>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-card mb-8">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.id ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-card p-7">
            <h2 className="font-serif text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
            <form onSubmit={profileForm.handleSubmit(saveProfile)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input {...profileForm.register('first_name')} className="input-field" />
                  {profileForm.formState.errors.first_name && <p className="text-red-500 text-xs mt-1">{profileForm.formState.errors.first_name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input {...profileForm.register('last_name')} className="input-field" />
                  {profileForm.formState.errors.last_name && <p className="text-red-500 text-xs mt-1">{profileForm.formState.errors.last_name.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={user.email} readOnly className="input-field bg-gray-50 cursor-not-allowed" />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" {...profileForm.register('phone')} className="input-field" placeholder="+1 (555) 000-0000" />
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={profileForm.formState.isSubmitting} className="btn-primary px-8">
                  {profileForm.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {tab === 'security' && (
          <div className="bg-white rounded-2xl shadow-card p-7">
            <h2 className="font-serif text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
            <form onSubmit={passwordForm.handleSubmit(changePassword)} className="space-y-5 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password *</label>
                <div className="relative">
                  <input type={showCurrentPw ? 'text' : 'password'} {...passwordForm.register('currentPassword')} className="input-field pr-10" />
                  <button type="button" onClick={() => setShowCurrentPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showCurrentPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordForm.formState.errors.currentPassword && <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.currentPassword.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password *</label>
                <div className="relative">
                  <input type={showNewPw ? 'text' : 'password'} {...passwordForm.register('newPassword')} className="input-field pr-10" />
                  <button type="button" onClick={() => setShowNewPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showNewPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordForm.formState.errors.newPassword && <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.newPassword.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password *</label>
                <input type="password" {...passwordForm.register('confirmPassword')} className="input-field" />
                {passwordForm.formState.errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>}
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={passwordForm.formState.isSubmitting} className="btn-primary px-8">
                  {passwordForm.formState.isSubmitting ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses Tab */}
        {tab === 'addresses' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl font-semibold text-gray-900">Saved Addresses</h2>
              <button onClick={() => { setEditingAddress(null); addressForm.reset({ country: 'United States' }); setAddressModalOpen(true); }} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
                <Plus size={16} /> Add Address
              </button>
            </div>
            {addresses.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-card p-10 text-center">
                <MapPin size={36} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No addresses saved yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div key={addr.id} className="bg-white rounded-2xl shadow-card p-5 relative">
                    {addr.is_default && <span className="absolute top-4 right-4 badge badge-gold text-xs">Default</span>}
                    {addr.label && <p className="font-semibold text-gray-900 mb-1">{addr.label}</p>}
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {addr.street}<br />{addr.city}, {addr.state} {addr.zip_code}<br />{addr.country}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => openEditAddress(addr)} className="flex items-center gap-1.5 text-sm text-primary-500 hover:underline">
                        <Edit2 size={14} /> Edit
                      </button>
                      <button onClick={() => deleteAddress(addr.id)} className="flex items-center gap-1.5 text-sm text-red-500 hover:underline ml-3">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Address Modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setAddressModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-xl font-semibold text-gray-900 mb-5">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
            <form onSubmit={addressForm.handleSubmit(saveAddress)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label (Optional)</label>
                <input {...addressForm.register('label')} placeholder="Home, Office..." className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                <input {...addressForm.register('street')} className="input-field" />
                {addressForm.formState.errors.street && <p className="text-red-500 text-xs mt-1">{addressForm.formState.errors.street.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input {...addressForm.register('city')} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input {...addressForm.register('state')} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                  <input {...addressForm.register('zip_code')} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <input {...addressForm.register('country')} className="input-field" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isDefault" {...addressForm.register('is_default')} className="w-4 h-4 accent-primary-500" />
                <label htmlFor="isDefault" className="text-sm text-gray-600 cursor-pointer">Set as default address</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setAddressModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={addressForm.formState.isSubmitting} className="btn-primary flex-1">
                  {addressForm.formState.isSubmitting ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
