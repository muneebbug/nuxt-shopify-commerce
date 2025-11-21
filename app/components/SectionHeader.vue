<template>
  <div
    :class="[
      'mb-8 md:mb-12',
      centered ? 'text-center' : 'text-left',
      className
    ]"
  >
    <h2
      v-if="title"
      :class="[
        'font-bold tracking-tight',
        sizeClass
      ]"
    >
      {{ title }}
    </h2>
    <p
      v-if="description"
      :class="[
        'mt-4',
        descriptionSizeClass
      ]"
    >
      {{ description }}
    </p>
    <slot />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  centered: { type: Boolean, default: false },
  className: { type: String, default: '' },
  size: { type: String, default: 'xl' }, // 'xl', '2xl', '3xl', '4xl'
  descriptionSize: { type: String, default: 'base' } // 'sm', 'base', 'lg'
});

const sizeClass = computed(() => {
  switch (props.size) {
    case '2xl': return 'text-2xl md:text-3xl';
    case '3xl': return 'text-3xl md:text-4xl';
    case '4xl': return 'text-4xl md:text-5xl';
    default: return 'text-xl md:text-2xl';
  }
});

const descriptionSizeClass = computed(() => {
  switch (props.descriptionSize) {
    case 'sm': return 'text-sm md:text-base';
    case 'lg': return 'text-lg md:text-xl';
    default: return 'text-base md:text-lg';
  }
});
</script>
