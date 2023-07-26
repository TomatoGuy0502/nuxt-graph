/// <reference types="vitest" />

import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    Vue(),
    AutoImport({
      imports: ['vue', '@vueuse/core'],
      dirs: ['./composables/**'],
      dts: true,
    }),
    Components({
      dirs: ['./components/**'],
      dts: true,
    }),
  ],
  resolve: {
    alias: {
      '~/': `${process.cwd()}/`,
    },
  },
  test: {},
})
