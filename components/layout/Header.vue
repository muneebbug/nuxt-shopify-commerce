<template>
  <header ref="header" class="sticky top-0 z-40 w-full border-b bg-background">
    <div class="container flex h-16 items-center justify-between py-4 m-auto">
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" class="md:hidden">
          <Icon name="ic:baseline-menu" class="h-5 w-5" />
        </Button>
        <NuxtLink to="/" class="flex items-center">
          <img src="/fuel-logo.png" alt="logo" class="h-8 w-auto" >
        </NuxtLink>
        <nav class="hidden md:flex items-center gap-6 ml-6">
          <NuxtLink to="/" class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Home
          </NuxtLink>
          <NuxtLink
to="/collection/all"
            class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Shop
          </NuxtLink>
        </nav>
      </div>

      <div class="hidden md:block max-w-xs w-full mx-4 ml-auto">
        <LayoutHeaderSearch :search-popover-max-height="searchPopoverMaxHeight" />
      </div>
      <div class="flex items-center">
        <Button variant="ghost" size="icon" class="md:hidden" @click="openMobileSearch">
          <Icon name="ph:magnifying-glass" class="h-5 w-5" />
        </Button>
        <ThemeToggle />

        <!-- Account Menu -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon">
              <Icon name="heroicons:user-circle" class="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-48">
            <div v-if="isAuthenticated">
              <DropdownMenuItem as-child>
                <NuxtLink to="/account" class="flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none">
                  My Account
                </NuxtLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem class="text-red-500" @click="logout">
                Sign Out
              </DropdownMenuItem>
            </div>
            <div v-else>
              <DropdownMenuItem as-child>
                <NuxtLink to="/login" class="flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none">
                  Sign In
                </NuxtLink>
              </DropdownMenuItem>
              <DropdownMenuItem as-child>
                <NuxtLink to="/register" class="flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none">
                  Create Account
                </NuxtLink>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" class="relative" @click="open">
          <Icon name="ph:shopping-cart-simple-light" class="h-5 w-5" />
          <span
v-if="totalQuantity > 0"
            class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            {{ totalQuantity }}
          </span>
        </Button>
      </div>
    </div>

    <!-- Mobile search -->
    <div v-if="mobileSearchOpen" class="border-t py-3 px-4 md:hidden">
      <LayoutHeaderSearch :search-popover-max-height="searchPopoverMaxHeight - 64" />
    </div>
  </header>
</template>

<script lang="ts" setup>
import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

const cartStore = useCartStore();
const { isAuthenticated, logout } = useAuth();

// const totalAmount = computed(() => cartStore.cart?.cost?.totalAmount?.amount || 0);
const totalQuantity = computed(() => cartStore.cart?.totalQuantity || 0);

const { open } = useCartDrawer();

// Mobile search state
const mobileSearchOpen = ref(false);
const openMobileSearch = () => {
  mobileSearchOpen.value = !mobileSearchOpen.value;
};

// logic to calculate popover height for search
const { height: windowHeight } = useWindowSize();
const header = ref<HTMLElement | null>(null);
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


  @media screen and (min-width: 1024px) {
    margin-right: 3rem;
    min-height: 56px;
    width: 56px;
    grid-area: hub;
  }
  @apply rounded-small;
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
