<template>
  <div
    class="border-b border-gray-200 dark:border-gray-800 w-full px-8 backdrop-blur-md justify-between flex"
  >
    <UHorizontalNavigation :links="links" />
    <div class="developer flex items-center gap-2">
      <div class="text">Developed by</div>
      <img src="/Bilmar_logo1.png" width="100px" alt="" srcset="" />
    </div>
    <!-- <NuxtTour /> -->
  </div>
</template>
<script lang="ts" setup>
const links = [
  [
    {
      label: "Dashboard",
      icon: "i-heroicons-chart-bar-square",
      to: "/dashboard",
    },
    {
      label: "Retrofit Planner",
      icon: "i-heroicons-chart-bar",
      to: "/retrofit-planner",
    },
    {
      label: "Favourites",
      icon: "i-heroicons-star",
      to: "/favourites",
      labelClass: "favouritesPage",
    },
    {
      label: "Scenario Comparison",
      icon: "i-heroicons-arrows-right-left",
      disabled: true,
      to: "/compare",
    },

    {
      label: "Settings",
      icon: "i-heroicons-cog-8-tooth",
      labelClass: "settingsPage",
      disabled: true,
      to: "/settings",
    },
  ],
];
</script>
<style scoped>
.developer {
  width: 200px;
}
.text {
  white-space: nowrap;
  color: #737277;
  font-size: 14px;
}
img {
  max-width: none;
}
</style>
