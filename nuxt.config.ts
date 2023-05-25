// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    [
      '@nuxtjs/eslint-module',
      {
        /* module options */
      },
    ],
    '@pinia/nuxt',
    '@nuxt/devtools',
  ],
})
