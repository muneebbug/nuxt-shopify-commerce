<template>
  <Section className="py-10 md:py-16">
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
      <h1 class="text-3xl font-bold tracking-tight md:text-4xl">{{ collection?.title }}</h1>
      <ShopifySortingDropdown :list="sorting" v-model="emittedSort" @update:model-value="fetchProducts" />
    </div>

    <div :class="{ 'opacity-50': loading }">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <ShopifyProductItem v-for="product in products" :key="product.id" :product="product" />
      </div>
    </div>
  </Section>
</template>

<script setup lang="ts">
import { defaultSort, sorting } from '@/lib/constants';
import type { Product, Collection } from '@/lib/shopify/types';

const route = useRoute();
const searchParams = useRoute().query;

const { handle } = route.params as { handle: string };
const loading = ref(false);

const { getCollectionProducts, getCollection } = useShopify();
const collection = ref<Collection | undefined>(undefined);
collection.value = await getCollection(handle);

const { sort } = searchParams as { [key: string]: string };
const { slug, sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
const emittedSort = ref(slug) as Ref<string>;

const products = ref<Product[]>([]);
products.value = await getCollectionProducts({ collection: handle, sortKey, reverse });

const fetchProducts = async () => {
  loading.value = true;
  const { sortKey, reverse } = sorting.find((item) => item.slug === emittedSort.value) || defaultSort;
  products.value = await getCollectionProducts({ collection: handle, sortKey, reverse });
  const { push } = useRouter();
  push({ query: { ...route.query, sort: emittedSort.value } });
  loading.value = false;
}
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
