<template>
  <div ref="searchTarget" class="inline-search-form ml-12 hidden lg:block relative">
    <form @submit.prevent="search" class="field flex relative w-full">
      <Input v-model="query" @keyup="search" @input="search" @focus="open" type="text" id="inline-search"
        autocomplete="off" placeholder="Search" class="search__input field__input border-border border-opacity-20" />
      <button type="submit" class="absolute right-6 inset-y-0 flex items-center justify-end px-2">
        <Icon name="ph:magnifying-glass" size="30" class="size-8 text-current" />
      </button>
    </form>
    <HeadlessPopover v-slot="{ open }">
      <transition enter-active-class="transition duration-200 ease-out" enter-from-class="translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1 opacity-0">
        <HeadlessPopoverPanel v-if="isSearchOpened" static :style="{ maxHeight: `${props.searchPopoverMaxHeight}px` }"
          class="predictive-search overflow-scrollbar p-12 absolute border border-border border-opacity-10 bg-white z-[3] rounded-medium overflow-y-auto block w-full min-w-[500px]">
          <div v-if="isSearching" class="predictive-search__loading-state flex justify-center p-4">
            <Icon name="local:button-loader" class="w-[18px]" />
          </div>
          <template v-else>
            <div v-if="results && results?.totalCount <= 0 && !isSearching && query"
              class="predictive-search-option-search-keywords mb-8 p-12 break-all border border-border border-opacity-10 rounded-medium text-center">
              <h2 class="h5">
                No Results Found
              </h2>
              <NuxtLink :to="`/search/q=${query}`">
                Search for "{{ query }}"
              </NuxtLink>
            </div>


            <div v-if="!results || results?.totalCount <= 0"
              class="predictive-search__result-group predictive-custom-suggestions">
              <div class="">
                <h2 id="predictive-search-custom-queries" class="predictive-search__heading h5 mb-4">
                  Popular collections
                </h2>
                <ul id="predictive-search-custom-queries-list"
                  class="predictive-search__results-list flex flex-wrap gap-6">
                  <li v-for="i in 5" :key="i" id="predictive-search-option-query-1" class="predictive-search__list-item"
                    role="option" aria-selected="false">
                    <a href="/collections/endurance-boost"
                      class="predictive-search__item border border-border border-opacity-20 rounded-medium flex text-left w-full max-w-fit gap-4 text-[1.4rem] font-bold p-6"
                      tabindex="-1">
                      Nutritionals
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div v-if="results && results?.totalCount > 0" class="predictive-search-results">
              <div class="predictive-search-results-groups-wrapper flex flex-wrap gap-12 pb-12">
                <div v-if="results.products.length > 0" class="predictive-search__result-group w-full grid gap-12">
                  <div class="predictive-search__result-group">
                    <div class="">
                      <h2 class="predictive-search-products h5 mb-6">
                        Products
                      </h2>
                      <ul class="predictive-search__results-list grid gap-6">
                        <li v-for="product in results.products" class="predictive-search__list-item">
                          <div class="product-card-wrapper h-full relative">
                            <div style="--ratio-percent: 131.95876288659795%;"
                              class="card flex p-12 border border-border border-opacity-20 rounded-large items-center gap-6 text-left">
                              <div class="card__inner ratio w-full max-w-[80px] flex relative items-stretch"
                                style="--ratio-percent: 131.95876288659795%;">
                                <NuxtLink :to="`/product/${product.handle}`"
                                  class="absolute top-0 left-0 right-0 bottom-0 opacity-0 z-[1] w-full h-full">
                                  {{ product.title }}
                                </NuxtLink>
                                <div
                                  class="card__media rounded-medium overflow-hidden z-0 w-full bottom-0 absolute top-0">
                                  <div
                                    class="media w-full absolute bottom-0 top-0 bg-transparent block overflow-hidden">
                                    <img :src="product.featuredImage.url"
                                      class="block max-w-full w-full h-full absolute top-0 bottom-0 left-0 right-0 object-cover object-center" />
                                  </div>
                                </div>
                              </div>
                              <div class="card__content flex gap-4 justify-between w-full">
                                <div class="card__information w-full">
                                  <h3 class="h6 card__heading">
                                    <NuxtLink :to="`/product/${product.handle}`">
                                      {{ product.title }}
                                    </NuxtLink>
                                  </h3>
                                </div>
                                <div class="quick-add flex items-center relative z-[1]">
                                  <Button :to="`/product/${product.handle}`" :tiny="true">
                                    <Icon name="material-symbols-light:arrow-outward" size="20" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
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
const loading = ref(false);

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

.search__input {
  min-height: 2px;
  height: 5.6rem;
  padding: 1.5rem 2rem;
  padding-right: 9.8rem;
  margin: 1px;
  min-width: calc(7rem + 2px);
}
</style>
