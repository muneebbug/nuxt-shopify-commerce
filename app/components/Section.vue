<template>
  <section
    :class="[
      'container mx-auto w-full transition-colors duration-300 py-8'
    ]"
  >
    <div :class="[pageWidth ? 'mx-auto px-4 sm:px-6 lg:px-8' : '', contentAlignClass]">
      <slot />
    </div>
  </section>
</template>

<script lang="ts" setup>
const props = defineProps({
  pageWidth: {
    type: Boolean,
    default: true, // limits content to container width
  },
  align: {
    type: String,
    default: 'left', // 'left', 'center', 'right'
  }
});


const contentAlignClass = computed(() => {
  switch (props.align) {
    case 'center': return 'text-center';
    case 'right': return 'text-right';
    default: return 'text-left';
  }
});
</script>
