
import { toast } from 'vue-sonner'

export function useAuth() {
  const authStore = useAuthStore();
  const { signInWithEmailAndPassword, registerAccount, getCustomer, customerRecover } = useShopify();

  const login = async (formData:
    {
      email: string, password: string
    }) => {
    try {
      const res = await signInWithEmailAndPassword(formData);

      const { customerAccessToken } = res;

      if (customerAccessToken) {
        authStore.setAuth(customerAccessToken.accessToken, customerAccessToken.expiresAt);

        // Fetch customer data
        await fetchUserProfile();

        return { success: true };
      }

      if (res.customerUserErrors.length > 0) {
        const error = res.customerUserErrors[0];
        return {
          success: false,
          error: error.message
        }
      }
    } catch (e: any) {
      return {
        success: false,
        error: e.error.message || 'An error occurred during login'
      };
    }
  };

  const register = async (userData: {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    acceptsMarketing: boolean
  }) => {
    try {
      const res = await registerAccount(userData);

      const { customer } = res;

      if (customer) {
        // Auto login after registration
        return await login({
          email: userData.email,
          password: userData.password
        });
      }

      if (res.customerUserErrors.length > 0) {
        const error = res.customerUserErrors[0];
        return {
          success: false,
          error: error.message
        }
      }

    } catch (e: any) {
      return {
        success: false,
        error: e.error.message || 'An error occurred during registration'
      };
    }
  };


  const fetchUserProfile = async () => {
    if (!authStore.accessToken) return null;

    try {
      const customer = await getCustomer(authStore.accessToken);

      if (customer) {
        authStore.setUser(customer);
        return customer;
      }

      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await customerRecover(email);

      if (res.customerUserErrors.length > 0) {
        const error = res.customerUserErrors[0];
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true
      }
    } catch (e: any) {
      return {
        success: false,
        error: e.error.message || 'Something went wrong. Please try again.'
      }
    }
  };

  const logout = async () => {
    await authStore.logout();
    navigateTo('/login');
    toast('Logged out', {
      description: 'You have been successfully logged out.'
    });
  };

  const checkAuth = async () => {
    if (!authStore.isAuthenticated || !authStore.accessToken) {
      return false;
    }

    // Check token expiry
    if (authStore.expiresAt && new Date(authStore.expiresAt) < new Date()) {
      authStore.logout();
      return false;
    }

    // If we have a token but no user data, fetch it
    if (!authStore.user) {
      await fetchUserProfile();
    }

    return true;
  };

  return {
    login,
    register,
    logout,
    fetchUserProfile,
    checkAuth,
    forgotPassword,
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    accessToken: computed(() => authStore.accessToken)
  };
}
