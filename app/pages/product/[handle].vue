<template>
  <div>
    <Section>
      <ShopifyProductDetails v-if="product?.id" :product="product" />
    </Section>
    <!-- <pre>
      {{ data?.product?.variants?.nodes }}
    </pre> -->
  </div>
</template>

<script setup>
const route = useRoute();
const { handle } = route.params;

const { getProduct } = useShopify();
const product = await getProduct(handle);
</script>

<style></style>
