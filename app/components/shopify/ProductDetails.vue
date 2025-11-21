<template>
  <div class="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2">
    <ProductMediaGallery :product="product" />
    <div class="space-y-8">
      <div>
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-muted-foreground">{{ product.vendor }}</p>
          <div class="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            In stock
          </div>
        </div>
        <h1 class="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{{ product.title }}</h1>

        <div class="mt-4">
          <div v-if="currentVariantCompareAtPrice > 0 && currentVariantCompareAtPrice > currentVariantPrice"
            class="flex items-center gap-2">
            <p class="text-2xl font-semibold text-primary">${{ currentVariantPrice }}</p>
            <p class="text-sm text-muted-foreground line-through">${{ currentVariantCompareAtPrice }}</p>
          </div>
          <p v-else class="text-2xl font-semibold">${{ currentVariantPrice }}</p>
        </div>
      </div>

      <div class="space-y-6 pt-4">
        <!-- Dynamically generated options -->
        <div class="space-y-6">
          <fieldset v-for="option in options" :key="option.id" class="space-y-3">
            <HeadlessRadioGroup v-model="selectedOptions[option.name]">
              <HeadlessRadioGroupLabel class="block">
                <span class="font-medium">{{ option.name }}:</span> {{ selectedOptions[option.name] }}
              </HeadlessRadioGroupLabel>
              <div class="flex flex-wrap gap-2 mt-2">
                <HeadlessRadioGroupOption v-for="value in option.values" :key="value" v-slot="{ checked }"
                  :value="value">
                  <div
                    class="inline-flex cursor-pointer items-center justify-center rounded-md border px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    :class="checked ? 'border-primary' : 'border-input'">
                    {{ value }}
                  </div>
                </HeadlessRadioGroupOption>
              </div>
            </HeadlessRadioGroup>
          </fieldset>
        </div>

        <div class="flex items-center gap-4">
          <div class="w-24">
            <NumberField id="quantity" v-model="quantity" :default-value="1" :min="1">
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </div>
          <Button class="flex-1" :loading="loading" :disabled="quantity <= 0" @click="addToCart">
            Add to Cart
          </Button>
        </div>

        <div class="border-t pt-6">
          <h3 class="font-medium">Description</h3>
          <!-- eslint-disable-next-line vue/no-v-html : content already sanitized and safe to render -->
          <div class="mt-4 prose prose-sm max-w-none text-muted-foreground" v-html="product.descriptionHtml" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner';

import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'
import ProductMediaGallery from './ProductMediaGallery.vue';

const { addItem } = useCart();

const loading = ref(false);

const quantity = ref(1);

// Define the props
const props = defineProps({
  product: {
    type: Object,
    default: () => ({}),
  },
});

// Destructure the product from props
const { product } = props;


const options = computed(() => product?.options || []);

// Reactive object to store selected options
const selectedOptions = ref({});


const currentVariant = computed(() => product?.variants?.find((variant) => {
  return !variant.selectedOptions.map((option, index) => {
    return selectedValues.value[index] === option.value;
  })
    .includes(false);
}));

// { "Flavor": "Berry Burst", "Weight": "500 g" } to [ "Berry Burst", "500 g" ]
const selectedValues = computed(() => {
  return Object.keys(selectedOptions.value).map(key => selectedOptions.value[key]);
});

// Computed properties for the current variant
const currentVariantPrice = computed(() => parseFloat(currentVariant.value?.price?.amount || 0));
const currentVariantCompareAtPrice = computed(() => parseFloat(currentVariant.value?.compareAtPrice?.amount || 0));

// Initialize selectedOptions with default values
options.value.forEach(option => {
  selectedOptions.value[option.name] = option.values[0] || '';
});

const addToCart = async () => {
  loading.value = true;
  try {
    const res = await addItem(currentVariant.value.id, quantity.value);
    if (!res.success) {
      toast.error(res.error || 'Failed to add item to cart');
    }
    loading.value = false;
  }
  catch (error) {
    console.error('Error adding item to cart:', error);
    toast.error('An unexpected error occurred');
    loading.value = false;
  }
}
</script>

<style scoped>
.product {
  grid-template-columns: 1fr;
}

@media screen and (min-width: 768px) {
  .product {
    grid-template-columns: 55% 45%;
  }
}
</style>
