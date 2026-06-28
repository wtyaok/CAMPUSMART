import request, { useMock } from './request';
import { mockApi } from './mock';
import type { DashboardStats, Order, OrderQuery, PageResult, Product, ProductQuery, User, UserStatus } from '@/types';

export function getDashboardApi(): Promise<DashboardStats> {
  return useMock ? mockApi.dashboard() : request.get('/admin/dashboard');
}

export function getReviewProductsApi(): Promise<Product[]> {
  return useMock ? mockApi.adminReviewProducts() : request.get('/admin/products/review');
}

export function getAdminProductsApi(query: ProductQuery): Promise<PageResult<Product>> {
  return useMock ? mockApi.adminProducts(query) : request.get('/admin/products', { params: query });
}

export function approveProductApi(id: number): Promise<Product> {
  return useMock ? mockApi.adminApproveProduct(id) : request.put(`/admin/products/${id}/approve`);
}

export function rejectProductApi(id: number, reason: string): Promise<Product> {
  return useMock ? mockApi.adminRejectProduct(id, reason) : request.put(`/admin/products/${id}/reject`, { reason });
}

export function adminOffShelfProductApi(id: number, reason: string): Promise<Product> {
  return useMock ? mockApi.adminOffShelfProduct(id, reason) : request.put(`/admin/products/${id}/off-shelf`, { reason });
}

export function getAdminUsersApi(keyword = ''): Promise<(User & { productCount: number; orderCount: number })[]> {
  return useMock ? mockApi.adminUsers(keyword) : request.get('/admin/users', { params: { keyword } });
}

export function updateAdminUserStatusApi(id: number, status: UserStatus): Promise<User> {
  return useMock ? mockApi.adminUserStatus(id, status) : request.put(`/admin/users/${id}/status`, { status });
}

export function getAdminOrdersApi(query: OrderQuery): Promise<PageResult<Order>> {
  return useMock ? mockApi.adminOrders(query) : request.get('/admin/orders', { params: query });
}

export function handleAdminOrderApi(id: number, status: 'completed' | 'cancelled', note: string): Promise<Order> {
  return useMock ? mockApi.adminHandleOrder(id, status, note) : request.put(`/admin/orders/${id}/handle`, { status, note });
}
