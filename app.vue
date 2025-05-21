<template>
  <div class="h-full">
    <NuxtLoadingIndicator />
    <ClientOnly>
      <Toaster />
    </ClientOnly>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

  </div>
</template>
<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
// @ts-ignore
import { provideUseId } from '@headlessui/vue';
provideUseId(() => useId());

// Set up color mode
const colorMode = useColorMode();
// Use system preference as default
colorMode.preference = colorMode.preference || 'system';
</script>
