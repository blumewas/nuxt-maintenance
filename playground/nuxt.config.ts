export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  maintenance: {
    enabled: false,
    exclude: ['/excluded'],
  },
})
