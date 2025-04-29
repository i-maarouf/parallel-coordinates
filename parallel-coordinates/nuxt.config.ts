// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  ssr: false,
  modules: [
    "@pinia/nuxt",
    "@nuxt/ui",
    "@nuxthub/core",
    "nuxt-tour",
    "@nuxtjs/supabase",
  ],
  supabase: {
    // Options
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false,
    redirectOptions: {
      login: "/",
      callback: "/confirm",
      include: undefined,
      exclude: [],
      saveRedirectToCookie: false,
    },
  },

  // extends: ["@nuxt/ui-pro"],
  colorMode: {
    preference: "light",
  },
});
