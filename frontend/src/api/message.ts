import request, { useMock } from './request';
import { mockApi } from './mock';
import type { Message } from '@/types';

export function getMessagesApi(userId: number): Promise<Message[]> {
  return useMock ? mockApi.messages(userId) : request.get('/messages');
}

export function readMessageApi(id: number, userId: number): Promise<Message> {
  return useMock ? mockApi.readMessage(id, userId) : request.put(`/messages/${id}/read`);
}

export function readAllMessagesApi(userId: number): Promise<boolean> {
  return useMock ? mockApi.readAllMessages(userId) : request.put('/messages/read-all');
}

export function deleteMessageApi(id: number, userId: number): Promise<boolean> {
  return useMock ? mockApi.deleteMessage(id, userId) : request.delete(`/messages/${id}`);
}
