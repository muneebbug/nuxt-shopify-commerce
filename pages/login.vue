<template>
  <div class="container mx-auto py-12 px-4">
    <div class="flex flex-col items-center justify-center">
      <div class="w-full max-w-md mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold">Welcome back</h1>
          <p class="text-muted-foreground mt-2">Sign in to your account</p>
        </div>

        <div class="bg-card rounded-lg shadow-sm p-6 border">
          <form @submit="onSubmit" class="space-y-4">
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel class="flex items-center justify-between">
                  Password
                  <NuxtLink to="/forgot-password" class="text-sm text-muted-foreground hover:underline">
                    Forgot password?
                  </NuxtLink>
                </FormLabel>

                <FormControl>
                  <Input type="password" placeholder="Enter your password" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <div v-if="error"
              class="text-sm text-red-500 p-2 bg-red-50 dark:bg-red-950/30 rounded border border-red-200 dark:border-red-900">
              {{ error }}
            </div>

            <Button type="submit" class="w-full" :disabled="isLoading" :loading="isLoading">
              Sign In
            </Button>

            <div class="text-center text-sm mt-6">
              <p class="text-muted-foreground">
                Don't have an account?
                <NuxtLink to="/register" class="text-primary hover:underline font-medium">
                  Create account
                </NuxtLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

const loginFormSchema = toTypedSchema(z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' })
}))

const { handleSubmit } = useForm({
  validationSchema: loginFormSchema
});


definePageMeta({
  middleware: ['guest'],
  layout: 'default'
});

const route = useRoute();
const router = useRouter();
const { login } = useAuth();


const isLoading = ref(false);
const error = ref('');

const onSubmit = handleSubmit(async (formData) => {
  error.value = '';
  isLoading.value = true;

  try {
    const res = await login(formData);

    if (res?.success) {
      toast('Logged in successfully');

      // Redirect to the original page or account page
      const redirectPath = route.query.redirect as string || '/account';
      router.push(redirectPath);
    } else {
      error.value = res?.error;
    }
  } catch (err: any) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
});
</script>
