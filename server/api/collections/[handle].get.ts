import { getCollectionQuery } from '@@/lib/shopify/queries/collection';
import { TAGS } from '@@/lib/constants';
import type { ShopifyCollectionOperation, Collection } from '@@/lib/shopify/types';

export default defineCachedEventHandler(async (event): Promise<Collection | undefined> => {
  const handle = getRouterParam(event, 'handle');

  if (!handle) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing collection handle'
    });
  }

  const res = await shopifyFetch<ShopifyCollectionOperation>({
    query: getCollectionQuery,
    tags: [TAGS.collections],
    variables: {
      handle
    }
  });

  return reshapeCollection(res.body.data.collection);
}, {
  maxAge: 60 * 60, // 1 hour
  swr: true,
  group: 'shopify-collections',
  name: 'collection',
  getKey: (event) => `collection:${getRouterParam(event, 'handle')}`
});
