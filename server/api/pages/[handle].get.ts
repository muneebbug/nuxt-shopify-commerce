import { getPageQuery } from '@@/lib/shopify/queries/page';
import type { ShopifyPageOperation, Page } from '@@/lib/shopify/types';

export default defineCachedEventHandler(async (event): Promise<Page | undefined> => {
  const handle = getRouterParam(event, 'handle');

  if (!handle) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing page handle'
    });
  }

  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    variables: {
      handle
    }
  });

  return res.body.data.pageByHandle;
}, {
  maxAge: 60 * 60, // 1 hour
  swr: true,
  group: 'shopify-pages',
  name: 'page',
  getKey: (event) => `page:${getRouterParam(event, 'handle')}`
});
