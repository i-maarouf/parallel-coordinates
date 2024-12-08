<template>
  <UHorizontalNavigation
    :links="links"
    class="border-b border-gray-200 dark:border-gray-800 w-full px-5 backdrop-blur-md"
  />
</template>
<script>
export default {
  data() {
    return {
      links: [
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
            disabled: true,
            to: "/",
          },
        ],
      ],
    };
  },
};
</script>
