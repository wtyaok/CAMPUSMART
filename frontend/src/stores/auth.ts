import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { loginApi, meApi, registerApi } from '@/api/auth';
import type { LoginPayload, RegisterPayload, User } from '@/types';

const AUTH_KEY = 'campus-mart-auth';

interface AuthStorage {
  token: string;
  user: User;
}

function readStorage(): AuthStorage | null {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthStorage;
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
}

export const useAuthStore = defineStore('auth', () => {
  const saved = readStorage();
  const token = ref(saved?.token || '');
  const user = ref<User | null>(saved?.user || null);
  const isLogin = computed(() => Boolean(token.value && user.value));
  const isAdmin = computed(() => user.value?.role === 'admin');

  function persist(nextToken: string, nextUser: User) {
    token.value = nextToken;
    user.value = nextUser;
    localStorage.setItem(AUTH_KEY, JSON.stringify({ token: nextToken, user: nextUser }));
  }

  async function login(payload: LoginPayload) {
    const result = await loginApi(payload);
    persist(result.token, result.user);
    return result.user;
  }

  async function register(payload: RegisterPayload) {
    return registerApi(payload);
  }

  async function refresh() {
    if (!user.value) return null;
    const fresh = await meApi(user.value.id);
    user.value = fresh;
    localStorage.setItem(AUTH_KEY, JSON.stringify({ token: token.value, user: fresh }));
    return fresh;
  }

  function logout() {
    token.value = '';
    user.value = null;
    localStorage.removeItem(AUTH_KEY);
  }

  return {
    token,
    user,
    isLogin,
    isAdmin,
    login,
    register,
    refresh,
    logout
  };
});
