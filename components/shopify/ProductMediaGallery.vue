<template>
  <div>
    <Carousel class="w-full" ref="carousel">
      <CarouselContent>
        <CarouselItem v-for="(image, index) in product?.images" :key="index" :opts="{prevNext: false}">
          <div class="overflow-hidden rounded-lg border bg-background">
            <img
              :src="image.url"
              :alt="image.altText || product.title"
              class="w-full object-cover object-center transition-all duration-300 hover:scale-105"
            />
          </div>
        </CarouselItem>
      </CarouselContent>
        <CarouselPrevious variant="outline" size="sm" class="absolute top-1/2 left-2 -translate-y-1/2" />
        <CarouselNext variant="outline" size="sm" class="absolute top-1/2 right-2 -translate-y-1/2" />
    </Carousel>

    <div class="mt-4 hidden md:block">
      <div class="grid grid-cols-4 gap-4">
        <button
          v-for="(image, i) in product?.images.slice(0, 4)"
          :key="i"
          class="cursor-pointer overflow-hidden rounded-md border bg-background"
          :class="{ 'border-primary': currentIndex === i, 'hover:border-primary': currentIndex !== i }"
          @click="selectImage(i)"
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
import { ref, onMounted, watch, type UnwrapRef } from 'vue'
import type { UnwrapRefCarouselApi } from '@/components/ui/carousel/interface'

const props = defineProps({
  product: {
    type: Object,
    default: () => ({}),
  },
});

const { product } = props;

const carousel = ref<InstanceType<typeof Carousel> | null>(null);
const carouselApi = ref<UnwrapRef<UnwrapRefCarouselApi> | null>(null);
const currentIndex = ref(0);

// Function to select a specific image
function selectImage(index: number) {
  if (carouselApi.value && index >= 0 && index < (product?.images?.length || 0)) {
    carouselApi.value.scrollTo(index);
    currentIndex.value = index;
  }
}

// Initialize the carousel API when component is mounted
onMounted(() => {
  if (carousel.value) {
    watch(() => carousel.value?.carouselApi, (api) => {
      if (api) {
        carouselApi.value = api;

        // Listen for slide changes to update the currentIndex
        api.on('select', () => {
          currentIndex.value = api.selectedScrollSnap();
        });
      }
    }, { immediate: true });
  }
});

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
