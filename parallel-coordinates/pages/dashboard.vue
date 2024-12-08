<template>
  <div
    class="flex flex-col items-start space-x-2 w-full py-32 px-5 overflow-y-auto"
  >
    <!-- <HorizontalNavigation /> -->
    <div class="row grid grid-cols-1 w-full place-items-center">
      <Parallelcoordinates />
      <!-- <Table /> -->
    </div>
  </div>
</template>
<script>
definePageMeta({
  layout: "dashboard layout",
});
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
<style scoped>
/* .backgroundCont {
  background-color: #fafafa;
} */
body {
  transition: color 0.3s, background-color 0.3s;
}
</style>
