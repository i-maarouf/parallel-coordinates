<template>
  <UContainer>
    <UPage>
      <template #left>
        <UAside :links="links">
          <template #top>
            <div class="p-1 imgCont">
              <img src="/ClientLogo.jpeg" width="200px" alt="" srcset="" />
            </div>
          </template>

          <template #bottom>
            <UDivider type="dashed" class="my-6" />

            <UPageLinks :links="pageLinks" />
          </template>
        </UAside>
      </template>
    </UPage>
  </UContainer>
  <slot />
</template>
<script setup lang="ts">
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});
const links = [
  {
    label: "Home",
    icon: "i-heroicons-book-open",
    to: "/",
  },
  {
    label: "Favourites",
    icon: "i-heroicons-star",
    to: "/favourites",
  },
];

const pageLinks = [
  {
    icon: "i-heroicons-heart",
    label: "Learn how to contribute",
    // to: "/getting-started/contributing",
    target: "_blank",
  },
];
</script>
