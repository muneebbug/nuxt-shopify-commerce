<template>
  <footer class="border-t">
    <div class="container flex flex-col gap-8 py-12 md:py-16 m-auto mx-auto px-4 md:px-6">
      <div class="flex flex-col gap-4 md:flex-row md:justify-between">
        <div class="space-y-4">
          <NuxtLink to="/" class="flex items-center">
            <img src="/fuel-logo.png" alt="Fuel Logo" class="h-8 w-auto" >
          </NuxtLink>
          <p class="text-sm text-muted-foreground max-w-xs">
            A modern e-commerce experience built with Nuxt 3, Shopify, and shadcn.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div class="space-y-3">
            <h3 class="text-sm font-medium">Shop</h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink to="/collection/all" class="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  All Products
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/collection/featured" class="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Featured
                </NuxtLink>
              </li>
            </ul>
          </div>
          <div class="space-y-3">
            <h3 class="text-sm font-medium">Company</h3>
            <ul class="space-y-2">
              <li v-for="(link, index) in navLinks" :key="index">
                <NuxtLink :to="link.path" class="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {{ link.title }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-t border-border pt-8">
        <p class="text-sm text-muted-foreground">
          © 2023-2024 FUEL, Inc. All rights reserved.
        </p>
        <div class="flex items-center gap-4">
          <a href="https://github.com/muneebbug/nuxt-shopify-commerce" target="_blank" rel="noreferrer" class="text-sm text-muted-foreground transition-colors hover:text-foreground">
            View source
          </a>
          <p class="text-sm text-muted-foreground">
            Created by <a href="https://github.com/muneebbug" target="_blank" rel="noreferrer" class="font-medium transition-colors hover:text-foreground">@muneebbug</a>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import type { Menu } from '@@/lib/shopify/types';
const { getMenu } = useShopify();
const navLinks = ref([]) as Ref<Menu[]>;

onMounted(async () => {
  navLinks.value = await getMenu('footer');
});
</script>
