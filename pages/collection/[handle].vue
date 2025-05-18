<template>
  <Section className="py-10 md:py-16">
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
      <h1 class="text-3xl font-bold tracking-tight md:text-4xl">{{ collection?.title }}</h1>
      <ShopifySortingDropdown :list="sorting" v-model="emittedSort" @update:model-value="fetchProducts" />
    </div>

    <div :class="{ 'opacity-50': loading && products.length === 0 }">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <ShopifyProductItem v-for="product in products" :key="product.id" :product="product" />
      </div>

      <div v-if="loading && products.length > 0" class="flex justify-center my-8">
        <Loader2 class="h-8 w-8 animate-spin" />
      </div>

      <div v-if="!hasNextPage && products.length > 0" class="text-center text-gray-500 my-8">
        No more products to load
      </div>

      <div ref="loadMoreTrigger" class="h-1" />
    </div>
  </Section>
</template>

<script setup lang="ts">
import { defaultSort, sorting } from '@/lib/constants';
import type { Product, Collection } from '@/lib/shopify/types';
import { useInfiniteScroll, useScroll } from '@vueuse/core';
import { Loader2 } from 'lucide-vue-next';

const route = useRoute();
const searchParams = useRoute().query;

const { handle } = route.params as { handle: string };
const loading = ref(false);
const endCursor = ref<string | null>(null);
const hasNextPage = ref(true);
const loadMoreTrigger = ref<HTMLElement | null>(null);

const { getCollectionProducts, getCollection } = useShopify();
const collection = ref<Collection | undefined>(undefined);
collection.value = await getCollection(handle);

const { sort } = searchParams as { [key: string]: string };
const { slug, sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
const emittedSort = ref(slug) as Ref<string>;

const products = ref<Product[]>([]);

const initialLoad = async () => {
  loading.value = true;
  const { sortKey, reverse } = sorting.find((item) => item.slug === emittedSort.value) || defaultSort;
  const response = await getCollectionProducts({
    collection: handle,
    sortKey,
    reverse,
    first: 12
  });

  products.value = response.products;
  hasNextPage.value = response.pageInfo.hasNextPage;
  endCursor.value = response.pageInfo.endCursor;
  loading.value = false;
};

const loadMore = async () => {
  if (loading.value || !hasNextPage.value || !endCursor.value) return;

  loading.value = true;
  const { sortKey, reverse } = sorting.find((item) => item.slug === emittedSort.value) || defaultSort;

  const response = await getCollectionProducts({
    collection: handle,
    sortKey,
    reverse,
    first: 12,
    after: endCursor.value
  });

  products.value.push(...response.products);
  hasNextPage.value = response.pageInfo.hasNextPage;
  endCursor.value = response.pageInfo.endCursor;
  loading.value = false;
};

// Set up infinite scroll
useInfiniteScroll(
  loadMoreTrigger,
  loadMore,
  { distance: 100, throttle: 500 }
);

const fetchProducts = async () => {
  loading.value = true;
  products.value = [];
  hasNextPage.value = true;
  endCursor.value = null;

  const { sortKey, reverse } = sorting.find((item) => item.slug === emittedSort.value) || defaultSort;
  const { push } = useRouter();
  push({ query: { ...route.query, sort: emittedSort.value } });

  const response = await getCollectionProducts({
    collection: handle,
    sortKey,
    reverse,
    first: 12
  });

  products.value = response.products;
  hasNextPage.value = response.pageInfo.hasNextPage;
  endCursor.value = response.pageInfo.endCursor;
  loading.value = false;
};

// Initial load of products
await initialLoad();
</script>

<style>
.collection-product__list .product-card__item {
  padding-left: 0;
  padding-right: 0;
}

.facets-wrapper {
  margin-right: 5rem;
  width: 335px;
  flex-shrink: 0;
}
</style>
