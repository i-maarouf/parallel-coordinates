<template>
  <div class="flex flex-col items-start space-x-2 w-full p-5 overflow-y-auto">
    <div class="row grid grid-cols-1 w-full place-items-center">
      <Parallelcoordinates />
      <!-- <Table /> -->
    </div>
  </div>
</template>
<script>
// definePageMeta({
//   layout: "default",
// });
export default {
  data() {
    return {};
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
