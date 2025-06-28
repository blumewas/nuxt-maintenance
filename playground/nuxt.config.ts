export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  maintenance: {
    enabled: true,
    exclude: ['/excluded', '/excluded/:id'],
    mode: 'redirect',
  },
})
