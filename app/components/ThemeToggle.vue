<template>
  <Button
    variant="ghost"
    size="icon"
    class="relative"
    @click="toggleColorMode"
  >
    <Icon name="ph:sun-light" class="h-5 w-5 transition-all dark:hidden!" />
    <Icon name="ph:moon-light" class="h-5 w-5 transition-all hidden! dark:inline!" />
  </Button>
</template>

<script lang="ts" setup>
import { Button } from '@/components/ui/button';

const colorMode = useColorMode();

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
}
</script>
