import { getMenuQuery } from '@@/lib/shopify/queries/menu';
import { TAGS } from '@@/lib/constants';
import { ensureStartsWith } from '@@/lib/helpers';
import type { ShopifyMenuOperation, Menu } from '@@/lib/shopify/types';

export default defineCachedEventHandler(async (event): Promise<Menu[]> => {
  const handle = getRouterParam(event, 'handle');
  const { storeDomain } = useRuntimeConfig();
  const domain = storeDomain ? ensureStartsWith(storeDomain as string, 'https://') : '';

  if (!handle) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing menu handle'
    });
  }

  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    tags: [TAGS.collections], // Menu might be related to collections
    variables: {
      handle
    }
  });

  return reshapeMenu(res.body.data.menu, domain);
}, {
  maxAge: 60 * 60, // 1 hour
  swr: true,
  group: 'shopify-menu',
  name: 'menu',
  getKey: (event) => `menu:${getRouterParam(event, 'handle')}`
});
