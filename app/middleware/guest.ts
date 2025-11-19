export default defineNuxtRouteMiddleware(async () => {
  // Skip middleware if not client-side
  if (import.meta.server) return;

  const { checkAuth } = useAuth();
  const isAuthenticated = await checkAuth();

  // If authenticated and trying to access guest-only pages like login/register
  if (isAuthenticated) {
    return navigateTo('/account');
  }
});
