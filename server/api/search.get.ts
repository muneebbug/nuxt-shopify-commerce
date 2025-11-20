import { z } from 'zod';
import { predictiveSearchQuery } from '@@/lib/shopify/queries/search';
import type { predictiveSearchOperation, SearchResults } from '@@/lib/shopify/types';

const querySchema = z.object({
  query: z.string()
});

export default defineCachedEventHandler(async (event): Promise<SearchResults> => {
  const queryParams = await getValidatedQuery(event, (data) => querySchema.parse(data));
  const { query } = queryParams;

  const res = await shopifyFetch<predictiveSearchOperation>({
    query: predictiveSearchQuery,
    variables: {
      query
    }
  });

  const results = res.body.data.predictiveSearch;

  return {
    ...results,
    totalCount: results.products.length + results.collections.length + results.pages.length
  };
}, {
  maxAge: 60 * 5, // 5 minutes
  swr: true,
  group: 'shopify-search',
  name: 'search',
  getKey: (event) => `search:${getQuery(event).query}`
});
