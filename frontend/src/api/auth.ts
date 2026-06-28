import request, { useMock } from './request';
import { mockApi } from './mock';
import type { LoginPayload, RegisterPayload, User } from '@/types';

export function loginApi(payload: LoginPayload): Promise<{ token: string; user: User }> {
  return useMock ? mockApi.login(payload) : request.post('/auth/login', payload);
}

export function registerApi(payload: RegisterPayload): Promise<User> {
  return useMock ? mockApi.register(payload) : request.post('/auth/register', payload);
}

export function meApi(userId: number): Promise<User> {
  return useMock ? mockApi.me(userId) : request.get('/auth/me');
}
