<template>
  <div>
    <Carousel class="w-full">
      <CarouselContent>
        <CarouselItem v-for="image in product?.images" :key="image.id">
          <div class="overflow-hidden rounded-lg border bg-background">
            <img
              :src="image.url"
              :alt="image.altText || product.title"
              class="aspect-square w-full object-cover object-center transition-all duration-300 hover:scale-105"
            />
          </div>
        </CarouselItem>
      </CarouselContent>
      <div class="flex items-center justify-center gap-2 py-2">
        <CarouselPrevious variant="outline" size="sm" class="h-8 w-8" />
        <CarouselNext variant="outline" size="sm" class="h-8 w-8" />
      </div>
    </Carousel>

    <div class="mt-6 hidden md:block">
      <div class="grid grid-cols-4 gap-4">
        <button
          v-for="(image, i) in product?.images.slice(0, 4)"
          :key="i"
          class="cursor-pointer overflow-hidden rounded-md border bg-background hover:border-primary"
        >
          <img
            :src="image.url"
            :alt="image.altText || product.title"
            class="aspect-square h-full w-full object-cover object-center"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

const props = defineProps({
  product: {
    type: Object,
    default: () => ({}),
  },
});

const { product } = props;

// Computed properties for the product details : not deleting it for now until i have tested the carousel properly
// const productPreviewImage = computed(() => product?.images[0]?.url);
// const ratio = computed(() => product?.images[0]?.width / product?.images[0]?.height);

</script>

<style scoped lang="scss">
.product-media__container {
  --aspect-ratio: var(--preview-ratio);
  --ratio-percent: calc(1 / var(--aspect-ratio) * 100%);

  .media {
    padding-top: var(--ratio-percent);
  }
}
</style>
