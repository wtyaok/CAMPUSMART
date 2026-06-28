import request, { useMock } from './request';
import { mockApi } from './mock';
import type { PageResult, Product, ProductQuery } from '@/types';

export function getProductsApi(query: ProductQuery): Promise<PageResult<Product>> {
  return useMock ? mockApi.products(query) : request.get('/products', { params: query });
}

export function getProductDetailApi(id: number): Promise<Product> {
  return useMock ? mockApi.productDetail(id) : request.get(`/products/${id}`);
}

export function createProductApi(payload: any, userId: number): Promise<Product> {
  return useMock ? mockApi.createProduct(payload, userId) : request.post('/products', payload);
}

export function updateProductApi(id: number, payload: Partial<Product>, userId: number): Promise<Product> {
  return useMock ? mockApi.updateProduct(id, payload, userId) : request.put(`/products/${id}`, payload);
}

export function deleteProductApi(id: number, userId: number): Promise<boolean> {
  return useMock ? mockApi.deleteProduct(id, userId) : request.delete(`/products/${id}`);
}

export function myProductsApi(userId: number): Promise<Product[]> {
  return useMock ? mockApi.myProducts(userId) : request.get('/products/my');
}

export function offShelfMyProductApi(id: number, userId: number): Promise<Product> {
  return useMock ? mockApi.offShelfMyProduct(id, userId) : request.put(`/products/${id}/off-shelf`);
}

export function favoriteProductApi(id: number, userId: number): Promise<Product> {
  return useMock ? mockApi.favorite(id, userId) : request.post(`/products/${id}/favorite`);
}

export function unfavoriteProductApi(id: number, userId: number): Promise<Product> {
  return useMock ? mockApi.unfavorite(id, userId) : request.delete(`/products/${id}/favorite`);
}
