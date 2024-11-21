<template>
  <UContainer>
    <UPage>
      <template #left>
        <UAside :links="links">
          <!-- <UNavigationTree :links="links" /> -->
          <template #panel>
            <div class="p-2">
              <ClientOnly>
                <UButton
                  :icon="
                    !isDark
                      ? 'i-heroicons-moon-20-solid'
                      : 'i-heroicons-sun-20-solid'
                  "
                  color="gray"
                  variant="ghost"
                  :label="isDark ? 'Light Mode' : 'Dark Mode'"
                  aria-label="Theme"
                  @click="isDark = !isDark"
                />
                <template #fallback>
                  <div class="w-8 h-8" />
                </template>
              </ClientOnly>
            </div>
          </template>
        </UAside>
      </template>

      <template #bottom>
        <UDivider type="dashed" class="my-6" />

        <UPageLinks :links="pageLinks" />
      </template>

      <slot />
    </UPage>
  </UContainer>
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
    label: "Playground",
    icon: "i-simple-icons-stackblitz",
    // to: "/playground",
  },
  {
    label: "Roadmap",
    icon: "i-heroicons-map",
    // to: "/roadmap",
  },
  {
    label: "Pro",
    icon: "i-heroicons-square-3-stack-3d",
    // to: "/pro",
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
