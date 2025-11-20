import { getPagesQuery } from '@@/lib/shopify/queries/page';
import type { ShopifyPagesOperation, Page } from '@@/lib/shopify/types';

export default defineCachedEventHandler(async (event): Promise<Page[]> => {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery
  });

  return removeEdgesAndNodes(res.body.data.pages);
}, {
  maxAge: 60 * 60, // 1 hour
  swr: true,
  group: 'shopify-pages',
  name: 'pages'
});
