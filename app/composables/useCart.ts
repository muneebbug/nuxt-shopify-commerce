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


  async function addItem(selectedVariantId : string | undefined, quantity : number = 1){
    const cartId = useCookie('cartId')?.value;
    if (!cartId || !selectedVariantId) return 'Error adding item to cart';

    try {
      const cart = await addToCart(cartId, [{ merchandiseId: selectedVariantId, quantity }]);
      cartStore.setCart(cart);

      const { isOpened, open } = useCartDrawer();

      if (!isOpened.value === true) {
        open();
      }
    }
    catch (e) {
      console.log(e);
      return 'Error adding item to cart';
    }
  };


  async function removeItem(merchandiseId: string) {
    console.log('removeItem', merchandiseId);
  const cartId = useCookie('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  try {
    const cart = await getCart(cartId);

    if (!cart) {
      return 'Error fetching cart';
    }

    const lineItem = cart.lines.find((line) => line.merchandise.id === merchandiseId);

    if (lineItem && lineItem.id) {
      const cart = await removeFromCart(cartId, [lineItem.id]);
      cartStore.setCart(cart);
    } else {
      return 'Item not found in cart';
    }
  } catch (e) {
    if (e instanceof Error) {
      return e.message;
    }
    return 'Error removing item from cart';
  }
  }async function updateItemQuantity(
  payload: {
    merchandiseId: string;
    quantity: number;
  }
) {
 const cartId = useCookie('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart(cartId);

    if (!cart) {
      return 'Error fetching cart';
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
  } catch (e) {
    console.error(e);
    return 'Error updating item quantity';
  }
}

  async function redirectToCheckout() {
    const cartId = useCookie('cartId')?.value;
    if (!cartId) return 'Missing cartId Value';

    const cart = await getCart(cartId);

    if (!cart) return 'Error Fetching Cart';

    navigateTo(cart.checkoutUrl, {external: true});
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
