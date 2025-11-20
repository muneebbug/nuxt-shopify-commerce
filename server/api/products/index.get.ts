import { z } from 'zod';
import { getProductsQuery } from '@@/lib/shopify/queries/product';
import { TAGS } from '@@/lib/constants';
import type { ShopifyProductsOperation, Product } from '@@/lib/shopify/types';

const querySchema = z.object({
  query: z.string().optional(),
  reverse: z.string().transform(val => val === 'true').optional(),
  sortKey: z.enum(['CREATED_AT', 'PRICE', 'BEST_SELLING', 'RELEVANCE', 'TITLE']).optional().default('CREATED_AT')
});

export default defineCachedEventHandler(async (event): Promise<Product[]> => {
  const query = await getValidatedQuery(event, (data) => querySchema.parse(data));

  const { sortKey, reverse, query: searchQuery } = query;

  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    tags: [TAGS.products],
    variables: {
      query: searchQuery,
      reverse,
      sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey
    }
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}, {
  maxAge: 60 * 60, // 1 hour
  swr: true,
  group: 'shopify-products',
  name: 'products'
});
