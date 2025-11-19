export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware if not client-side
  if (import.meta.server) return;

  const { checkAuth } = useAuth();
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    // Store the path we were trying to access
    const redirectPath = to.fullPath;

    if (redirectPath !== '/login' && redirectPath !== '/register') {
      return navigateTo({
        path: '/login',
        query: { redirect: redirectPath }
      });
    }
  }

  // If user is authenticated and trying to access login or register, redirect to account
  if (isAuthenticated && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/account');
  }
});
