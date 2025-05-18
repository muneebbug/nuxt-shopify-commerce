<template>
  <div class="h-full">
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
// @ts-ignore
import { provideUseId } from '@headlessui/vue';
provideUseId(() => useId());

// Set up color mode
const colorMode = useColorMode();
// Use system preference as default
colorMode.preference = colorMode.preference || 'system';
</script>
