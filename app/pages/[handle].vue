<template>
  <Section :title="page?.title" class="py-20">
    <SectionHeader :title="page?.title" class="mb-0" />
    <div class="section-content__wrapper">
      <div class="markdown prose max-w-full w-full break-words dark:prose-invert text-base-body">
        <!-- eslint-disable-next-line vue/no-v-html : content already sanitized and safe to render -->
        <div v-html="page?.body" />
      </div>
    </div>
  </Section>
</template>

<script lang="ts" setup>
import type { Page } from '@@/lib/shopify/types';


const route = useRoute();
const { handle } = route.params as { handle: string };

const { getPage } = useShopify();
const page = ref<Page | undefined>(undefined);
page.value = await getPage(handle);




</script>

<style></style>
