import { z } from 'zod';
import { registerAccountMutation } from '@@/lib/shopify/mutations/customer';
import type { ShopifyRegisterAccountOperation } from '@@/lib/shopify/types';

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  acceptsMarketing: z.boolean().optional()
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (data) => bodySchema.parse(data));

  const res = await shopifyFetch<ShopifyRegisterAccountOperation>({
    query: registerAccountMutation,
    variables: body
  });

  return res.body.data.customerCreate;
});
