import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { deleteMessageApi, getMessagesApi, readAllMessagesApi, readMessageApi } from '@/api/message';
import { useAuthStore } from './auth';
import type { Message } from '@/types';

export const useMessageStore = defineStore('message', () => {
  const list = ref<Message[]>([]);
  const loading = ref(false);
  const unreadCount = computed(() => list.value.filter((item) => !item.read).length);

  async function fetchMessages() {
    const auth = useAuthStore();
    if (!auth.user) return;
    loading.value = true;
    try {
      list.value = await getMessagesApi(auth.user.id);
    } finally {
      loading.value = false;
    }
  }

  async function read(id: number) {
    const auth = useAuthStore();
    if (!auth.user) return;
    await readMessageApi(id, auth.user.id);
    await fetchMessages();
  }

  async function readAll() {
    const auth = useAuthStore();
    if (!auth.user) return;
    await readAllMessagesApi(auth.user.id);
    await fetchMessages();
  }

  async function remove(id: number) {
    const auth = useAuthStore();
    if (!auth.user) return;
    await deleteMessageApi(id, auth.user.id);
    await fetchMessages();
  }

  return {
    list,
    loading,
    unreadCount,
    fetchMessages,
    read,
    readAll,
    remove
  };
});
