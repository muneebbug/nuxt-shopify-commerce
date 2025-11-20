import { z } from 'zod';
import { removeFromCartMutation } from '@@/lib/shopify/mutations/cart';
import type { ShopifyRemoveFromCartOperation, Cart } from '@@/lib/shopify/types';

const bodySchema = z.object({
  cartId: z.string(),
  lineIds: z.array(z.string())
});

export default defineEventHandler(async (event): Promise<Cart> => {
  const body = await readValidatedBody(event, (data) => bodySchema.parse(data));
  const { cartId, lineIds } = body;

  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds
    }
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
});
