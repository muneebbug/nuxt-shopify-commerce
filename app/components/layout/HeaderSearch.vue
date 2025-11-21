<template>
  <div ref="searchTarget" class="relative w-full max-w-sm">
    <form class="relative" @submit.prevent="performFullSearch">
      <Input v-model="query" type="search" placeholder="Search products..." class="w-full rounded-md pr-10"
        @keyup="search" @input="search" @focus="handleFocus" />
      <button type="submit"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground">
        <Icon name="ph:magnifying-glass" class="h-4 w-4" />
      </button>
    </form>

    <HeadlessPopover>
      <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
        <HeadlessPopoverPanel v-if="isSearchOpened" static :style="{ maxHeight: `${props.searchPopoverMaxHeight}px` }"
          class="absolute z-50 mt-1 w-full overflow-hidden overflow-y-auto rounded-md border bg-background p-4 shadow-md">
          <!-- Loading state -->
          <div v-if="isSearching" class="flex items-center justify-center py-4">
            <Loader2 class="h-5 w-5 animate-spin text-muted-foreground" />
          </div>

          <template v-else>
            <!-- No results -->
            <div v-if="results && results?.totalCount <= 0 && !isSearching && query"
              class="rounded-md border p-4 text-center mb-2">
              <p class="text-sm font-medium">No results found</p>
              <NuxtLink :to="`/search?q=${encodeURIComponent(query)}`"
                class="mt-2 text-sm text-primary hover:underline">
                Search for "{{ query }}"
              </NuxtLink>
            </div>

            <!-- Popular collections -->
            <div v-if="!results || results?.totalCount <= 0" class="space-y-4">
              <h3 class="text-sm font-medium">Popular collections</h3>
              <div class="flex flex-wrap gap-2">
                <NuxtLink
                  v-for="(collection, i) in popularCollections"
                  :key="i" :to="`/collection/${collection.handle}`"
                  class="inline-flex items-center rounded-md border bg-muted px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-muted/80">
                  {{ collection.title }}
                </NuxtLink>
              </div>
            </div>

            <!-- Results -->
            <div v-if="results && results?.totalCount > 0" class="space-y-6">
              <!-- Suggested Queries -->
              <div v-if="results.queries && results.queries.length > 0" class="space-y-3">
                <h3 class="text-sm font-medium">Suggested Queries</h3>
                <div class="flex flex-wrap gap-2">
                  <button v-for="queryItem in results.queries" :key="queryItem.text"
                    class="inline-flex items-center rounded-md border bg-muted px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-muted/80"
                    @click="replaceQuery(queryItem.text)">
                    {{ queryItem.text }}
                  </button>
                </div>
              </div>

              <!-- Products -->
              <div v-if="results.products.length > 0" class="space-y-3">
                <h3 class="text-sm font-medium">Products</h3>
                <div class="space-y-2">
                  <NuxtLink v-for="product in results.products" :key="product.id" :to="`/product/${product.handle}`"
                    class="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted">
                    <div class="h-10 w-10 overflow-hidden rounded-md border bg-background">
                      <img :src="product.featuredImage.url" :alt="product.title"
                        class="h-full w-full object-cover object-center">
                    </div>
                    <div class="flex-1 truncate">
                      <p class="line-clamp-1 text-sm font-medium">{{ product.title }}</p>
                    </div>
                  </NuxtLink>
                </div>
              </div>

              <!-- Collections -->
              <div v-if="results.collections.length > 0" class="space-y-3">
                <h3 class="text-sm font-medium">Collections</h3>
                <div class="space-y-2">
                  <NuxtLink v-for="collection in results.collections" :key="collection.id"
                    :to="`/collection/${collection.handle}`"
                    class="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted">
                    <div class="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                      <Icon name="lucide:folder" class="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div class="flex-1 truncate">
                      <p class="line-clamp-1 text-sm font-medium">{{ collection.title }}</p>
                    </div>
                  </NuxtLink>
                </div>
              </div>

              <!-- Pages -->
              <div v-if="results.pages.length > 0" class="space-y-3">
                <h3 class="text-sm font-medium">Pages</h3>
                <div class="space-y-2">
                  <NuxtLink v-for="page in results.pages" :key="page.id" :to="`/${page.handle}`"
                    class="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted">
                    <div class="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                      <Icon name="lucide:file" class="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div class="flex-1 truncate">
                      <p class="line-clamp-1 text-sm font-medium">{{ page.title }}</p>
                    </div>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </template>
        </HeadlessPopoverPanel>
      </transition>
    </HeadlessPopover>
  </div>
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-vue-next';
import type { SearchResults } from '@@/lib/shopify/types';

const { isSearchOpened, open, close, performSearch, isSearching, popularCollections, getPopularCollections } = useSearch();
const query = ref('');

const results = ref<SearchResults>();
const searchTarget = ref(null);


onClickOutside(searchTarget, () => close());
const handleFocus = async () => {
  await getPopularCollections();
  open();
}

const search = useDebounceFn(async () => {
  if (!query?.value) {
    results.value = undefined;
    return;
  }
  results.value = await performSearch(query?.value, 'predictive');
}, 250);

const performFullSearch = () => {
  navigateTo(`/search?q=${encodeURIComponent(query.value)}`);
  isSearchOpened.value = false;
  query.value = '';
}

// Replace the current query with the suggested query
const replaceQuery = (newQuery: string) => {
  query.value = newQuery;
  search();
};

const props = defineProps({
  searchPopoverMaxHeight: {
    type: Number,
    default: 500,
  },
});

const nuxtApp = useNuxtApp();
nuxtApp.hook('page:start', () => {
  close();
});
</script>

<style>
@media screen and (min-width: 750px) {
  .predictive-search__result-group:only-child {
    flex-grow: 1;
  }
}

.predictive-search {
  top: calc(100% + 1rem);
  left: -0.1rem;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.12);
}
</style>
