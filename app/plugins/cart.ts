// plugins/cart.ts

export default defineNuxtPlugin(async () => {
    const { initializeCart } = useCart();
    const { getCart, createCart } = useShopify();
    const cookie = useCookie('cartId');
        if (!cookie.value) {
            try {
                const cart = await createCart();
                cookie.value = cart.id!
                if (cart) {
                    initializeCart(cart);
                }
            } catch (error) {
                console.error('Failed to create cart and set cookie:', error);
            }
        }
        else {
            try {
                const cart = await getCart(cookie.value);
                if (cart) {
                    initializeCart(cart);
                }
            } catch (error) {
                console.error('Failed to get cart:', error);
            }
        }
});
