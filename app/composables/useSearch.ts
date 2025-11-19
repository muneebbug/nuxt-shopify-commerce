export const useSearch = () => {
  const isSearchOpened = useState('isSearchOpened', () => false)
  const isSearching = useState('isSearching', () => false)
  const open = () => {
    isSearchOpened.value = true
  }
  const close = () => {
    isSearchOpened.value = false
  }

  const performSearch = async (query: string, type: 'normal' | 'predictive' = 'normal') => {
    isSearching.value = true;
    const { performPredictiveSearch } = useShopify();
    const results = await performPredictiveSearch({ query: query });
    if (type === 'predictive' && !isSearchOpened.value) {
      isSearchOpened.value = true;
    }
    isSearching.value = false;
    return results;

  }
  return {
    isSearchOpened,
    isSearching,
    open,
    close,
    performSearch
  }
}
