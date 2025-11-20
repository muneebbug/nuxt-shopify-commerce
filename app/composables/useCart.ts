// composables/useCart.ts
import type { Cart } from '@@/lib/shopify/types';
export function useCart() {
  const { createCart, addToCart, removeFromCart, getCart, updateCart } = useShopify();
  const cartStore = useCartStore();

  const initializeCart = async (cart : Cart | undefined) => {
    cartStore.setLoading(true);
    try {
      cartStore.setCart(cart);
    } finally {
      cartStore.setLoading(false);
    }
  };


  async function addItem(selectedVariantId: string | undefined, quantity: number = 1): Promise<{ success: boolean; error?: string }> {
    const cartId = useCookie('cartId')?.value;
    if (!cartId || !selectedVariantId) return { success: false, error: 'Error adding item to cart' };

    try {
      const cart = await addToCart(cartId, [{ merchandiseId: selectedVariantId, quantity }]);
      cartStore.setCart(cart);

      const { isOpened, open } = useCartDrawer();

      if (!isOpened.value === true) {
        open();
      }
      return { success: true };
    }
    catch (e) {
      console.log(e);
      return { success: false, error: 'Error adding item to cart' };
    }
  };


  async function removeItem(merchandiseId: string): Promise<{ success: boolean; error?: string }> {
    console.log('removeItem', merchandiseId);
    const cartId = useCookie('cartId')?.value;

    if (!cartId) {
      return { success: false, error: 'Missing cart ID' };
    }

    try {
      const cart = await getCart(cartId);

      if (!cart) {
        return { success: false, error: 'Error fetching cart' };
      }

      const lineItem = cart.lines.find((line) => line.merchandise.id === merchandiseId);

      if (lineItem && lineItem.id) {
        const cart = await removeFromCart(cartId, [lineItem.id]);
        cartStore.setCart(cart);
        return { success: true };
      } else {
        return { success: false, error: 'Item not found in cart' };
      }
    } catch (e) {
      if (e instanceof Error) {
        return { success: false, error: e.message };
      }
      return { success: false, error: 'Error removing item from cart' };
    }
  }  async function updateItemQuantity(
    payload: {
      merchandiseId: string;
      quantity: number;
    }
  ): Promise<{ success: boolean; error?: string }> {
    const cartId = useCookie('cartId')?.value;

    if (!cartId) {
      return { success: false, error: 'Missing cart ID' };
    }

    const { merchandiseId, quantity } = payload;

    try {
      const cart = await getCart(cartId);

      if (!cart) {
        return { success: false, error: 'Error fetching cart' };
      }

      const lineItem = cart.lines.find((line) => line.merchandise.id === merchandiseId);

      if (lineItem && lineItem.id) {
        if (quantity === 0) {
          const cart = await removeFromCart(cartId, [lineItem.id]);
          cartStore.setCart(cart);
        } else {
          const cart = await updateCart(cartId, [
            {
              id: lineItem.id,
              merchandiseId,
              quantity
            }
          ]);

          cartStore.setCart(cart);
        }
      } else if (quantity > 0) {
        // If the item doesn't exist in the cart and quantity > 0, add it
        const cart = await addToCart(cartId, [{ merchandiseId, quantity }]);
        cartStore.setCart(cart);
      }
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, error: 'Error updating item quantity' };
    }
  }

  async function redirectToCheckout(): Promise<{ success: boolean; error?: string }> {
    const cartId = useCookie('cartId')?.value;
    if (!cartId) return { success: false, error: 'Missing cartId Value' };

    try {
      const cart = await getCart(cartId);

      if (!cart) return { success: false, error: 'Error Fetching Cart' };

      await navigateTo(cart.checkoutUrl, { external: true });
      return { success: true };
    } catch {
      return { success: false, error: 'Error redirecting to checkout' };
    }
  }
/*
this function should not be called. its useless at the time as it causes ssr issues.
if i call this function before page load with await or onServerPrefetch, it causes ssr issues
as the useCookie() is not available outside nuxt context
therefore i am opting for a different solution but keeping this function here for reference
*/
  async function createCartAndSetCookie() {
    const cart = await createCart();
    const cookie = useCookie('cartId');
    cookie.value = cart.id!
    return cart;
  }

  return {
    initializeCart,
    addItem,
    removeItem,
    updateItemQuantity,
    redirectToCheckout,
    createCartAndSetCookie
  };
}
