<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { Loader2 } from 'lucide-vue-next'
import { Primitive } from 'reka-ui'

import { cn } from '@/lib/utils'

import type { ButtonVariants } from '.'

import { buttonVariants } from '.'

type Props = {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
  loading?: boolean
  to?: string
} & PrimitiveProps

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
})

const buttonBg = computed(() => {
  const buttonVariant = buttonVariants({ variant: props.variant })
  return buttonVariant.split(' ').find(className => className.startsWith('bg-'))
})
</script>

<template>
  <NuxtLink
    v-if="to"
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }),'space-x-3 cursor-pointer', props.class)"
    :to="to"
  >
    <slot />
  </NuxtLink>

  <Primitive
    v-else
    data-slot="button"
    :as="as"
    :as-child="asChild"
    :disabled="props.loading"
    :class="cn(buttonVariants({ variant, size }),'cursor-pointer relative', props.class)"
  >
    <!-- span bg should be exactly same as  button bg based on variant -->
    <span
      :class="[props.loading ? 'opacity-100' : 'opacity-0', buttonBg]"
      class="absolute left-0 top-0 w-full h-full inset-0 flex items-center justify-center"
    >
      <Loader2
        class="h-4 w-4 animate-spin"
      />
    </span>
    <slot />
  </Primitive>
</template>
