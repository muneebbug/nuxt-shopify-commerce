import { z } from 'zod';
import { getCustomerQuery } from '@@/lib/shopify/queries/customer';
import type { ShopifyCustomerOperation, Customer } from '@@/lib/shopify/types';

const querySchema = z.object({
  customerAccessToken: z.string()
});

export default defineEventHandler(async (event): Promise<Customer> => {
  const query = await getValidatedQuery(event, (data) => querySchema.parse(data));
  const { customerAccessToken } = query;

  const res = await shopifyFetch<ShopifyCustomerOperation>({
    query: getCustomerQuery,
    variables: { customerAccessToken }
  });

  return reshapeCustomer(res.body.data.customer);
});
