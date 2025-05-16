<template>
  <div class="product grid grid-cols-2">
    <ProductMediaGallery :product="product" />
    <div class="product-info__wrapper md:pl-20">
      <div class="product-info">
        <p class="uppercase">
          {{ product.vendor }}
        </p>
        <div class="product__title">
          <h1 class="h3">
            {{ product.title }}
          </h1>
        </div>
        <div class="price">
          <div class="price__container">
            <div class="price__sale flex flex-wrap items-center gap-x-4 gap-y-2 mt-4"
              v-if="currentVariantCompareAtPrice > 0 && currentVariantCompareAtPrice > currentVariantPrice">
              <span class="price-item price-item--sale text-[2.8rem] font-semibold text-red-700">
                ${{ currentVariantPrice }}
              </span>
              <span>
                <s class="price-item price-item--regular text-[1.4rem] font-semibold">
                  ${{ currentVariantCompareAtPrice }}
                </s>
              </span>
            </div>

            <div class="price__regular mt-4" v-else>
              <span class="price-item price-item--regular text-[2.8rem] font-semibold">
                ${{ currentVariantPrice }}
              </span>
            </div>

            <!-- Dynamically generated options -->
            <div class="variant-radios my-12">
              <fieldset v-for="option in options" :key="option.id" class="mb-12">
                <HeadlessRadioGroup v-model="selectedOptions[option.name]" class="space-y-2">
                  <HeadlessRadioGroupLabel class="block mb-4 "><span class="font-bold">{{ option.name }}</span> : {{
                    selectedOptions[option.name] }}</HeadlessRadioGroupLabel>
                  <div class="flex flex-wrap gap-x-2 gap-y-2">
                    <HeadlessRadioGroupOption v-for="value in option.values" :key="value" v-slot="{ checked }"
                      :value="value">
                      <div
                        class="px-[2rem] py-[1.7rem] text-center select-none cursor-pointer border border-opacity-20 rounded-small"
                        :class="checked ? 'border-ring' : 'border-border'">
                        {{ value }}
                      </div>
                    </HeadlessRadioGroupOption>
                  </div>

                </HeadlessRadioGroup>
              </fieldset>


            </div>
            <!-- {{ selectedOptions }}

            {{ selectedValues }}

            <pre>
              {{ currentVariant }}
            </pre> -->
            <!-- <pre>
              {{ cart.cost }}
            </pre> -->
            <div class="quantity-add__button flex items-center gap-6 my-12">
              <div class="quantity-input">
                <NumberField id="age" :default-value="1" :min="1" v-model="quantity">
                  <NumberFieldContent>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                  </NumberFieldContent>
                </NumberField>
              </div>

              <Button :loading="loading" class="flex-1" :disabled="quantity <= 0" @click="addToCart">
                Add to Cart
              </Button>

            </div>

            <div class="product-description">
              <h3 class="h4 mb-4">Description</h3>
              <div class="rte" v-html="product.descriptionHtml">

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Button } from '@/components/ui/button'
const { cart } = useCartStore();
const { addItem } = useCart();

const loading = ref(false);




import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'
import ProductMediaGallery from './ProductMediaGallery.vue';

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
  // return Object.values(selectedOptions.value);
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
    await addItem(currentVariant.value.id, quantity.value);
    loading.value = false;
  }
  catch (error) {
    console.error('Error adding item to cart:', error);
    loading.value = false;
    return;
  }
}




</script>

<style scoped lang="scss">
.product {
  // 100% width on mobile, split equally on desktop
  grid-template-columns: 1fr;

  @media screen and (min-width: 768px) {
    grid-template-columns: 55% 45%;
  }
}

.quantity-add__button {
  input {
    font-size: var(--font-body-size);
  }
}
</style>
