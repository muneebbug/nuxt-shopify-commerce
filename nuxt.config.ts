import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@formkit/auto-animate',
    '@vueuse/nuxt',
    '@nuxtjs/google-fonts',
    '@pinia-plugin-persistedstate/nuxt',
    'shadcn-nuxt',
    'nuxt-headlessui',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@vee-validate/nuxt',
    '@nuxt/eslint',
  ],
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },
  // icon
  icon: {
    customCollections: [
      {
        prefix: 'local',
        dir: './app/assets/icons',
      }
    ]
  },

  googleFonts: {
    families: {
      "DM Sans": ['400', '500', '600', '700', '800', '900'],
      Oswald: ['400', '500', '600', '700', '800', '900'],
    },
  },

  css: [
    './app/assets/css/tailwind.css',
    './app/assets/css/main.css',
  ],



  // module::headlessui
  headlessui: {
    prefix: 'Headless',
  },

  // module::color-mode
  colorMode: {
    classSuffix: '',
  },


  // devtools: { enabled: true },

  devServer: {
    port: 3000,
    host: '127.0.0.1'
  },



  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  compatibilityDate: '2025-07-15',
  runtimeConfig: {
    shopifyWebhookSecret: process.env.SHOPIFY_WEBHOOK_SECRET,
    storeDomain: import.meta.env.NUXT_SHOPIFY_STOREFRONT_STORE_DOMAIN,
    apiVersion: import.meta.env.NUXT_SHOPIFY_STOREFRONT_API_VERSION,
    publicAccessToken: import.meta.env.NUXT_SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN
  },

})
