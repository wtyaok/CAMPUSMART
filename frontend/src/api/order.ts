import request, { useMock } from './request';
import { mockApi } from './mock';
import type { Order, OrderQuery, OrderStatus, PageResult } from '@/types';

export function getOrdersApi(query: OrderQuery, userId: number): Promise<PageResult<Order>> {
  return useMock ? mockApi.orders(query, userId) : request.get('/orders', { params: query });
}

export function getOrderDetailApi(id: number, userId: number): Promise<Order> {
  return useMock ? mockApi.orderDetail(id, userId) : request.get(`/orders/${id}`);
}

export function createOrderApi(payload: { productId: number; contact: string; remark?: string }, userId: number): Promise<Order> {
  return useMock ? mockApi.createOrder(payload, userId) : request.post('/orders', payload);
}

export function updateOrderStatusApi(id: number, status: OrderStatus, userId: number, note?: string): Promise<Order> {
  return useMock ? mockApi.updateOrderStatus(id, status, userId, note) : request.put(`/orders/${id}/status`, { status, note });
}
