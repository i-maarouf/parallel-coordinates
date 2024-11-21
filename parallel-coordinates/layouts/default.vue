<template>
  <div class="mainContainer">
    <div
      :class="
        isDark
          ? 'sideBarContainer darkMode p-1 relative'
          : 'sideBarContainer lightMode p-1 relative'
      "
    >
      <div class="p-1">
        <img src="/ClientLogo.jpeg" width="200px" alt="" srcset="" />
      </div>
      <UDivider />

      <UVerticalNavigation :links="links" class="linksContainer p-1">
        <template #default="{ link }">
          <span class="group-hover:text-primary relative">{{
            link.label
          }}</span>
        </template>
      </UVerticalNavigation>
      <!-- 
      <UPopover class="px-1" :popper="{ offsetDistance: 10 }">
        <UButton
          color="white"
          variant="ghost"
          label="Settings"
          icon="i-heroicons-cog-6-tooth"
        />

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
      </UPopover> -->

      <div class="fixed bottom-5">
        <UDivider />
        <div class="flex items-center justify-center gap-2">
          <span class="text-xs"> powered by </span>
          <img src="/Bilmar_logo1.jpeg" width="100px" alt="" srcset="" />
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>
<script setup lang="ts">
import { darkMode } from "#tailwind-config";

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
    icon: "i-heroicons-home",
    to: "/",
  },

  {
    label: "Favourites",
    icon: "i-heroicons-user-group",
    to: "/favourites",
  },
  // {
  //   label: "Settings",
  //   icon: "i-heroicons-cog-8-tooth",
  //   darkMode: true,
  // },
];
</script>

<style>
.buttonUI {
  padding: 0;
}
.navBarContainer > div > div {
  display: flex;
  width: 100% !important;
  justify-content: space-between !important;
}
</style>
<style scoped>
.mainContainer {
  display: flex;
  /* padding: 10px; */
}

.lightMode {
  border-right: 1px solid #e3dada;
}
.darkMode {
  border-right: 1px solid #f6f6f61a !important;
}
body {
  transition: ease-in-out 0.3s, background-color 0.3s;
}
</style>
