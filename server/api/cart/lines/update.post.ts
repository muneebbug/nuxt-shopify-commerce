import { z } from 'zod';
import { editCartItemsMutation } from '@@/lib/shopify/mutations/cart';
import type { ShopifyUpdateCartOperation, Cart } from '@@/lib/shopify/types';

const bodySchema = z.object({
  cartId: z.string(),
  lines: z.array(z.object({
    id: z.string(),
    merchandiseId: z.string(),
    quantity: z.number()
  }))
});

export default defineEventHandler(async (event): Promise<Cart> => {
  const body = await readValidatedBody(event, (data) => bodySchema.parse(data));
  const { cartId, lines } = body;

  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines
    }
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
});
