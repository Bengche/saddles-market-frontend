'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { SITE_CONFIG, formatPrice, isFreeShipping } from '@/lib/siteConfig';
import api, { getErrorMessage } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronRight, Lock, Tag, Truck, Zap, CheckCircle } from 'lucide-react';

const addressSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(7, 'Invalid phone'),
  street: z.string().min(5, 'Required'),
  city: z.string().min(2, 'Required'),
  state: z.string().min(2, 'Required'),
  zipCode: z.string().min(3, 'Required'),
  country: z.string().min(2, 'Required'),
});

const checkoutSchema = z.object({
  shipping: addressSchema,
  billingSameAsShipping: z.boolean(),
  billing: addressSchema.optional(),
  shippingMethod: z.enum(['standard', 'express', 'free']),
  paymentMethod: z.enum(['card', 'paypal', 'bank_transfer']),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const SHIPPING_OPTIONS = [
  { id: 'standard', label: 'Standard Shipping', desc: '5–8 business days', price: SITE_CONFIG.shipping.standardRate },
  { id: 'express', label: 'Express Shipping', desc: '1–3 business days', price: SITE_CONFIG.shipping.expressRate },
];

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const subtotal = cart?.items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0) ?? 0;
  const freeShip = isFreeShipping(subtotal);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shipping: {
        firstName: user?.first_name ?? '',
        lastName: user?.last_name ?? '',
        email: user?.email ?? '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
      },
      billingSameAsShipping: true,
      shippingMethod: freeShip ? 'free' : 'standard',
      paymentMethod: 'card',
    },
  });

  const billingSame = watch('billingSameAsShipping');
  const shippingMethod = watch('shippingMethod');

  const shippingCost = freeShip ? 0 : shippingMethod === 'express' ? SITE_CONFIG.shipping.expressRate : SITE_CONFIG.shipping.standardRate;
  const total = subtotal + shippingCost - couponDiscount;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await api.post('/cart/apply-coupon', { code: couponCode, subtotal });
      setCouponDiscount(res.data.discount);
      showToast(`Coupon applied! You saved ${formatPrice(res.data.discount)}`, 'success');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setCouponLoading(false);
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (!cart?.items.length) {
      showToast('Your cart is empty', 'error');
      return;
    }
    setPlacingOrder(true);
    try {
      const payload = {
        shipping_address: data.shipping,
        billing_address: data.billingSameAsShipping ? data.shipping : data.billing,
        shipping_method: freeShip ? 'free' : data.shippingMethod,
        payment_method: data.paymentMethod,
        coupon_code: couponCode || undefined,
        notes: data.notes,
      };
      const res = await api.post('/orders', payload);
      await clearCart();
      setOrderId(res.data.order.id);
      setSuccess(true);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-6xl font-serif text-primary-200 mb-4">Empty</p>
          <h2 className="font-serif text-2xl font-bold text-primary-500 mb-3">No items to checkout</h2>
          <p className="text-gray-500 mb-6">Add some saddles to your cart first.</p>
          <Link href="/products" className="btn-primary">Shop Saddles</Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-card p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-primary-500 mb-3">Order Placed!</h1>
          <p className="text-gray-600 mb-2">Thank you for your order. We&apos;ve sent a confirmation to your email.</p>
          {orderId && <p className="text-sm text-gray-400 mb-6">Order #{orderId}</p>}
          <div className="flex flex-col gap-3">
            <Link href="/account/orders" className="btn-primary">View My Orders</Link>
            <Link href="/products" className="btn-secondary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 py-10">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/cart" className="hover:text-primary-500">Cart</Link>
          <ChevronRight size={14} />
          <span className="text-gray-600 font-medium">Checkout</span>
        </nav>

        <h1 className="font-serif text-4xl font-bold text-primary-500 mb-10">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT — Forms */}
            <div className="lg:col-span-2 space-y-8">

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-card p-7">
                <h2 className="font-serif text-xl font-semibold text-gray-900 mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input {...register('shipping.firstName')} className="input-field" />
                    {errors.shipping?.firstName && <p className="text-red-500 text-xs mt-1">{errors.shipping.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input {...register('shipping.lastName')} className="input-field" />
                    {errors.shipping?.lastName && <p className="text-red-500 text-xs mt-1">{errors.shipping.lastName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input type="email" {...register('shipping.email')} className="input-field" />
                    {errors.shipping?.email && <p className="text-red-500 text-xs mt-1">{errors.shipping.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input type="tel" {...register('shipping.phone')} className="input-field" />
                    {errors.shipping?.phone && <p className="text-red-500 text-xs mt-1">{errors.shipping.phone.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                    <input {...register('shipping.street')} className="input-field" placeholder="123 Main St, Apt 4" />
                    {errors.shipping?.street && <p className="text-red-500 text-xs mt-1">{errors.shipping.street.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input {...register('shipping.city')} className="input-field" />
                    {errors.shipping?.city && <p className="text-red-500 text-xs mt-1">{errors.shipping.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State / Province *</label>
                    <input {...register('shipping.state')} className="input-field" />
                    {errors.shipping?.state && <p className="text-red-500 text-xs mt-1">{errors.shipping.state.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal Code *</label>
                    <input {...register('shipping.zipCode')} className="input-field" />
                    {errors.shipping?.zipCode && <p className="text-red-500 text-xs mt-1">{errors.shipping.zipCode.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                    <input {...register('shipping.country')} className="input-field" />
                    {errors.shipping?.country && <p className="text-red-500 text-xs mt-1">{errors.shipping.country.message}</p>}
                  </div>
                </div>

                {/* Billing same toggle */}
                <div className="mt-5 flex items-center gap-3">
                  <input type="checkbox" id="billingSame" {...register('billingSameAsShipping')} className="w-4 h-4 accent-primary-500" />
                  <label htmlFor="billingSame" className="text-sm text-gray-600 cursor-pointer select-none">Billing address same as shipping</label>
                </div>

                {/* Billing address (if different) */}
                {!billingSame && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4">Billing Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(['firstName','lastName','email','phone','street','city','state','zipCode','country'] as const).map((field) => (
                        <div key={field} className={field === 'street' ? 'sm:col-span-2' : ''}>
                          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field.replace(/([A-Z])/g,' $1')} *</label>
                          <input {...register(`billing.${field}`)} className="input-field" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping Method */}
              <div className="bg-white rounded-2xl shadow-card p-7">
                <h2 className="font-serif text-xl font-semibold text-gray-900 mb-6">Shipping Method</h2>
                <div className="space-y-3">
                  {freeShip ? (
                    <label className="flex items-center gap-4 p-4 rounded-xl border-2 border-primary-500 bg-primary-50 cursor-pointer">
                      <input type="radio" value="free" {...register('shippingMethod')} className="accent-primary-500" />
                      <Truck size={18} className="text-primary-500" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Free Shipping</p>
                        <p className="text-sm text-gray-500">5–8 business days</p>
                      </div>
                      <span className="font-semibold text-green-600">FREE</span>
                    </label>
                  ) : (
                    SHIPPING_OPTIONS.map((opt) => (
                      <label key={opt.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${shippingMethod === opt.id ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'}`}>
                        <input type="radio" value={opt.id} {...register('shippingMethod')} className="accent-primary-500" />
                        {opt.id === 'express' ? <Zap size={18} className="text-gold-400" /> : <Truck size={18} className="text-gray-400" />}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{opt.label}</p>
                          <p className="text-sm text-gray-500">{opt.desc}</p>
                        </div>
                        <span className="font-semibold text-gray-900">{formatPrice(opt.price)}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-card p-7">
                <h2 className="font-serif text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Amex' },
                    { id: 'paypal', label: 'PayPal', desc: 'Pay with your PayPal account' },
                    { id: 'bank_transfer', label: 'Bank Transfer', desc: 'Instructions will be emailed after ordering' },
                  ].map((pm) => (
                    <label key={pm.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${watch('paymentMethod') === pm.id ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'}`}>
                      <input type="radio" value={pm.id} {...register('paymentMethod')} className="accent-primary-500" />
                      <div>
                        <p className="font-medium text-gray-900">{pm.label}</p>
                        <p className="text-sm text-gray-400">{pm.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order notes */}
              <div className="bg-white rounded-2xl shadow-card p-7">
                <h2 className="font-serif text-xl font-semibold text-gray-900 mb-4">Order Notes <span className="text-gray-400 font-normal text-sm">(Optional)</span></h2>
                <textarea
                  {...register('notes')}
                  rows={3}
                  placeholder="Special instructions, saddle fit notes, gate codes..."
                  className="input-field resize-none"
                />
              </div>
            </div>

            {/* RIGHT — Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
                <h2 className="font-serif text-xl font-semibold text-gray-900 mb-5">Order Summary</h2>

                {/* Items */}
                <div className="space-y-4 mb-5">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-3 text-sm">
                      <div className="w-12 h-12 rounded-lg bg-cream-100 flex-shrink-0 overflow-hidden">
                        {item.product.images?.[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{item.product.name}</p>
                        <p className="text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-900 whitespace-nowrap">{formatPrice(Number(item.product.price) * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 mb-5">
                  {/* Coupon */}
                  <div className="flex gap-2 mb-4">
                    <div className="flex-1 relative">
                      <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Coupon code"
                        className="input-field pl-9 text-sm h-9"
                      />
                    </div>
                    <button type="button" onClick={applyCoupon} disabled={couponLoading} className="btn-secondary px-3 py-1 text-sm h-9">
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>{shippingCost === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shippingCost)}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Coupon discount</span>
                        <span>- {formatPrice(couponDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-base text-gray-900 pt-2 border-t border-gray-100">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={placingOrder} className="btn-gold w-full py-4 text-base flex items-center justify-center gap-2">
                  <Lock size={16} />
                  {placingOrder ? 'Placing Order...' : 'Place Order'}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-4">
                  <Lock size={12} />
                  <span>SSL encrypted. Your data is secure.</span>
                </div>

                <p className="text-xs text-gray-400 text-center mt-3">
                  By placing your order you agree to our{' '}
                  <Link href="/terms-conditions" className="underline hover:text-primary-500">Terms</Link>
                  {' '}and{' '}
                  <Link href="/privacy-policy" className="underline hover:text-primary-500">Privacy Policy</Link>.
                </p>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
