// ─── Auth ────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: "user" | "admin";
  email_verified: boolean;
  newsletter_subscribed: boolean;
  created_at: string;
  addresses?: Address[];
}

export interface Address {
  id: string;
  label?: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default: boolean;
}

// ─── Products ────────────────────────────────────────────────────────────────
export type SaddleDiscipline =
  | "western"
  | "english"
  | "dressage"
  | "jumping"
  | "trail"
  | "barrel_racing"
  | "youth"
  | "all_purpose";

export type SaddleCondition = "new" | "excellent" | "good" | "fair";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  product_count?: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  is_primary: boolean;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  price: number;
  compare_price?: number;
  sku?: string;
  stock_quantity: number;
  category_id: string;
  category?: Category;
  discipline: SaddleDiscipline;
  condition: SaddleCondition;
  brand?: string;
  seat_size?: string;
  gullet_width?: string;
  tree_type?: string;
  leather_type?: string;
  weight_kg?: number;
  color?: string;
  material?: string;
  is_featured: boolean;
  is_active: boolean;
  avg_rating: number;
  review_count: number;
  images: ProductImage[];
  primary_image?: string;
  tags?: string[];
  available_seat_sizes?: string[];
  available_colors?: string[];
  available_tree_sizes?: string[];
  created_at: string;
}

export interface ProductFilters {
  category?: string;
  discipline?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  featured?: boolean;
  sort?: "price_asc" | "price_desc" | "newest" | "rating" | "name_asc";
  page?: number;
  limit?: number;
}

// ─── Cart ────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  selected_seat_size?: string;
  selected_color?: string;
  selected_tree_size?: string;
  selected_width?: string;
  product: Pick<
    Product,
    | "id"
    | "name"
    | "slug"
    | "price"
    | "compare_price"
    | "stock_quantity"
    | "images"
    | "primary_image"
  >;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  item_count: number;
}

// ─── Orders ──────────────────────────────────────────────────────────────────
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refund_requested"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  seatSize?: string;
  selectedColor?: string;
  selectedTreeSize?: string;
  selectedWidth?: string;
}

export interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  total: number;
  shipping_address: Address;
  billing_address?: Address;
  coupon_code?: string;
  notes?: string;
  tracking_number?: string;
  trial_end_date?: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

// ─── Reviews ─────────────────────────────────────────────────────────────────
export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  title?: string;
  body: string;
  is_verified: boolean;
  is_approved: boolean;
  first_name: string;
  last_name: string;
  created_at: string;
}

// ─── Blog ────────────────────────────────────────────────────────────────────
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_image?: string;
  category: string;
  author_name: string;
  reading_time: number;
  is_published: boolean;
  published_at: string;
  seo_title?: string;
  seo_description?: string;
}

// ─── Newsletter / Contact ─────────────────────────────────────────────────────
export interface NewsletterSubscriber {
  id: string;
  email: string;
  confirmed: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ─── API Responses ───────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// ─── Checkout ────────────────────────────────────────────────────────────────
export interface CheckoutForm {
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_street: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  shipping_country: string;
  billing_same_as_shipping: boolean;
  billing_street?: string;
  billing_city?: string;
  billing_state?: string;
  billing_zip?: string;
  billing_country?: string;
  coupon_code?: string;
  shipping_method: "standard" | "express";
  notes?: string;
  payment_method: "card" | "paypal" | "bank_transfer";
}
