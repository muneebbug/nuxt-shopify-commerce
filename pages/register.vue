<template>
  <div class="container mx-auto py-12 px-4">
    <div class="flex flex-col items-center justify-center">
      <div class="w-full max-w-md mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold">Create an account</h1>
          <p class="text-muted-foreground mt-2">Fill out the form to create your account</p>
        </div>

        <div class="bg-card rounded-lg shadow-sm p-6 border">
          <form @submit="onSubmit" class="space-y-4">
            <FormField v-slot="{ componentField }" name="firstName">
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="John" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="lastName">
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Doe" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" type="checkbox" name="acceptsMarketing">
              <FormItem class="flex flex-row items-start gap-x-3 space-y-0">
                <FormControl>
                  <Checkbox v-bind="componentField" />
                </FormControl>
                <div class="space-y-1 leading-none">
                  <FormLabel>I want to receive marketing emails from you</FormLabel>
                  <FormDescription>
                    You can manage your marketing preferences in the account settings later.
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            </FormField>

            <div v-if="error"
              class="text-sm text-red-500 p-2 bg-red-50 dark:bg-red-950/30 rounded border border-red-200 dark:border-red-900">
              {{ error }}
            </div>

            <Button type="submit" class="w-full" :disabled="isLoading" :loading="isLoading">
              Create Account
            </Button>

            <div class="text-center text-sm">
              <p class="text-muted-foreground">
                Already have an account?
                <NuxtLink to="/login" class="text-primary hover:underline font-medium">
                  Sign in
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
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

definePageMeta({
  middleware: ['guest'],
  layout: 'default'
});

const { register } = useAuth();
const isLoading = ref(false);
const error = ref('');

const registerFormSchema = toTypedSchema(z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }).max(50, { message: 'First name must be less than 50 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }).max(50, { message: 'Last name must be less than 50 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  acceptsMarketing: z.boolean()
}))

const { handleSubmit } = useForm({
  validationSchema: registerFormSchema,
  initialValues: {
    firstName: 'Muneeb',
    lastName: 'Ur Rehman',
    email: 'muneebbug@gmail.com',
    password: 'Pakista7n',
    acceptsMarketing: true
  }
})

const onSubmit = handleSubmit(async (formData) => {
  isLoading.value = true;
  try {
    const res = await register(formData);

    if (res?.success) {
      toast('Account created successfully');
      navigateTo('/account');
    } else {
      error.value = res?.error;
    }
  } catch (err: any) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
})
</script>
