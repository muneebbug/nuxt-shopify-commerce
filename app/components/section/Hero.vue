<template>
  <Section>
        <div class="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div class="flex flex-col justify-center space-y-4">
            <div class="space-y-4">
              <h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Premium Products for Your Lifestyle
              </h1>
              <p class="max-w-[600px] text-muted-foreground">
                Discover our curated collection of high-quality products designed to enhance your everyday life.
              </p>
            </div>
            <div class="flex gap-2">
                <Button to="/collection/all" size="lg">Shop Now</Button>
                <Button to="/collection/featured" size="lg" variant="outline">Explore Featured</Button>
            </div>
          </div>
          <div class="relative  overflow-hidden rounded-xl md:h-auto">
            <img
              alt="Hero Image"
              class="object-cover w-full h-full"
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=80"
            >
          </div>
        </div>
    </Section>
</template>

<script lang="ts" setup>
import { Button } from '@/components/ui/button'
</script>

<style>

</style>
