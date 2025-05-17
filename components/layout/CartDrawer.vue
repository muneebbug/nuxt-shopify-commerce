<template>
  <Sheet v-model:open="isOpened">
    <SheetContent side="right" class="flex w-full max-w-md flex-col p-0">
      <div class="flex items-center justify-between border-b px-6 py-4">
        <SheetTitle class="text-lg font-medium">Shopping Cart</SheetTitle>
        <SheetClose class="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <Icon name="lucide:x" class="h-4 w-4" />
          <span class="sr-only">Close</span>
        </SheetClose>
      </div>

      <div class="flex-1 overflow-y-auto">
        <!-- Items in cart -->
        <div v-if="items && items.length > 0" class="flex flex-col gap-4 p-6">
          <div
            v-for="item in items"
            :key="item.id"
            class="relative flex items-start gap-4 rounded-md border p-4"
          >
            <div v-if="loadingStates[item.merchandise.id]"
              class="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-background/80">
              <Icon name="local:button-loader" class="h-5 w-5 animate-spin text-muted-foreground" />
            </div>

            <!-- Product Image -->
            <NuxtLink
              :to="`/product/${item.merchandise?.product?.handle}`"
              @click="close"
              class="h-16 w-16 flex-none overflow-hidden rounded-md border bg-background"
            >
              <img
                :src="item.merchandise?.product?.featuredImage?.url"
                :alt="item.merchandise?.product?.title"
                class="h-full w-full object-cover object-center"
              />
            </NuxtLink>

            <!-- Product Details -->
            <div class="flex-1 space-y-1">
              <div class="flex justify-between">
                <NuxtLink
                  :to="`/product/${item.merchandise?.product?.handle}`"
                  @click="close"
                  class="line-clamp-1 text-sm font-medium"
                >
                  {{ item.merchandise?.product?.title }}
                </NuxtLink>
                <div class="text-sm font-medium">${{ item.cost.totalAmount.amount }}</div>
              </div>

              <div class="text-xs text-muted-foreground">
                <span v-for="(option, index) in item.merchandise.selectedOptions" :key="option.value">
                  {{ option.value }}{{ item.merchandise.selectedOptions.length > index + 1 ? ' / ' : '' }}
                </span>
              </div>

              <div class="flex items-center justify-between pt-2">
                <div class="w-24">
                  <NumberField
                    :default-value="1"
                    :min="0"
                    v-model="item.quantity"
                    @update:model-value="updateItemLocal({ merchandiseId: item.merchandise?.id, quantity: item.quantity })"
                  >
                    <NumberFieldContent>
                      <NumberFieldDecrement />
                      <NumberFieldInput />
                      <NumberFieldIncrement />
                    </NumberFieldContent>
                  </NumberField>
                </div>

                <button
                  @click="removeItemLocal(null, item?.merchandise?.id)"
                  class="text-xs text-muted-foreground underline-offset-4 hover:text-destructive hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty cart state -->
        <div v-else class="flex min-h-[200px] flex-col items-center justify-center p-6">
          <div class="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Icon name="ph:shopping-cart-simple-light" class="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 class="mt-4 text-lg font-medium">Your cart is empty</h3>
          <p class="mt-2 text-center text-sm text-muted-foreground">
            Add items to your cart to get started
          </p>
          <Button @click="close" to="/" class="mt-4">
            Continue Shopping
          </Button>
        </div>
      </div>

      <!-- Cart footer -->
      <div v-if="items && items.length > 0" class="border-t p-6">
        <dl class="space-y-2">
          <div class="flex items-center justify-between">
            <dt class="text-sm text-muted-foreground">Subtotal</dt>
            <dd class="text-sm font-medium">${{ formatNumber(cart?.cost?.subtotalAmount?.amount || 0) }}</dd>
          </div>
          <div class="flex items-center justify-between">
            <dt class="text-sm text-muted-foreground">Tax</dt>
            <dd class="text-sm font-medium">${{ formatNumber(cart?.cost?.totalTaxAmount?.amount || 0) }}</dd>
          </div>
          <div class="flex items-center justify-between border-t border-dashed pt-2">
            <dt class="text-base font-medium">Total</dt>
            <dd class="text-base font-medium">${{ formatNumber(cart?.cost?.totalAmount?.amount || 0) }}</dd>
          </div>
        </dl>
        <Button @click="redirectToCheckout" class="mt-4 w-full">
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
  SheetClose,
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

// Format number to always show two decimal places
const formatNumber = (num: number | string) => {
  return parseFloat(num.toString()).toFixed(2);
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
