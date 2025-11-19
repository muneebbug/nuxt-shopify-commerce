import { defineStore } from 'pinia';
import type { Customer } from '@@/lib/shopify/types';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as Customer | null,
    accessToken: null as string | null,
    expiresAt: null as string | null,
    isAuthenticated: false
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated && state.accessToken !== null,
  },

  actions: {
    setUser(user: Customer | null) {
      this.user = user;
    },
    setAuth(token: string | null, expiresAt: string | null) {
      this.accessToken = token;
      this.expiresAt = expiresAt;
      this.isAuthenticated = !!token;
    },
    logout() {
      this.user = null;
      this.accessToken = null;
      this.expiresAt = null;
      this.isAuthenticated = false;
    }
  },

  persist: {
    storage: persistedState.cookiesWithOptions({
      sameSite: 'strict',
      secure: import.meta.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })
  }
});
