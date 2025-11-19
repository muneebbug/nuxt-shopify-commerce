<template>
  <div>
    <Section class-name="py-10 md:py-16">
      <SectionHeader
        :title="`Search results for: ${query || 'All products'}`"
        centered
      />

      <!-- Search bar -->
      <div class="max-w-md mx-auto mb-8">
        <form class="relative" @submit.prevent="submitSearch">
          <Input
            v-model="searchInput"
            type="search"
            placeholder="Search products, collections, and pages..."
            class="w-full rounded-md pr-10"
            autofocus
          />
          <button
            type="submit"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
          >
            <Icon name="ph:magnifying-glass" class="h-4 w-4" />
          </button>
        </form>
      </div>

      <div v-if="isSearching" class="flex items-center justify-center py-12">
        <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
      </div>

      <div v-else-if="!results || results.totalCount === 0" class="py-12 text-center">
        <p class="text-lg font-medium text-muted-foreground">No results found for "{{ query }}"</p>
        <p class="mt-4">Try searching for something else or browse our collections</p>

        <div class="mt-8">
          <h3 class="text-xl font-medium mb-4">Popular collections</h3>
          <div class="flex flex-wrap justify-center gap-3">
            <NuxtLink
              v-for="collection in ['Nutritionals', 'Supplements', 'Protein', 'Vitamins', 'Pre-workouts']"
              :key="collection"
              :to="`/collection/${collection.toLowerCase()}`"
              class="inline-flex items-center rounded-md border bg-muted px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/80"
            >
              {{ collection }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-else class="py-6 space-y-12">
        <!-- Suggested Queries -->
        <div v-if="results.queries && results.queries.length > 0" class="space-y-4">
          <h2 class="text-xl font-medium">Related Searches</h2>
          <div class="flex flex-wrap gap-2">
            <NuxtLink
              v-for="queryItem in results.queries"
              :key="queryItem.text"
              :to="`/search?q=${encodeURIComponent(queryItem.text)}`"
              class="inline-flex items-center rounded-md border bg-muted px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/80"
            >
              {{ queryItem.text }}
            </NuxtLink>
          </div>
        </div>

        <!-- Products -->
        <div v-if="results.products && results.products.length > 0" class="space-y-4">
          <h2 class="text-xl font-medium">Products</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <NuxtLink
              v-for="product in results.products"
              :key="product.id"
              :to="`/product/${product.handle}`"
              class="group"
            >
              <div class="overflow-hidden rounded-md border bg-background aspect-square">
                <img
                  :src="product.featuredImage.url"
                  :alt="product.title"
                  class="h-full w-full object-cover object-center transition-all duration-300 group-hover:scale-105"
                >
              </div>
              <div class="mt-3">
                <h3 class="text-sm font-medium line-clamp-2">{{ product.title }}</h3>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Collections -->
        <div v-if="results.collections && results.collections.length > 0" class="space-y-4">
          <h2 class="text-xl font-medium">Collections</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <NuxtLink
              v-for="collection in results.collections"
              :key="collection.id"
              :to="`/collection/${collection.handle}`"
              class="group flex items-center gap-4 rounded-md border p-4 transition-colors hover:bg-muted"
            >
              <div class="flex h-12 w-12 items-center justify-center rounded-md border bg-muted">
                <Icon name="lucide:folder" class="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 class="font-medium">{{ collection.title }}</h3>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Pages -->
        <div v-if="results.pages && results.pages.length > 0" class="space-y-4">
          <h2 class="text-xl font-medium">Pages</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <NuxtLink
              v-for="page in results.pages"
              :key="page.id"
              :to="`/${page.handle}`"
              class="group flex items-center gap-4 rounded-md border p-4 transition-colors hover:bg-muted"
            >
              <div class="flex h-12 w-12 items-center justify-center rounded-md border bg-muted">
                <Icon name="lucide:file" class="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 class="font-medium">{{ page.title }}</h3>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </Section>
  </div>
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-vue-next';
import type { SearchResults } from '@@/lib/shopify/types';

const route = useRoute();
const router = useRouter();
const query = ref<string>(route.query.q as string || '');
const searchInput = ref<string>(route.query.q as string || '');
const results = ref<SearchResults | null>(null);
const isSearching = ref(false);

// Perform search based on the query parameter
const { performSearch } = useSearch();

async function doSearch() {
  if (!query.value) {
    results.value = null;
    return;
  }

  isSearching.value = true;
  results.value = await performSearch(query.value, 'normal');
  isSearching.value = false;
}

// Submit search form
function submitSearch() {
  if (searchInput.value) {
    router.push(`/search?q=${encodeURIComponent(searchInput.value)}`);
  }
}

// Watch for route changes to update the search
watch(() => route.query.q, async (newQuery) => {
  query.value = newQuery as string || '';
  searchInput.value = newQuery as string || '';
  await doSearch();
}, { immediate: true });

// Meta tags
useHead({
  title: computed(() => query.value ? `Search: ${query.value}` : 'Search'),
  meta: [
    {
      name: 'description',
      content: computed(() => `Search results for "${query.value}" in our store`)
    }
  ]
});
</script>
