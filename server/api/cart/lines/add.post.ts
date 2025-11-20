import { z } from 'zod';
import { addToCartMutation } from '@@/lib/shopify/mutations/cart';
import type { ShopifyAddToCartOperation, Cart } from '@@/lib/shopify/types';

const bodySchema = z.object({
  cartId: z.string(),
  lines: z.array(z.object({
    merchandiseId: z.string(),
    quantity: z.number()
  }))
});

export default defineEventHandler(async (event): Promise<Cart> => {
  const body = await readValidatedBody(event, (data) => bodySchema.parse(data));
  const { cartId, lines } = body;

  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines
    }
  });

  return reshapeCart(res.body.data.cartLinesAdd.cart);
});
