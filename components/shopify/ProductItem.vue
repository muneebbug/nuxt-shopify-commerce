<template>
  <div class="group relative overflow-hidden rounded-md border bg-background">
    <NuxtLink :to="productUrl" class="block h-full">
      <div class="aspect-square overflow-hidden">
        <img
          :src="productPreviewImage"
          :alt="product.title"
          class="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
        >
      </div>
      <div class="p-4">
        <h3 class="line-clamp-1 text-sm font-medium">
          {{ product.title }}
        </h3>
        <div class="mt-2 flex items-center justify-between">
          <div>
            <div v-if="largestPrice > 0" class="flex items-center gap-2">
              <p class="text-sm font-medium text-primary">${{ smallestPrice }}</p>
              <p class="text-xs text-muted-foreground line-through">${{ largestPrice }}</p>
            </div>
            <p v-else class="text-sm font-medium">${{ smallestPrice }}</p>
          </div>
          <div class="rounded-sm bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            {{ product.vendor }}
          </div>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  product: {
    type: Object,
    default: () => { },
  },
});

const { product } = props;

const productUrl = computed(() => '/product/' + product?.handle);

const productPreviewImage = computed(() => product?.images[0]?.url);

// const ratio = computed(() => product?.images[0]?.width / product?.images[0]?.height);

// smallest price of the product variants
const smallestPrice = computed(() => parseFloat(product?.priceRange?.minVariantPrice?.amount));

// largest price of the product variants
const largestPrice = computed(() => parseFloat(product?.compareAtPriceRange?.maxVariantPrice?.amount));

</script>
