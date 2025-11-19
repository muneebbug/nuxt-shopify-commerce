<!-- /components/shopify/SortingDropdown.vue -->

<template>
  <div class="sorting-dropdown flex items-center">
    <Select v-model="selected">
      <SelectTrigger class="min-w-[200px] rounded-medium border border-border border-opacity-20">
        <SelectValue placeholder="Sort" />
      </SelectTrigger>
      <SelectContent>
        <SelectLabel/>
        <SelectGroup>
          <SelectItem v-for="option in props.list" :key="option.slug || option.title" :value="option.slug || ''">
            {{ option.title }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type { SortFilterItem } from '@@/lib/constants'
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
    type: Array as PropType<SortFilterItem[]>,
    default: () => [],
  },
  modelValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits<{
  'update:modelValue': [string];
}>();

const selected = useSyncProps(props, 'modelValue', emit);
</script>

