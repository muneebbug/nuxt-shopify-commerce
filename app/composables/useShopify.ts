// composables/useShopify.js

// import { HIDDEN_PRODUCT_TAG } from '@@/lib/constants';
import type {
  Cart,
  Collection,
  Menu,
  Page,
  Product,
  SearchResults,
  Customer
} from '@@/lib/shopify/types';

export function useShopify() {
  const reshapeShopifyId = (id: string) => {
    // extract 45743468380395 from gid://shopify/ProductVariant/45743468380395
    return id.split('/').pop();
  };

  async function createCart(): Promise<Cart> {
    return await $fetch<Cart>('/api/cart', {
      method: 'POST'
    });
  }

  async function addToCart(
    cartId: string,
    lines: { merchandiseId: string; quantity: number }[]
  ): Promise<Cart> {
    return await $fetch<Cart>('/api/cart/lines/add', {
      method: 'POST',
      body: { cartId, lines }
    });
  }

  async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
    return await $fetch<Cart>('/api/cart/lines/remove', {
      method: 'POST',
      body: { cartId, lineIds }
    });
  }

  async function updateCart(
    cartId: string,
    lines: { id: string; merchandiseId: string; quantity: number }[]
  ): Promise<Cart> {
    return await $fetch<Cart>('/api/cart/lines/update', {
      method: 'POST',
      body: { cartId, lines }
    });
  }

  async function getCart(cartId: string | undefined): Promise<Cart | undefined> {
    if (!cartId) {
      return undefined;
    }
    return await $fetch<Cart | undefined>('/api/cart', {
      params: { cartId }
    });
  }

  async function getCollection(handle: string): Promise<Collection | undefined> {
    return await $fetch<Collection | undefined>(`/api/collections/${handle}`);
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
    return await $fetch<{ products: Product[], pageInfo: { hasNextPage: boolean, endCursor: string } }>(`/api/collections/${collection}/products`, {
      params: {
        reverse,
        sortKey,
        first,
        after
      }
    });
  }


  async function getCollections(): Promise<Collection[]> {
    return await $fetch<Collection[]>('/api/collections');
  }

  async function getProduct(handle: string): Promise<Product | undefined> {
    return await $fetch<Product | undefined>(`/api/products/${handle}`);
  }

  async function getProductRecommendations(productId: string): Promise<Product[]> {
    return await $fetch<Product[]>('/api/products/recommendations', {
        params: { productId }
    });
  }

async function performPredictiveSearch({
  query
}: {
  query: string
}): Promise<SearchResults> {
  return await $fetch<SearchResults>('/api/search', {
    params: { query }
  });
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
    return await $fetch<Product[]>('/api/products', {
      params: {
        query,
        reverse,
        sortKey
      }
    });
  }

  async function getMenu(handle: string): Promise<Menu[]> {
  return await $fetch<Menu[]>(`/api/menu/${handle}`);
}

  async function getPage(handle: string): Promise<Page> {
  return await $fetch<Page>(`/api/pages/${handle}`);
}

  async function getPages(): Promise<Page[]> {
  return await $fetch<Page[]>('/api/pages');
}

  async function signInWithEmailAndPassword(data: {
    email: string,
    password: string
  }) {
    return await $fetch('/api/auth/login', {
      method: 'POST',
      body: data
    });
  }

  async function registerAccount(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    acceptsMarketing?: boolean;
  }) {
    return await $fetch('/api/auth/register', {
      method: 'POST',
      body: data
    });
  }

  async function customerRecover(email: string) {
    return await $fetch('/api/auth/recover', {
      method: 'POST',
      body: { email }
    });
  }

  async function getCustomer(customerAccessToken: string) {
    return await $fetch<Customer>('/api/auth/user', {
      params: { customerAccessToken }
    });
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
    customerRecover
  };
}
