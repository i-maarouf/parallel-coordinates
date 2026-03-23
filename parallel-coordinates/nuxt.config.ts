// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   compatibilityDate: "2026-03-23",
  nitro: {
    preset: "netlify",
  },
  devtools: { enabled: false },
  ssr: false,
  modules: [
    "@pinia/nuxt",
    "@nuxt/ui",
    "nuxt-tour",
    
    "nuxt-charts",
  ],
  
  // extends: ["@nuxt/ui-pro"],
  colorMode: {
    preference: "light",
  },
});
