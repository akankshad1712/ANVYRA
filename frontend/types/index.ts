// ─── Auth ────────────────────────────────────────────────────────────────────
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

// ─── User ────────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string;
  role: "CUSTOMER" | "ADMIN";
  enabled: boolean;
  createdAt: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileImage?: string;
}

// ─── Category ────────────────────────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  active: boolean;
}

// ─── Product ─────────────────────────────────────────────────────────────────
export interface Product {
  id: number;
  name: string;
  description?: string;
  brand: string;
  price: number;
  discountPrice: number;
  effectivePrice: number;
  quantity: number;
  active: boolean;
  featured: boolean;
  images: string[];
  sizes: string[];
  colors: string[];
  category?: Category;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
}

export interface ProductFilters {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  page?: number;
  size?: number;
}

// ─── Cart ────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
  subtotal: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

// ─── Address ─────────────────────────────────────────────────────────────────
export interface Address {
  id: number;
  fullName: string;
  phone: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface AddressRequest {
  fullName: string;
  phone: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

// ─── Order ───────────────────────────────────────────────────────────────────
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentMethod = "CARD" | "UPI" | "NET_BANKING" | "COD" | "WALLET";
export type PaymentStatus =
  | "PENDING"
  | "INITIATED"
  | "SUCCESS"
  | "FAILED"
  | "REFUNDED"
  | "CANCELLED";

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  subtotal: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: Address;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  discount: number;
  totalAmount: number;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  transactionId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaceOrderRequest {
  shippingAddressId: number;
  paymentMethod: PaymentMethod;
  notes?: string;
}

// ─── Review ──────────────────────────────────────────────────────────────────
export interface Review {
  id: number;
  productId: number;
  userId: number;
  userFirstName: string;
  userLastName: string;
  rating: number;
  title?: string;
  comment?: string;
  verified: boolean;
  createdAt: string;
}

export interface ReviewRequest {
  productId: number;
  rating: number;
  title?: string;
  comment?: string;
}

// ─── Pagination ──────────────────────────────────────────────────────────────
export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

// ─── API Error ───────────────────────────────────────────────────────────────
export interface ApiError {
  status: number;
  message: string;
  path: string;
  timestamp: string;
  errors?: Record<string, string>;
}
