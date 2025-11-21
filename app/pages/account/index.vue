<template>
  <Section >
      <div class="flex flex-col gap-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold">My Account</h1>
            <p class="text-muted-foreground mt-1">Manage your account settings and view orders</p>
          </div>
          <Button @click="handleLogout">
            Sign Out
          </Button>
        </div>

        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <Icon name="line-md:loading-twotone-loop" class="h-8 w-8 animate-spin text-primary" />
        </div>

        <div v-else-if="user" class="gap-6">
          <!-- Account Information -->
          <div class="md:col-span-2 space-y-6">
            <div class="bg-card border rounded-lg p-6">
              <h2 class="text-xl font-semibold mb-4">Account Information</h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 class="text-sm text-muted-foreground mb-1">Name</h3>
                  <p>{{ user.firstName }} {{ user.lastName }}</p>
                </div>

                <div>
                  <h3 class="text-sm text-muted-foreground mb-1">Email</h3>
                  <p>{{ user.email }}</p>
                </div>

                <div>
                  <h3 class="text-sm text-muted-foreground mb-1">Member Since</h3>
                  <p>{{ formatDate(user.createdAt) }}</p>
                </div>

                <div>
                  <h3 class="text-sm text-muted-foreground mb-1">Marketing</h3>
                  <p>{{ user.acceptsMarketing ? 'Subscribed' : 'Not Subscribed' }}</p>
                </div>
              </div>
            </div>

            <!-- Default Address -->
            <div class="bg-card border rounded-lg p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold">Default Address</h2>
              </div>

              <div v-if="user.defaultAddress" class="border rounded-md p-4 bg-background">
                <p class="font-medium">{{ user.defaultAddress.firstName }} {{ user.defaultAddress.lastName }}</p>
                <p v-if="user.defaultAddress.company" class="text-muted-foreground">{{ user.defaultAddress.company }}</p>
                <p>{{ user.defaultAddress.address1 }}</p>
                <p v-if="user.defaultAddress.address2">{{ user.defaultAddress.address2 }}</p>
                <p>{{ user.defaultAddress.city }}, {{ user.defaultAddress.province }} {{ user.defaultAddress.zip }}</p>
                <p>{{ user.defaultAddress.country }}</p>
                <p v-if="user.defaultAddress.phone" class="mt-2 text-sm">
                  <span class="text-muted-foreground">Phone:</span> {{ user.defaultAddress.phone }}
                </p>
              </div>

              <div v-else class="border rounded-md p-4 bg-muted/30 text-center">
                <p class="text-muted-foreground">No default address set</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <p class="text-lg text-muted-foreground">Unable to load account information.</p>
          <Button variant="outline" class="mt-4" @click="refresh">
            Try Again
          </Button>
        </div>
      </div>
  </Section>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

definePageMeta({
  middleware: ['auth'],
  layout: 'default'
});

const { user, logout, fetchUserProfile } = useAuth();

const isLoading = ref(true);

onMounted(async () => {
  try {
    await fetchUserProfile();
  } finally {
    isLoading.value = false;
  }
});

function formatDate(dateString: string) {
  return format(new Date(dateString), 'MMMM d, yyyy');
}

function handleLogout() {
  logout();
}

async function refresh() {
  isLoading.value = true;
  try {
    await fetchUserProfile();
  } finally {
    isLoading.value = false;
  }
}
</script>
