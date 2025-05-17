<template>
  <Section background="muted" className="py-10 md:py-16">
    <SectionHeader
      title="Featured Collection"
      description="Check out our newest and most popular products"
      centered
    />
    <div class="mt-8 md:mt-10">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <ShopifyProductItem v-for="product in products.slice(0, 4)" :key="product.id" :product="product" />
      </div>
      <div class="mt-10 flex justify-center">
        <NuxtLink to="/collection/all">
          <Button>View all products</Button>
        </NuxtLink>
      </div>
    </div>
  </Section>
</template>

<script setup>
import { Button } from '@/components/ui/button'
const { getCollectionProducts } = useShopify();

const products = await getCollectionProducts({ collection: 'all', sortKey: 'CREATED_AT', reverse: false });
</script>

<style></style>
