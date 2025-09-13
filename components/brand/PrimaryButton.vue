<template>
  <Button
:class="[props.tiny ? 'btn--tiny' : '']"
    class="button bg-primary transition-all duration-300 inline-flex content-center items-center justify-center cursor-pointer break-words rounded-medium disabled:bg-muted disabled:cursor-not-allowed">

    <Icon v-if="props.loading" name="local:button-loader" size="24" class="w-[18px]" />
    <slot v-else />
  </Button>
</template>

<script setup>
import { Button } from '@/components/ui/button'

const props = defineProps({
  tiny: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  }
});
</script>


<style lang="scss" scoped>
.button {
  min-width: calc(12rem + 2px);
  min-height: 5.6rem;
  padding: 1rem 3rem;
  line-height: 1.6rem;
  font-weight: 700;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.1);
  }

  @media screen and (max-width: 749px) {
    padding: 1rem 2rem;
  }

  @media screen and (min-width: 992px) {
    padding: 1.5rem 5rem;
  }
}

.btn--tiny {
  min-height: 4.4rem;
  min-width: 4.4rem;
  padding: 10px;
  @apply rounded-small;
}
</style>