// composables/useCartDrawer.js
export default function useCartDrawer() {
  const isOpened = useState('isOpened', () => false)
  const open = () => {
    isOpened.value = true
  }
  const close = () => {
    isOpened.value = false
  }
  return {
    isOpened,
    open,
    close
  }
}
