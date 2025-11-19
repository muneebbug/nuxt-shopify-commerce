// composables/useHelpers.ts
export function useHelpers() {
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  return {
    delay
  };
}
