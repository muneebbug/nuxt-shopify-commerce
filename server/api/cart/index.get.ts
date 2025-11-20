import { z } from 'zod';
import { getCartQuery } from '@@/lib/shopify/queries/cart';
import { TAGS } from '@@/lib/constants';
import type { ShopifyCartOperation, Cart } from '@@/lib/shopify/types';

const querySchema = z.object({
  cartId: z.string()
});

export default defineEventHandler(async (event): Promise<Cart | undefined> => {
  const query = await getValidatedQuery(event, (data) => querySchema.parse(data));
  const { cartId } = query;

  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
    tags: [TAGS.cart]
  });

  if (!res.body.data.cart) {
    return undefined;
  }

  return reshapeCart(res.body.data.cart);
});
