import { z } from 'zod';
import { signInWithEmailAndPasswordMutation } from '@@/lib/shopify/mutations/customer';
import type { ShopifySignInWithEmailAndPasswordOperation } from '@@/lib/shopify/types';

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (data) => bodySchema.parse(data));
  const { email, password } = body;

  const res = await shopifyFetch<ShopifySignInWithEmailAndPasswordOperation>({
    query: signInWithEmailAndPasswordMutation,
    variables: {
      email,
      password
    }
  });

  return res.body.data.customerAccessTokenCreate;
});
