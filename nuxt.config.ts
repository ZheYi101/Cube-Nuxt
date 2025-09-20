// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Cube"
    }
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@element-plus/nuxt", "@nuxt/fonts"],
  css: ["~/assets/css/main.css"]
});
