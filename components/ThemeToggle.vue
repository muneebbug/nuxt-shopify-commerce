<template>
  <Button
    variant="ghost"
    size="icon"
    @click="toggleColorMode"
    class="relative"
  >
    <Icon v-if="currentMode === 'dark'" name="ph:sun-light" class="h-5 w-5 transition-all" />
    <Icon v-else name="ph:moon-light" class="h-5 w-5 transition-all" />
  </Button>
</template>

<script lang="ts" setup>
import { Button } from '@/components/ui/button';

const colorMode = useColorMode();
const currentMode = computed(() => colorMode.value);

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
}
</script>
