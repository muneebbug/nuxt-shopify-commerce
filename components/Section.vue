<template>
  <section :class="[
    'py-8 md:py-12',
    background === 'secondary' ? 'bg-secondary' : 'bg-background',
    className
  ]">
    <div :class="[
      pageWidth ? 'container mx-auto px-4 md:px-6' : '',
    ]">
      <slot></slot>
    </div>
  </section>
</template>

<script lang="ts" setup>
const props = defineProps({
  pageWidth: {
    type: Boolean,
    default: true,
  },
  background: {
    type: String,
    default: '',
  },
  className: {
    type: String,
    default: '',
  }
});
</script>
