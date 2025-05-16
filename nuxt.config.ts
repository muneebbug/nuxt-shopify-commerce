import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)
import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
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
  ],
  alias: {
    '@': resolve('./'),
  },

  // icon
  icon: {
    customCollections: [
      {
        prefix: 'local',
        dir: './assets/icons',
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
    resolve('./assets/css/tailwind.css'),
    resolve('./assets/css/main.css')
  ],

  imports: {
    dirs: [resolve('./stores'), '~/stores'],
  },

  // module::pinia
  pinia: {
    storesDirs: ['~/stores/**', '#/stores/**', '@/stores/**'],
  },

  // module::headlessui
  headlessui: {
    prefix: 'Headless',
  },

  // module::color-mode
  colorMode: {
    classSuffix: '',
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        baseUrl: '.'
      }
    }
  },

  devtools: { enabled: true },

  devServer: {
    port: 3000,
    host: '127.0.0.1'
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  runtimeConfig: {
    public: {
      storeDomain: process.env.NUXT_PUBLIC_SHOPIFY_STOREFRONT_STORE_DOMAIN,
      apiVersion: process.env.NUXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION,
      publicAccessToken: process.env.NUXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN
    }
  },


})
