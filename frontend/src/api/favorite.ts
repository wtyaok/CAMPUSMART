import request, { useMock } from './request';
import { mockApi } from './mock';
import type { Product } from '@/types';

export function getFavoritesApi(userId: number): Promise<Product[]> {
  return useMock ? mockApi.favorites(userId) : request.get('/favorites');
}
