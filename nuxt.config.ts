// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],
  app:{
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/img/ccc-logo-color-favicon.png' },
      ],
    },
  },
  devtools: {
    enabled: true
  },
  pages: false,

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  ui: {
    colorMode: false
  },
  runtimeConfig: {
    s3Bucket: process.env.NUXT_S3_BUCKET,
    s3Key: process.env.NUXT_S3_KEY,
    s3SecretKey: process.env.NUXT_S3_SECRET_KEY,
  },
})
