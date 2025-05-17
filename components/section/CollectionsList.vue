<template>
  <Section className="py-10 md:py-16">
    <SectionHeader
      title="Shop by Category"
      description="Browse our featured collections"
      centered
    />
    <div class="mt-8 md:mt-10">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        <ShopifyCollectionItem v-for="collection in collections.slice(0, 3)" :key="collection.id" :collection="collection" />
      </div>
      <div class="mt-10 flex justify-center">
        <NuxtLink to="/collection">
          <Button variant="outline">View all categories</Button>
        </NuxtLink>
      </div>
    </div>
  </Section>
</template>

<script setup>
import { Button } from '@/components/ui/button'
const { getCollections } = useShopify();

const collections = await getCollections();
</script>

<style></style>
