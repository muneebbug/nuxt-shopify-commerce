import { getProductQuery } from '@@/lib/shopify/queries/product';
import { TAGS } from '@@/lib/constants';
import type { ShopifyProductOperation, Product } from '@@/lib/shopify/types';

export default defineCachedEventHandler(async (event): Promise<Product | undefined> => {
  const handle = getRouterParam(event, 'handle');

  if (!handle) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing product handle'
    });
  }

  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    tags: [TAGS.products],
    variables: {
      handle
    }
  });

  return reshapeProduct(res.body.data.product);
}, {
  maxAge: 60 * 60, // 1 hour
  swr: true,
  group: 'shopify-products',
  name: 'product',
  getKey: (event) => `product:${getRouterParam(event, 'handle')}`
});
