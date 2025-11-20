import crypto from 'crypto';

export default defineEventHandler(async (event) => {
  const { shopifyWebhookSecret } = useRuntimeConfig(); // Assuming this is set in nuxt.config.ts or .env
  
  // We need the raw body for HMAC verification
  const rawBody = await readRawBody(event);
  const hmac = getHeader(event, 'X-Shopify-Hmac-Sha256');
  const topic = getHeader(event, 'X-Shopify-Topic');

  if (!shopifyWebhookSecret || !rawBody || !hmac) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Unauthorized'
    });
  }

  const generatedHash = crypto
    .createHmac('sha256', shopifyWebhookSecret as string)
    .update(rawBody)
    .digest('base64');

  if (generatedHash !== hmac) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden'
    });
  }

  const body = JSON.parse(rawBody);
  const storage = useStorage('cache');

  // Helper to clear keys starting with a prefix
  const clearKeys = async (prefix: string) => {
    const keys = await storage.getKeys(prefix);
    for (const key of keys) {
      await storage.removeItem(key);
    }
  };

  // Invalidate based on topic
  // Topics: products/update, products/create, products/delete
  // collections/update, collections/create, collections/delete
  
  if (topic?.startsWith('products/')) {
    const handle = body.handle;
    // Clear specific product cache
    await clearKeys(`nitro:handlers:product:${handle}.json`);
    // Clear all products list cache
    await clearKeys(`nitro:handlers:products.json`);
    // Clear collection products cache (hard to know which collection, so maybe clear all collection products?)
    // Or just rely on TTL. For now, let's clear all collection-products to be safe.
    await clearKeys(`nitro:handlers:collection-products:`);
    // Clear search cache
    await clearKeys(`nitro:handlers:search:`);
  }

  if (topic?.startsWith('collections/')) {
    const handle = body.handle;
    // Clear specific collection cache
    await clearKeys(`nitro:handlers:collection:${handle}.json`);
    // Clear all collections list cache
    await clearKeys(`nitro:handlers:collections.json`);
    // Clear collection products for this collection
    await clearKeys(`nitro:handlers:collection-products:${handle}:`);
    // Clear menu cache (might be related)
    await clearKeys(`nitro:handlers:menu:`);
  }

  return { success: true };
});
