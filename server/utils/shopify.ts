import { SHOPIFY_GRAPHQL_API_ENDPOINT, HIDDEN_PRODUCT_TAG } from '@@/lib/constants';
import { isShopifyError } from '@@/lib/type-guards';
import { ensureStartsWith } from '@@/lib/helpers';
import type {
  Connection,
  Image,
  ShopifyProduct,
  Product,
  ShopifyCollection,
  Collection,
  ShopifyCart,
  Cart,
  ShopifyCustomer,
  Customer
} from '@@/lib/shopify/types';

type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never;

export async function shopifyFetch<T>({
  query,
  variables,
  headers,
  tags
}: {
  query: string;
  variables?: ExtractVariables<T>;
  headers?: HeadersInit;
  tags?: string[];
}): Promise<{ status: number; body: T } | never> {
  const { storeDomain, publicAccessToken } = useRuntimeConfig();

  const domain = storeDomain
    ? ensureStartsWith(storeDomain as string, 'https://')
    : '';
  const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
  const key = publicAccessToken as string;

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      ...(tags && { next: { tags } })
    });

    const isJson = result.headers.get('content-type')?.includes('application/json');

    if (!result.ok || !isJson) {
      if (!isJson) {
        throw new Error(`Shopify API returned non-JSON response: ${result.status} ${result.statusText}`);
      }
      // If it is JSON but not OK, we still parse it as it might contain error details
    }

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e: unknown) {
    if (isShopifyError(e)) {
      throw createError({
        statusCode: e.status || 500,
        statusMessage: e.message,
        data: {
          cause: e.cause?.toString(),
          query
        }
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: (e as Error).message || 'Internal Server Error',
      data: {
        error: e,
        query
      }
    });
  }
}

export const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge?.node);
};

export const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1];
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`
    };
  });
};

export const reshapeProduct = (product: ShopifyProduct, filterHiddenProducts: boolean = true): Product | undefined => {
  if (!product || (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants)
  };
};

export const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

export const reshapeCollection = (collection: ShopifyCollection): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/search/${collection.handle}`
  };
};

export const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      if (collection.handle.startsWith('hidden-') || collection.title.includes(HIDDEN_PRODUCT_TAG)) {
        continue;
      }

      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

export const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: '0.0',
      currencyCode: 'USD'
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines)
  };
};

export const reshapeCustomer = (customer: ShopifyCustomer) : Customer => {
  return {
    ...customer,
    addresses: removeEdgesAndNodes(customer.addresses)
  };
}

export const reshapeMenu = (menu: { items: { title: string; url: string }[] } | undefined, domain: string): { title: string; path: string }[] => {
  if (!menu) {
    return [];
  }

  return menu.items.map((item) => ({
    title: item.title,
    path: item.url.replace(domain, '').replace('/collections', '/collection').replace('/pages', '')
  }));
};
