<template>
  <div class="min-h-screen">
    <NuxtLoadingIndicator />
      <Toaster />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

  </div>
</template>
<script setup lang="ts">
import 'vue-sonner/style.css'
import { Toaster } from '@/components/ui/sonner'

// Set up color mode
const colorMode = useColorMode();
// Use system preference as default
colorMode.preference = colorMode.preference || 'system';
</script>
