<template>
  <div class="container mx-auto py-12 px-4">
    <div class="flex flex-col items-center justify-center">
      <div class="w-full max-w-md mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold">Reset Password</h1>
          <p class="text-muted-foreground mt-2">We'll send you an email to reset your password</p>
        </div>

        <div class="bg-card rounded-lg shadow-sm p-6 border">
          <form @submit="onSubmit" class="space-y-4">
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <div v-if="error" class="text-sm text-red-500 p-2 bg-red-50 dark:bg-red-950/30 rounded border border-red-200 dark:border-red-900">
              {{ error }}
            </div>

            <div v-if="success" class="text-sm text-green-500 p-2 bg-green-50 dark:bg-green-950/30 rounded border border-green-200 dark:border-green-900">
              {{ success }}
            </div>

            <Button
              type="submit"
              class="w-full"
              size="lg"
              :disabled="isLoading"
            >
              Send Reset Link
            </Button>

            <div class="text-center text-sm mt-6">
              <p class="text-muted-foreground">
                Remember your password?
                <NuxtLink to="/login" class="text-primary hover:underline font-medium">
                  Back to Login
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

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
const { forgotPassword } = useAuth();
const forgotPasswordFormSchema = toTypedSchema(z.object({
  email: z.string().email({ message: 'Invalid email address' })
}))

const { handleSubmit } = useForm({
  validationSchema: forgotPasswordFormSchema
});

definePageMeta({
  middleware: ['guest'],
  layout: 'default'
});


const email = ref('');
const isLoading = ref(false);
const error = ref<string | undefined>(undefined);
const success = ref<string | undefined>(undefined);

const onSubmit = handleSubmit(async (formData) => {
  isLoading.value = true;
  error.value = '';
  success.value = '';

  const res = await forgotPassword(formData.email);

  if (res.success) {
    success.value = 'Email sent successfully';
  } else {
    error.value = res.error;
  }

  isLoading.value = false;
});
</script>
