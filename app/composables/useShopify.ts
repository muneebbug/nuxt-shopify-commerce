// composables/useShopify.js

import { HIDDEN_PRODUCT_TAG, SHOPIFY_GRAPHQL_API_ENDPOINT, TAGS } from '@@/lib/constants';
import { isShopifyError } from '@@/lib/type-guards';
import { ensureStartsWith } from '@@/lib/helpers';

import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation
} from '@@/lib/shopify/mutations/cart';
import { getCartQuery } from '@@/lib/shopify/queries/cart';
import {
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery
} from '@@/lib/shopify/queries/collection';
import { getMenuQuery } from '@@/lib/shopify/queries/menu';
import { getPageQuery, getPagesQuery } from '@@/lib/shopify/queries/page';
import {
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsQuery
} from '@@/lib/shopify/queries/product';
import { predictiveSearchQuery } from '@@/lib/shopify/queries/search';
import type {
  Cart,
  Collection,
  Connection,
  Image,
  Menu,
  Page,
  Product,
  ShopifyAddToCartOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCollection,
  ShopifyCollectionOperation,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionsOperation,
  ShopifyCreateCartOperation,
  ShopifyMenuOperation,
  ShopifyPageOperation,
  ShopifyPagesOperation,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  SearchResults,
  predictiveSearchOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation,
  ShopifySignInWithEmailAndPasswordOperation,
  ShopifyRegisterAccountOperation,
  Customer,
  ShopifyCustomerOperation,
  ShopifyCustomer,
  ShopifyCustomerRecoverOperation
} from '@@/lib/shopify/types';
import { customerRecoverMutation, registerAccountMutation, signInWithEmailAndPasswordMutation } from '@@/lib/shopify/mutations/customer';
import { getCustomerQuery } from '@@/lib/shopify/queries/customer';

export function useShopify() {
  const { storeDomain, publicAccessToken } = useRuntimeConfig().public;

  const domain = storeDomain as string
    ? ensureStartsWith(storeDomain as string, 'https://')
    : '';
  const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
  const key = publicAccessToken! as string;

  type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never;

  async function shopifyFetch<T>({
    headers,
    query,
    tags,
    variables
  }: {
    headers?: HeadersInit;
    query: string;
    tags?: string[];
    variables?: ExtractVariables<T>;
  }): Promise<{ status: number; body: T } | never> {
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

      const body = await result.json();

      if (body.errors) {
        throw body.errors[0];
      }

      return {
        status: result.status,
        body
      };
    } catch (e) {
      if (isShopifyError(e)) {
        throw {
          cause: e.cause?.toString() || 'unknown',
          status: e.status || 500,
          message: e.message,
          query
        };
      }

      throw {
        error: e,
        query
      };
    }
  }

  const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
    return array.edges.map((edge) => edge?.node);
  };

  const reshapeCart = (cart: ShopifyCart): Cart => {
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

  const reshapeCollection = (collection: ShopifyCollection): Collection | undefined => {
    if (!collection) {
      return undefined;
    }

    return {
      ...collection,
      path: `/search/${collection.handle}`
    };
  };
  const reshapeShopifyId = (id: string) => {
    // extract 45743468380395 from gid://shopify/ProductVariant/45743468380395
    return id.split('/').pop();
  };
  const reshapeCollections = (collections: ShopifyCollection[]) => {
    const reshapedCollections = [];

    for (const collection of collections) {
      if (collection) {
        const reshapedCollection = reshapeCollection(collection);

        if (reshapedCollection) {
          reshapedCollections.push(reshapedCollection);
        }
      }
    }

    return reshapedCollections;
  };

  const reshapeImages = (images: Connection<Image>, productTitle: string) => {
    const flattened = removeEdgesAndNodes(images);

    return flattened.map((image) => {
      const filename = image.url.match(/.*\/(.*)\..*/)?.[1];
      return {
        ...image,
        altText: image.altText || `${productTitle} - ${filename}`
      };
    });
  };

  const reshapeProduct = (product: ShopifyProduct, filterHiddenProducts: boolean = true) => {
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

  const reshapeProducts = (products: ShopifyProduct[]) => {
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

  async function createCart(): Promise<Cart> {
    const res = await shopifyFetch<ShopifyCreateCartOperation>({
      query: createCartMutation,
    });

    return reshapeCart(res.body.data.cartCreate.cart);
  }

  async function addToCart(
    cartId: string,
    lines: { merchandiseId: string; quantity: number }[]
  ): Promise<Cart> {
    const res = await shopifyFetch<ShopifyAddToCartOperation>({
      query: addToCartMutation,
      variables: {
        cartId,
        lines
      }
    });
    return reshapeCart(res.body.data.cartLinesAdd.cart);
  }

  async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
    const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
      query: removeFromCartMutation,
      variables: {
        cartId,
        lineIds
      }
    });

    return reshapeCart(res.body.data.cartLinesRemove.cart);
  }

  async function updateCart(
    cartId: string,
    lines: { id: string; merchandiseId: string; quantity: number }[]
  ): Promise<Cart> {
    const res = await shopifyFetch<ShopifyUpdateCartOperation>({
      query: editCartItemsMutation,
      variables: {
        cartId,
        lines
      }
    });

    return reshapeCart(res.body.data.cartLinesUpdate.cart);
  }

  async function getCart(cartId: string | undefined): Promise<Cart | undefined> {
    if (!cartId) {
      return undefined;
    }

    const res = await shopifyFetch<ShopifyCartOperation>({
      query: getCartQuery,
      variables: { cartId },
      tags: [TAGS.cart]
    });

    // Old carts become `null` when you checkout.
    if (!res.body.data.cart) {
      return undefined;
    }

    return reshapeCart(res.body.data.cart);
  }

  async function getCollection(handle: string): Promise<Collection | undefined> {
    const res = await shopifyFetch<ShopifyCollectionOperation>({
      query: getCollectionQuery,
      tags: [TAGS.collections],
      variables: {
        handle
      }
    });

    return reshapeCollection(res.body.data.collection);
  }

  async function getCollectionProducts({
    collection,
    reverse,
    sortKey,
    first = 12,
    after
  }: {
    collection: string;
    reverse?: boolean;
    sortKey?: string;
    first?: number;
    after?: string;
  }): Promise<{ products: Product[], pageInfo: { hasNextPage: boolean, endCursor: string } }> {
    const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
      query: getCollectionProductsQuery,
      tags: [TAGS.collections, TAGS.products],
      variables: {
        handle: collection,
        reverse,
        sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey,
        first,
        after
      }
    });

    if (!res.body.data.collection) {
      console.log(`No collection found for \`${collection}\``);
      return { products: [], pageInfo: { hasNextPage: false, endCursor: '' } };
    }

    return {
      products: reshapeProducts(removeEdgesAndNodes(res.body.data.collection.products)),
      pageInfo: res.body.data.collection.products.pageInfo
    };
  }


  async function getCollections(): Promise<Collection[]> {
    const res = await shopifyFetch<ShopifyCollectionsOperation>({
      query: getCollectionsQuery,
      tags: [TAGS.collections]
    });
    const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
    const collections = [
      ...reshapeCollections(
        shopifyCollections.filter(
          (collection: ShopifyCollection) =>
            !collection.handle.startsWith('hidden-') &&
            !collection.title.includes(HIDDEN_PRODUCT_TAG)
        )
      )
    ];
    return collections;
  }

  async function getProduct(handle: string): Promise<Product | undefined> {
    const res = await shopifyFetch<ShopifyProductOperation>({
      query: getProductQuery,
      variables: {
        handle
      },
      tags: [TAGS.products]
    });

    return reshapeProduct(res.body.data.product);
  }

  async function getProductRecommendations(productId: string): Promise<Product[]> {
    const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
      query: getProductRecommendationsQuery,
      variables: {
        productId
      },
      tags: [TAGS.products]
    });

    return reshapeProducts(res.body.data.productRecommendations || []);
  }

