// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },

  modules: ["@pinia/nuxt", "@nuxt/ui", "@nuxthub/core"],
  // extends: ["@nuxt/ui-pro"],
  colorMode: {
    preference: "light",
  },
});
