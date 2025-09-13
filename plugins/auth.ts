// plugins/auth.ts
export default defineNuxtPlugin(async () => {
  // Skip on server-side
  if (import.meta.server) return;

  // Wait until auth store is hydrated
  const authStore = useAuthStore();

  // Check if token is expired
  if (authStore.expiresAt && new Date(authStore.expiresAt) < new Date()) {
    authStore.logout();
    return;
  }

  // If authenticated but no user data, fetch it
  if (authStore.isAuthenticated && authStore.accessToken && !authStore.user) {
    const { fetchUserProfile } = useAuth();
    try {
      await fetchUserProfile();
    } catch (error) {
      console.error('Error fetching user profile on app startup:', error);
      // If we can't fetch the profile, log the user out
      if (error instanceof Error && error.message.includes('customerAccessToken is invalid')) {
        authStore.logout();
      }
    }
  }
});
