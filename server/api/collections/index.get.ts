import { getCollectionsQuery } from '@@/lib/shopify/queries/collection';
import { TAGS } from '@@/lib/constants';
import type { ShopifyCollectionsOperation, Collection } from '@@/lib/shopify/types';

export default defineCachedEventHandler(async (event): Promise<Collection[]> => {
  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery,
    tags: [TAGS.collections]
  });

  return reshapeCollections(removeEdgesAndNodes(res.body.data.collections));
}, {
  maxAge: 60 * 60, // 1 hour
  swr: true,
  group: 'shopify-collections',
  name: 'collections'
});
