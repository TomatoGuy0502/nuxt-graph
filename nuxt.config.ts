// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  experimental: {
    payloadExtraction: false,
  },
  modules: [
    '@nuxtjs/tailwindcss',
    [
      '@nuxtjs/eslint-module',
      {
        /* module options */
      },
    ],
    '@nuxt/devtools',
    '@vueuse/nuxt',
    '@nuxt/content',
    '@unocss/nuxt',
  ],
  content: {
    highlight: {
      theme: 'github-dark',
    },
  },
})
