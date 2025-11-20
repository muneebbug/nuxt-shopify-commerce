import { z } from 'zod';
import { customerRecoverMutation } from '@@/lib/shopify/mutations/customer';
import type { ShopifyCustomerRecoverOperation } from '@@/lib/shopify/types';

const bodySchema = z.object({
  email: z.string().email()
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (data) => bodySchema.parse(data));
  const { email } = body;

  const res = await shopifyFetch<ShopifyCustomerRecoverOperation>({
    query: customerRecoverMutation,
    variables: {
      email
    }
  });

  return res.body.data.customerRecover;
});
