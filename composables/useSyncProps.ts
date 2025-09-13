import { computed, type WritableComputedRef } from 'vue';

type EmitUpdate<K extends string, T> = (event: `update:${K}`, value: T) => void;

export function useSyncProps<
  Props extends Record<string, unknown>,
  K extends keyof Props & string
>(
  props: Props,
  key: K,
  emit: EmitUpdate<K, Props[K]>
): WritableComputedRef<Props[K]> {
  return computed({
    get: () => props[key],
    set: (value) => emit(`update:${key}`, value),
  });
}
