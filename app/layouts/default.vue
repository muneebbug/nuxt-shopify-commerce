<template>
  <div class="min-h-screen flex flex-col ">
    <LayoutHeader />
    <LayoutCartDrawer />
    <main class="py-12">
      <slot />
    </main>
    <LayoutFooter class="mt-auto" />
  </div>
</template>

<script lang="ts" setup>


</script>

<style></style>
