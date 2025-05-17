<!-- /components/shopify/SortingDropdown.vue -->

<template>
  <div class="sorting-dropdown flex items-center">
    <Select v-model="selected">
      <SelectTrigger class="min-w-[200px] rounded-medium border border-border border-opacity-20">
        <SelectValue placeholder="Sort" />
      </SelectTrigger>
      <SelectContent>
        <SelectLabel>
        </SelectLabel>
        <SelectGroup>
          <SelectItem :value="option.slug" v-for="option in props.list" :key="option.slug">
            {{ option.title }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>

<script lang="ts" setup>
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const props = defineProps({
  list: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  modelValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);
const selected = useSyncProps<string>(props, 'modelValue', emit);
</script>

