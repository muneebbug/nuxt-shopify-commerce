import type { Collection } from "@@/lib/shopify/types"

export const useSearch = () => {
  const isSearchOpened = useState('isSearchOpened', () => false)
  const isSearching = useState('isSearching', () => false)
  const popularCollections = useState<Collection[]>(
    'popularCollections',
    () => []
  )

  const open = () => {
    isSearchOpened.value = true
  }
  const close = () => {
    isSearchOpened.value = false
  }
  const getPopularCollections = async () => {
    const { getCollections } = useShopify();
    if (popularCollections.value.length) {
      return;
    }
    const collections = await getCollections();

    popularCollections.value = collections || [];
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
    performSearch,
    popularCollections,
    getPopularCollections
  }
}
