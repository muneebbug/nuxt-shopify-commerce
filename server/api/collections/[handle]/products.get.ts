import { z } from 'zod';
import { getCollectionProductsQuery } from '@@/lib/shopify/queries/collection';
import { TAGS } from '@@/lib/constants';
import type { ShopifyCollectionProductsOperation, Product } from '@@/lib/shopify/types';

const querySchema = z.object({
  sortKey: z.enum(['CREATED_AT', 'PRICE', 'BEST_SELLING', 'RELEVANCE', 'TITLE', 'MANUAL', 'COLLECTION_DEFAULT']).optional().default('COLLECTION_DEFAULT'),
  reverse: z.string().transform(val => val === 'true').optional(),
  first: z.string().transform(val => parseInt(val, 10)).optional(),
  after: z.string().optional()
});

export default defineCachedEventHandler(async (event): Promise<{ products: Product[], pageInfo: { hasNextPage: boolean, endCursor: string } }> => {
  const handle = getRouterParam(event, 'handle');
  const query = await getValidatedQuery(event, (data) => querySchema.parse(data));

  if (!handle) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing collection handle'
    });
  }

  const { sortKey, reverse, first, after } = query;

  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    tags: [TAGS.collections, TAGS.products],
    variables: {
      handle,
      reverse,
      sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey,
      first,
      after
    }
  });

  if (!res.body.data.collection) {
    return { products: [], pageInfo: { hasNextPage: false, endCursor: '' } };
  }

  return {
    products: reshapeProducts(removeEdgesAndNodes(res.body.data.collection.products)),
    pageInfo: res.body.data.collection.products.pageInfo
  };
}, {
  maxAge: 60 * 60, // 1 hour
  swr: true,
  group: 'shopify-collections',
  name: 'collection-products',
  getKey: (event) => {
    const query = getQuery(event);
    return `collection-products:${getRouterParam(event, 'handle')}:${JSON.stringify(query)}`;
  }
});
