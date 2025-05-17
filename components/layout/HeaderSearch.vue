<template>
  <div ref="searchTarget" class="relative w-full max-w-sm">
    <form @submit.prevent="search" class="relative">
      <Input
        v-model="query"
        @keyup="search"
        @input="search"
        @focus="open"
        type="search"
        placeholder="Search products..."
        class="w-full rounded-md pr-10"
      />
      <button
        type="submit"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
      >
        <Icon name="ph:magnifying-glass" class="h-4 w-4" />
      </button>
    </form>

    <HeadlessPopover v-slot="{ open }">
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-1"
      >
        <HeadlessPopoverPanel
          v-if="isSearchOpened"
          static
          :style="{ maxHeight: `${props.searchPopoverMaxHeight}px` }"
          class="absolute z-50 mt-1 w-full overflow-hidden overflow-y-auto rounded-md border bg-background p-4 shadow-md"
        >
          <!-- Loading state -->
          <div v-if="isSearching" class="flex items-center justify-center py-4">
            <Icon name="local:button-loader" class="h-5 w-5 animate-spin text-muted-foreground" />
          </div>

          <template v-else>
            <!-- No results -->
            <div
              v-if="results && results?.totalCount <= 0 && !isSearching && query"
              class="rounded-md border p-4 text-center"
            >
              <p class="text-sm font-medium">No results found</p>
              <NuxtLink
                :to="`/search/q=${query}`"
                class="mt-2 text-sm text-primary hover:underline"
              >
                Search for "{{ query }}"
              </NuxtLink>
            </div>

            <!-- Popular collections -->
            <div v-if="!results || results?.totalCount <= 0" class="space-y-4">
              <h3 class="text-sm font-medium">Popular collections</h3>
              <div class="flex flex-wrap gap-2">
                <NuxtLink
                  v-for="(collection, i) in ['Nutritionals', 'Supplements', 'Protein', 'Vitamins', 'Pre-workouts']"
                  :key="i"
                  :to="`/collection/${collection.toLowerCase()}`"
                  class="inline-flex items-center rounded-md border bg-muted px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-muted/80"
                >
                  {{ collection }}
                </NuxtLink>
              </div>
            </div>

            <!-- Results -->
            <div v-if="results && results?.totalCount > 0" class="space-y-4">
              <div v-if="results.products.length > 0" class="space-y-4">
                <h3 class="text-sm font-medium">Products</h3>
                <div class="space-y-2">
                  <NuxtLink
                    v-for="product in results.products"
                    :key="product.id"
                    :to="`/product/${product.handle}`"
                    class="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted"
                  >
                    <div class="h-10 w-10 overflow-hidden rounded-md border bg-background">
                      <img
                        :src="product.featuredImage.url"
                        :alt="product.title"
                        class="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div class="flex-1 truncate">
                      <p class="line-clamp-1 text-sm font-medium">{{ product.title }}</p>
                    </div>
                    <div class="flex h-8 w-8 items-center justify-center rounded-md hover:bg-background">
                      <Icon name="lucide:arrow-right" class="h-4 w-4" />
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
import { Button } from '@/components/ui/button'
import type { SearchResults } from '~/lib/shopify/types';

const { isSearchOpened, open, close, performSearch, isSearching } = useSearch();
const query = ref('');

const results = ref<SearchResults>();
const searchTarget = ref(null);

onClickOutside(searchTarget, () => close());

const search = useDebounceFn(async () => {
  if (!query?.value) {
    results.value = undefined;
    return;
  }
  results.value = await performSearch(query?.value);
}, 250);

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

<style lang="scss">
.predictive-search__result-group:only-child {
  @media screen and (min-width: 750px) {
    flex-grow: 1;
  }
}

.predictive-search {
  top: calc(100% + 1rem);
  left: -.1rem;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.12);
}

</style>
