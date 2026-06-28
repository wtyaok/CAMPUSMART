export type Role = 'user' | 'admin';
export type UserStatus = 'normal' | 'disabled';
export type ProductStatus = 'pending_review' | 'on_sale' | 'locked' | 'sold' | 'off_shelf' | 'rejected';
export type OrderStatus = 'pending_confirm' | 'confirmed' | 'completed' | 'cancelled' | 'abnormal';
export type MessageType = 'review' | 'order' | 'system' | 'abnormal';

export interface ApiResult<T> {
  code: number;
  message: string;
  data: T;
}

export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface User {
  id: number;
  username: string;
  nickname: string;
  role: Role;
  phone?: string;
  avatar?: string;
  status: UserStatus;
  createdAt: string;
}

export interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  condition: string;
  location: string;
  description: string;
  images: string[];
  sellerId: number;
  sellerName: string;
  status: ProductStatus;
  viewCount: number;
  favoriteCount: number;
  rejectReason?: string;
  createdAt: string;
  contact?: string;
  favorited?: boolean;
}

export interface OrderTimeline {
  status: OrderStatus;
  label: string;
  time: string;
  note?: string;
}

export interface Order {
  id: number;
  orderNo: string;
  productId: number;
  productTitle: string;
  productImage: string;
  price: number;
  buyerId: number;
  buyerName: string;
  sellerId: number;
  sellerName: string;
  contact: string;
  remark?: string;
  status: OrderStatus;
  timeline: OrderTimeline[];
  createdAt: string;
  handleNote?: string;
}

export interface Message {
  id: number;
  userId: number;
  title: string;
  content: string;
  type: MessageType;
  read: boolean;
  createdAt: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  nickname: string;
  phone?: string;
}

export interface ProductQuery {
  keyword?: string;
  category?: string;
  status?: ProductStatus | '';
  minPrice?: number;
  maxPrice?: number;
  sort?: 'latest' | 'priceAsc' | 'priceDesc';
  page?: number;
  pageSize?: number;
}

export interface OrderQuery {
  type?: 'buy' | 'sell' | 'all';
  status?: OrderStatus | '';
  page?: number;
  pageSize?: number;
}

export interface DashboardStats {
  productTotal: number;
  pendingProducts: number;
  userTotal: number;
  orderTotal: number;
  abnormalOrders: number;
  publishTrend: { date: string; count: number }[];
  orderStatus: { status: OrderStatus; count: number }[];
}
