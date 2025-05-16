<template>
  <Sheet v-model:open="isOpened">
    <SheetContent side="right" class="max-w-full w-[600px] flex flex-col p-0">
      <SheetHeader class="mb-4 p-6 pb-0">
        <SheetTitle>
          Shopping cart
        </SheetTitle>
      </SheetHeader>
      <ScrollArea class="h-full px-6" v-if="items && items.length > 0">
        <div class="drawer__cart-items-wrapper">

          <div
            class="drawer__cart-item relative border border-border border-opacity-20 rounded-large mb-8 overflow-hidden"
            v-for="item in items" :key="item.id">
            <div v-if="loadingStates[item.merchandise.id]"
              class="loading-spinner absolute top-0 left-0 right-0 bottom-0 w-full h-full flex items-center justify-center bg-white z-10 opacity-90">
              <Icon name="local:button-loader" size="24" class="w-[18px]" />
            </div>

            <div class="cart-item__media relative">
              <NuxtLink :onclick="close"
                class="cart-item__media-link block absolute bottom-0 left-0 right-0 top-0 w-full h-full"
                :to="`/product/${item.merchandise?.product?.handle}`">
              </NuxtLink>
              <img class="rounded-medium" :src="item.merchandise?.product?.featuredImage?.url"
                :alt="item.merchandise?.product?.title" />
            </div>
            <div class="cart-item__details">
              <NuxtLink :onclick="close" :to="`/product/${item.merchandise?.product?.handle}`" class="h6">
                {{ item.merchandise?.product?.title }}
              </NuxtLink>
              <dl class="mt-2">
                <div class="product-options">
                  <span v-for="(option, index) in item.merchandise.selectedOptions" :key="option.value">
                    <!-- slash will be added if there are more options -->
                    {{ option.value }} {{ item.merchandise.selectedOptions.length > index + 1 ? '/' : '' }}
                  </span>
                </div>
              </dl>
              <div class="cart_price_items mt-2 font-bold text-[22px]">
                ${{ item.cost.totalAmount.amount }}
              </div>
            </div>
            <div class="cart-item__quantity flex flex-col justify-center items-center">
              <div class="quantity-input mb-4">
                <NumberField id="age" :default-value="1" :min="0" v-model="item.quantity"
                  @update:model-value="updateItemLocal({ merchandiseId: item.merchandise?.id, quantity: item.quantity })">
                  <NumberFieldContent>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                  </NumberFieldContent>
                </NumberField>
              </div>

              <button @click="removeItemLocal(null, item?.merchandise?.id)"
                class="text-center font-bold underline text-destructive">
                Remove
              </button>
            </div>
          </div>
        </div>
      </ScrollArea>
      <!-- Empty Cart -->
      <div class="cart-empty px-6" v-else>
        <div
          class="cart-empty__wrapper border border-border border-opacity-20 rounded-large p-12 flex flex-col items-center justify-center">
          <div class="empty-icon mb-2">
            <Icon name="ph:shopping-cart-simple-light" size="60" />
          </div>
          <div class="empty-text mb-8">
            <h1 class="h4">
              Your cart is empty
            </h1>
          </div>
          <div class="empty-button">
            <Button to="/">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>

      <div v-if="items && items.length > 0"
        class="cart-footer flex flex-col gap-6 justify-center items-center p-6 shadow shadow-slate-300">
        <div
          class="cart_totals_box p-6 w-full rounded-medium border border-border border-opacity-20 text-white bg-foreground">
          <div class="totals flex w-full justify-between">
            <h2 class="totals__total h3">Total</h2>
            <p class="totals__total-value h3">
              ${{ cart?.cost?.totalAmount?.amount }}
            </p>
          </div>
        </div>
        <Button class="w-full" @click="redirectToCheckout">
          Checkout
        </Button>
      </div>


    </SheetContent>

  </Sheet>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'

import type { Cart } from '~/lib/shopify/types';
import ScrollArea from '../ui/scroll-area/ScrollArea.vue';

const { isOpened } = useCartDrawer()
const cart = computed<Cart | undefined>(() => useCartStore().cart);

const items = computed(() => useCartStore().cart?.lines)
const { close } = useCartDrawer();
const { removeItem, updateItemQuantity, redirectToCheckout } = useCart();

const loadingStates = ref<Record<string, boolean>>({});

const nuxtApp = useNuxtApp();

const updateItemLocal = async (payload: {
  merchandiseId: string;
  quantity: number;
}) => {
  loadingStates.value[payload.merchandiseId] = true;
  await updateItemQuantity(null, payload);
  loadingStates.value[payload.merchandiseId] = false;
}

const removeItemLocal = async (prevState: any, itemId: string) => {
  loadingStates.value[itemId] = true;
  await removeItem(null, itemId);
  loadingStates.value[itemId] = false;
};

nuxtApp.hook('page:start', () => {
  close();
});
</script>

<style lang="scss">
.drawer__cart-item {
  display: grid;
  grid-template-columns: 10rem 1fr 13rem;
  grid-template-areas:
    "media item-details quantity";
  column-gap: 2rem;
  padding: 3rem;

  @media screen and (max-width: 639px) {
    padding: 1.5rem;
    display: flex;
    flex-wrap: wrap;
  }
}

.cart-item__media {
  grid-area: media;

  @media screen and (max-width: 639px) {
    width: 100%;
    max-width: 85px;
    margin-bottom: 1rem;
  }
}

.cart-item__details {
  width: auto;
  grid-area: 'item-details';

  @media screen and (max-width: 639px) {
    width: calc(100% - 105px);
    min-width: calc(100% - 105px);
  }
}

.cart-item__quantity {
  grid-area: quantity;

  @media screen and (max-width: 639px) {
    width: 100%;
    margin-top: 10px;
  }
}
</style>
