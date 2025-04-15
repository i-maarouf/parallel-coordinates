<template>
  <div
    class="border-b border-gray-200 dark:border-gray-800 w-full px-5 backdrop-blur-md justify-between flex"
  >
    <UHorizontalNavigation :links="links" />
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
      label: "Favourites",
      icon: "i-heroicons-star",
      to: "/favourites",
      labelClass: "favouritesPage",
    },
    {
      label: "Scenario Comparison",
      icon: "i-heroicons-arrows-right-left",
      disabled: true,
      to: "/",
    },
    {
      label: "Settings",
      icon: "i-heroicons-cog-8-tooth",
      labelClass: "settingsPage",
      to: "/settings",
    },
  ],
];
</script>
