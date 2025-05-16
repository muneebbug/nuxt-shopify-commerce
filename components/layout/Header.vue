<template>
  <header ref="header" class="header page-width">
    <Button :tiny=true class="navigation-hub-btn">
      <Icon name="ic:baseline-menu" size="30" />
    </Button>
    <NuxtLink to="/" class="header__heading-link justify-self-start text-left">
      <div class="header__logo-wrapper">
        <img src="/fuel-logo.png" alt="logo" class="header__logo max-w-[90px] lg:max-w-full" width="100">
      </div>
    </NuxtLink>

    <LayoutHeaderSearch :searchPopoverMaxHeight="searchPopoverMaxHeight" />

    <div class="header__icons flex justify-self-end pr-4">
      <button @click="open" class="header__icon header__icon--cart relative flex gap-4 items-center">
        <Icon name="ph:shopping-cart-simple-light" size="30" />
        <div class="cart-count-bubble relative flex items-center gap-2 font-semibold">
          <span class="hidden sm:flex">${{ totalAmount }}</span>
          <span class="">({{ totalQuantity }})</span>
        </div>
      </button>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { Button } from '@/components/ui/button'
const cartStore = useCartStore();

const totalAmount = computed(() => cartStore.cart?.cost?.totalAmount?.amount || 0);
const totalQuantity = computed(() => cartStore.cart?.totalQuantity || 0);

const { open, close, isOpened } = useCartDrawer();


// logic to calculate popover height for search
const { height: windowHeight } = useWindowSize();
const header = ref<HTMLElement | null>(null);
// get header tag height
const headerHeight = computed(() => header.value?.getBoundingClientRect().bottom || 0);

const searchPopoverMaxHeight = computed(() => {
  return windowHeight.value - headerHeight.value;
})


</script>

<style lang="scss">
.header {
  padding-top: 30px;
  padding-bottom: 30px;
  display: grid;
  grid-template-areas: "left-icons heading icons";
  align-items: center;

  @media screen and (max-width: 1023px) {
    grid-template-columns: auto 2fr 1fr;
    gap: 2rem;
  }

  @media screen and (min-width: 1024px) {
    grid-template-areas:
      "hub heading inline-search icons"
      "navigation navigation navigation navigation";
    grid-template-columns: auto auto 1fr auto;

  }

}

.navigation-hub-btn {

  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;

  justify-content: center;
  @apply rounded-small;

  @media screen and (min-width: 1024px) {
    margin-right: 3rem;
    min-height: 56px;
    width: 56px;
    grid-area: hub;
  }
}

.header__heading-link {
  grid-area: heading;

  @media screen and (min-width: 1024px) {
    justify-self: center;
  }
}


.header__icons {
  grid-area: icons;
  gap: 1.6rem;

  @media screen and (min-width: 1024px) {
    margin-left: 2.3rem;
  }
}

.header__icon--cart {
  padding: 0;
  padding-left: .07rem;
  margin-right: -1.2rem;
  min-height: 4.4rem;
  min-width: 4.4rem;
}
</style>
