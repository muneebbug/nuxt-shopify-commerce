// store/cart.ts
import { defineStore } from 'pinia';
import type { Cart } from '@/lib/shopify/types';


export const useCartStore = defineStore('cart', {
  state: () => {
    return {
      cart: undefined as Cart | undefined,
      isLoading: false as boolean,
    };
  },
  actions: {
    setCart(cart: Cart | undefined) {
      this.cart = cart;
    },
    setLoading(isLoading : boolean) {
      this.isLoading = isLoading;
    },
  },
});
