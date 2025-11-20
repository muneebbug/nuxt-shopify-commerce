import { createCartMutation } from '@@/lib/shopify/mutations/cart';
import type { ShopifyCreateCartOperation, Cart } from '@@/lib/shopify/types';

export default defineEventHandler(async (): Promise<Cart> => {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation,
  });

  return reshapeCart(res.body.data.cartCreate.cart);
});