async function performPredictiveSearch({
  query
}: {
  query: string
}): Promise<SearchResults> {
  const res = await shopifyFetch<predictiveSearchOperation>({
    query: predictiveSearchQuery,
    variables: {
      query
    },
  });

  const results = res.body.data.predictiveSearch;

  return {
    ...results,
    totalCount: results.products.length + results.collections.length + results.pages.length
  };
}


  async function getProducts({
    query,
    reverse,
    sortKey
  }: {
    query: string;
    reverse?: boolean;
    sortKey?: string;
  }): Promise<Product[]> {
    const res = await shopifyFetch<ShopifyProductsOperation>({
      query: getProductsQuery,
      tags: [TAGS.products],
      variables: {
        query,
        reverse,
        sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey
      }
    });

    return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
  }

  async function getMenu(handle: string): Promise<Menu[]> {
  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    tags: [TAGS.collections],
    variables: {
      handle
    }
  });

  return (
    res.body?.data?.menu?.items.map((item: { title: string; url: string }) => ({
      title: item.title,
      path: item.url.replace(domain, '').replace('/collections', '/collection').replace('/pages', '')
    })) || []
  );
}

  async function getPage(handle: string): Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    variables: { handle }
  });

  return res.body.data.pageByHandle;
}

  async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery
  });

  return removeEdgesAndNodes(res.body.data.pages);
}

  async function signInWithEmailAndPassword(data: {
    email: string,
    password: string
  }) {
    const res = await shopifyFetch<ShopifySignInWithEmailAndPasswordOperation>({
      query: signInWithEmailAndPasswordMutation,
      variables: data
    });

    return res.body.data.customerAccessTokenCreate
  }

  const reshapeCustomer = (customer: ShopifyCustomer) : Customer => {
    return {
      ...customer,
      addresses: removeEdgesAndNodes(customer.addresses)
    };
  }

  async function registerAccount(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    acceptsMarketing: boolean;
  })
    : Promise<{
      customer: Customer;
      customerUserErrors: {
        code: string;
        message: string;
      }[];
  }> {
    const res = await shopifyFetch<ShopifyRegisterAccountOperation>({
      query: registerAccountMutation,
      variables: data
    });

    return res.body.data.customerCreate;
  }

  async function customerRecover(email: string) {
    const res = await shopifyFetch<ShopifyCustomerRecoverOperation>({
      query: customerRecoverMutation,
      variables: { email }
    });

    return res.body.data.customerRecover;
  }

  async function getCustomer(customerAccessToken: string) {
    const res = await shopifyFetch<ShopifyCustomerOperation>({
      query: getCustomerQuery,
      variables: { customerAccessToken }
    });

    return res.body.data.customer;
  }

  return {
    createCart,
    addToCart,
    removeFromCart,
    updateCart,
    getCart,
    getCollection,
    getCollectionProducts,
    getCollections,
    getProduct,
    getProductRecommendations,
    performPredictiveSearch,
    getProducts,
    getMenu,
    getPage,
    getPages,
    reshapeShopifyId,
    signInWithEmailAndPassword,
    registerAccount,
    getCustomer,
    customerRecover,
    reshapeCustomer
  };
}
