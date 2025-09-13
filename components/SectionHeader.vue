<template>
  <div
class="mb-8 md:mb-12" :class="[
    centered ? 'text-center' : '',
    className
  ]">
    <h2 v-if="title" class="text-3xl font-bold tracking-tight md:text-4xl">
      {{ title }}
    </h2>
    <p v-if="description" class="mt-4 text-muted-foreground">
      {{ description }}
    </p>
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  centered: {
    type: Boolean,
    default: false,
  },
  className: {
    type: String,
    default: '',
  }
});
</script>

<style></style>
